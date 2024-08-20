import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
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

const ProductDetail = () => {
    const { id } = useParams();  // productId
    const [product, setProduct] = useState(null);
    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const{userInfo ,isLogin} = useContext(LoginContext);
    const userId = userInfo ?.userId;
    const navigate = useNavigate();
    const [ listArr, setListArr ] = useState([]);
    const [chatRoomExists, setChatRoomExists] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null); // 채팅방 ID 상태 추가

    useEffect(() => {
        axios.get(`http://localhost:8088/product/detail/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('상품 조회 실패', error);
            });
    }, [id]);

    useEffect(() => {
        if (product) {
            /* axios.get(`http://localhost:8088/car/category2/${car.category2}`)
                .then(response => {
                    setRecommendedCars(response.data);
                })
                .catch(error => {
                    console.error('추천 차량 불러오기 실패', error);
                }); */
            axios({
                method: "get",
                url: `http://localhost:8088/sell/product/sortedlist/${product.user.userId}/1/판매중`,
            })
            .then(response => {
                if(Array.isArray(response.data)) {
                    setListArr(response.data.slice(0, 3));
                } else {
                    console.log('데이터 로드 실패');
                }
            });
            checkChatRoomExists();
        }
    }, [product]);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };


    const checkChatRoomExists = async () => {
        try {
            const sellerId = product.user.userId;
            const buyerId = userInfo.userId;

            const response = await axios.get(`http://localhost:8088/chatRooms/check`, {
                params: { buyerId, sellerId, productId: id } // productId 추가
            });

            setChatRoomExists(response.data.exists);
            if (response.data.exists) {
                setChatRoomId(response.data.chatRoomId); // 채팅방 ID 저장
            }
        } catch (error) {
            console.error("채팅방 존재 여부 확인 실패", error);
        }
    };

    const toggleChatSidebar = async () => {
        if (chatRoomExists) {
            setIsChatSidebarOpen(true);
            return;
        }

        try {
            const sellerId = product.user.userId;
            const buyerId = userInfo.userId;

            const response = await axios.post(`http://localhost:8088/chatRooms`, null, {
                params: { 
                    sellerId, 
                    buyerId, 
                    productId: id, // productId 추가
                },
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("채팅방 생성 성공", response.data);
            setChatRoomExists(true);
            setChatRoomId(response.data.chatRoomId); // 생성된 채팅방 ID 저장
            setIsChatSidebarOpen(true);
        } catch (error) {
            console.error("채팅방 생성 실패", error.response ? error.response.data : error.message);
        }
    };

    const dip = () => {
        if (!isLogin) {
            Swal.fire("로그인이 필요합니다.","찜하기 기능을 사용하시려면 로그인이 필요합니다.", "warning", () => { navigate("/login") })
            navigate('/login');
        } else{
            Swal.fire("찜하셨습니다.");
        }
    };

    //수정하기
    const handleUpdate = () => {
        navigate(`/ProductUpdate/${id}`);
    }

    if (!product) {
        return <p>상품을 찾을 수 없습니다.</p>;
    }

    //상품을 올린 user와 로그인한 user가 같은지 비교
    const isOwner = userInfo && product.user.userId === userInfo.userId;

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
                axios.delete(`http://localhost:8088/product/delete/${id}`)
                    .then((response) => {
                        console.log('삭제 성공:', response);
                        navigate(`/MyPage`);
                    })
                    .catch((error) => {
                        Swal.fire('삭제 실패', '상품 삭제에 실패했습니다.', 'error');
                        console.error('삭제 실패:', error);
                    });
            }
        }).catch((error) => {
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
        navigate('/ProductDetail/' + elem.carId);
    };

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
                            {isOwner ? (    //상품 올린 user와 로그인한 user가 같다면
                                <div className={styles.ownerActions}>
                                    <button className={styles.editButton} onClick={handleUpdate}>수정하기</button>
                                    <button className={styles.deleteButton} onClick={deleteProduct}>삭제하기</button>
                                </div>
                            ) : (
                                <div className={styles.chatDipButton}>
                                    <button className={styles.chatButton} onClick={toggleChatSidebar}>채팅하기</button>
                                    <button className={styles.dipButton} onClick={dip}>찜하기</button>
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
                                {listArr.map(elem => (
                                    <Card className={styles.sellInfoCard} onClick={() => goDetailPage(elem)}>
                                        <div className={styles.sellInfoCardImgContainer}>
                                            <Card.Img className={styles.sellInfoCardImg} src={elem.fileList[0].source}/>
                                        </div>
                                        <Card.Body className={styles.sellInfoCardBody}>
                                            <Card.Title className={styles.sellInfoTitle}>{elem.name}</Card.Title>
                                            <Card.Text className={styles.sellInfoPrice}>{elem.price.toLocaleString()}원</Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
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
