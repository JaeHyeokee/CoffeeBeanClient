import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import x from '../../image/x.svg';
import Swal from 'sweetalert2';
import { Card, Carousel, ProgressBar } from 'react-bootstrap';
import styles from '../../css/product/ProductDetail.module.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Chat from '../chatting/Chat';
import Footer from '../components/Footer';
import moment from 'moment';
import { SERVER_HOST } from '../../apis/Api';

const ProductDetail = () => {
    const { id } = useParams();  // productId
    const [product, setProduct] = useState(null);
    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const { userInfo, isLogin } = useContext(LoginContext);
    const userId = userInfo?.userId;
    const navigate = useNavigate();
    const [listArr, setListArr] = useState([]);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [isDipped, setIsDipped] = useState(false);

    useEffect(() => {
        axios.get(`http://${SERVER_HOST}/product/detail/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('상품 조회 실패', error);
            });
    }, [id]);

    useEffect(() => {
        if (product) {
            axios.get(`http://${SERVER_HOST}/sell/product/sortedlist/${product.user.userId}/1/판매중`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setListArr(response.data.slice(0, 3));
                    } else {
                        console.log('데이터 로드 실패');
                    }
                })
                .catch(error => {
                    console.error('판매중 상품 리스트 조회 실패', error);
                });
            
            checkChatRoomExists();
        }
    }, [product]);

    useEffect(() => {
        if (product && userId) {
            axios.get(`http://${SERVER_HOST}/dips/status`, {
                params: { userId, productId: id }
            })
            .then(response => {
                setIsDipped(response.data.isDipped);
            })
            .catch(error => {
                console.error('찜 상태 확인 실패', error);
            });
        }
    }, [product, userId]);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const checkChatRoomExists = async () => {
        try {
            const sellerId = product.user.userId;
            const response = await axios.get(`http://${SERVER_HOST}/chatRooms/check`, {
                params: { buyerId: userId, sellerId, productId: id }
            });

            if (response.data.exists) {
                setChatRoomId(response.data.chatRoomId);
            }
        } catch (error) {
            console.error("채팅방 존재 여부 확인 실패", error);
        }
    };

    const toggleChatSidebar = async () => {
        if (chatRoomId) {
            setIsChatSidebarOpen(true);
            return;
        }

        try {
            const response = await axios.post(`http://${SERVER_HOST}/chatRooms`, null, {
                params: { sellerId: product.user.userId, buyerId: userId, productId: id },
                headers: { 'Content-Type': 'application/json' }
            });

            setChatRoomId(response.data.chatRoomId);
            setIsChatSidebarOpen(true);
        } catch (error) {
            console.error("채팅방 생성 실패", error.response ? error.response.data : error.message);
        }
    };

    const dip = async () => {
        if (!isLogin) {
            Swal.fire("로그인이 필요합니다.", "찜하기 기능을 사용하시려면 로그인이 필요합니다.", "warning");
            navigate('/login');
            return;
        }

        try {
            if (isDipped) {
                // 찜 취소 요청
                await axios.delete(`http://${SERVER_HOST}/delete/product/${userId}/${id}`);
                setIsDipped(false);
                Swal.fire("찜 상품에서 제외 했습니다.", "", "success");
            } else {
                // 찜 추가 요청
                await axios.post(`http://${SERVER_HOST}/dips/write/product/${userId}/${id}`);
                setIsDipped(true);
                Swal.fire("찜 상품에 추가 되었습니다.", "", "success");
            }
        } catch (error) {
            console.error("찜하기/찜 취소하기 실패:", error);
            Swal.fire("작업 실패", "다시 시도해주세요.", "error");
        }
    };

    const handleUpdate = () => {
        navigate(`/ProductUpdate/${id}`);
    };

    const deleteProduct = () => {
        Swal.fire({
            title: '상품을 삭제하시겠습니까?',
            text: '삭제된 상품은 복구되지 않습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://${SERVER_HOST}/product/delete/${id}`)
                    .then(response => {
                        console.log('삭제 성공:', response);
                        navigate(`/MyPage`);
                    })
                    .catch(error => {
                        Swal.fire('삭제 실패', '상품 삭제에 실패했습니다.', 'error');
                        console.error('삭제 실패:', error);
                    });
            }
        }).catch(error => {
            console.error('Swal.fire error:', error);
        });
    };

    const formatRegDate = (regDate) => {
        const now = moment();
        const date = moment(regDate);

        const diffSeconds = now.diff(date, 'seconds');
        const diffMinutes = now.diff(date, 'minutes');
        const diffHours = now.diff(date, 'hours');
        const diffDays = now.diff(date, 'days');

        if (diffSeconds < 60) {
            return `${diffSeconds}초전`;
        } else if (diffMinutes < 60) {
            return `${diffMinutes}분전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간전`;
        } else if (diffDays < 30) {
            return `${diffDays}일전`;
        } else {
            return date.format('YYYY-MM-DD');
        }
    };

    const goDetailPage = (elem) => {
        const productId = elem.productId || elem.carId;
        navigate(`/ProductDetail/${productId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!product) {
        return <p></p>;
    }

    const isOwner = userInfo && product.user.userId === userInfo.userId;

    return (
        <>
            <Header />
            <div className={styles.productdetailBody}>
                <div className={styles.productDetail}>
                    <section className={styles.productdetailTop}>
                        <Carousel activeIndex={index} onSelect={handleSelect} interval={null} className={styles.carousel}>
                            {product.fileList.map((file, idx) =>
                                <Carousel.Item key={idx} className={styles.carouselItem}>
                                    <img className={styles.productImage} src={file.source} alt={''} />
                                </Carousel.Item>)}
                        </Carousel>

                        <div className={styles.productInfo}>
                            <p>{product.category1} &gt; {product.category2} &gt; {product.category3} </p>
                            <h1>{product.name}</h1>
                            <h1>가격: {product.price.toLocaleString()}원</h1>
                            <h5 className={styles.productpostinfo}>{formatRegDate(product.regDate)}·조회{product.viewCount}</h5>
                            <div className={styles.productInfoBottom}>
                                <div className={styles.productInfoBottomDiv}>
                                    <p>제품상태</p>
                                    <p>{product.status}</p>
                                </div>
                                <div className={styles.productInfoBottomDiv}>
                                    <p>거래방식</p>
                                    <p>{product.dealingType}</p>
                                </div>
                                <div className={styles.productInfoBottomDiv}>
                                    <p>판매상태</p>
                                    <p>{product.dealingStatus}</p>
                                </div>
                            </div>
                            {isOwner ? (
                                <div className={styles.ownerActions}>
                                    <button className={styles.editButton} onClick={handleUpdate}>수정하기</button>
                                    <button className={styles.deleteButton} onClick={deleteProduct}>삭제하기</button>
                                </div>
                            ) : (
                                <div className={styles.chatDipButton}>
                                    <button className={styles.chatButton} onClick={toggleChatSidebar}>채팅하기</button>
                                    <button className={styles.dipButton} onClick={dip}>
                                        {isDipped ? '찜 취소하기' : '찜하기'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className={styles.productdetailBottom}>
                        <div className={styles.productInfoDetail}>
                            <p>상품정보</p>
                            <div>{product.description}</div>
                        </div>

                        <div className={styles.userInfo}>
                            <div className={styles.userInfodiv}>가게정보</div>
                            <div className={styles.nickNameAndProfileImgFrame}>
                                <span className={styles.sellerNickName}>{product.user.userName}</span>
                                <img className={styles.sellerProfileImg} src={'https://img2.joongna.com/common/Profile/Default/profile_f.png'} alt='프로필'/>
                            </div>
                            <div>
                                <div className={styles.trustIndexFrame}>
                                    <div className={styles.sellerTrustIndex}>
                                        <p className={styles.sellerTrustIndexLabel}>신뢰지수</p>
                                        <p className={styles.sellerTrustIndexFigure}>{product.user.reliability}</p>
                                    </div>
                                    <p className={styles.maxTrustIndex}>1,000</p>
                                </div>
                                <ProgressBar className={styles.trustIndexBar} now={product.user.reliability / 10}/>
                            </div>
                            <div className={styles.sellListFrame}>
                                {listArr.map((elem, idx) => (
                                    <Card key={idx} className={styles.sellInfoCard} onClick={() => goDetailPage(elem)}>
                                        <div className={styles.sellInfoCardImgContainer}>
                                            <Card.Img className={styles.sellInfoCardImg} src={elem.fileList[0]?.source || ''} />
                                        </div>
                                        <Card.Body className={styles.sellInfoCardBody}>
                                            <Card.Title className={styles.sellInfoTitle}>{elem.name}</Card.Title>
                                            <Card.Text className={styles.sellInfoPrice}>{elem.price.toLocaleString()}원</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                            <br/>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=http://localhost:3000/ProductDetail/${id}`} style={{ width: '150px', height: '150px' }}
                                alt="QR Code"></img>
                        </div>
                    </section>
                </div>

                {isChatSidebarOpen && (
                    <>
                        <div className={`${styles.overlay} ${isChatSidebarOpen ? styles.overlayActive : ''}`} onClick={() => setIsChatSidebarOpen(false)}/>
                        <div className={`${styles.chatSidebar} ${isChatSidebarOpen ? styles.chatSidebarOpen : ''}`}>
                            <button className={styles.closeButton} onClick={() => setIsChatSidebarOpen(false)}> <img src={x} alt='x' height={25} width={25} /> </button>
                            <Chat chatRoomId={chatRoomId} />
                        </div>
                    </>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default ProductDetail;
