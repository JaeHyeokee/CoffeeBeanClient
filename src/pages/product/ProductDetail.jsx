import React, { useContext, useEffect, useState} from 'react';
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
import updateImage from '../../image/icon-update.png';
import deleteImage from '../../image/icon-delete.png';
import shareImage from "../../image/share-icon.png";
import moment from 'moment';
import { SERVER_HOST } from '../../apis/Api';
import one from "../../image/One.svg"
import place from "../../image/Place.svg";
import DipHeart from "../../image/Dip.svg"
import FullDipHeart from "../../image/FullDipHeart.svg" 

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
    const [showFullIntroduce, setShowFullIntroduce] = useState(false); // 더보기 버튼 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const [isDipped, setIsDipped] = useState(false);
    const [dipsCount, setDipsCount] = useState(0); // 찜 개수 상태 추가
    const [chatRoomCount, setChatRoomCount] = useState(0);
    const [profileImg, setProfileImg] = useState('https://img2.joongna.com/common/Profile/Default/profile_f.png');


    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/product/detail/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('상품 조회 실패', error);
            }
        };
    
        fetchProductDetails();
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

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/user/profile/${userInfo.userId}`);
                const imageUrl = response.data;
                setProfileImg(imageUrl); 
            } catch (error) {
                console.error('Failed to fetch profile image:', error);
            }
        };

        fetchProfileImage();
    }, [userInfo.userId]);

    const checkChatRoomExists = async () => {
        try {
            const sellerId = product.user.userId;
            const buyerId = userInfo.userId;

            const response = await axios.get(`http://${SERVER_HOST}/chatRooms/check`, {
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

        if (!isLogin) {
            Swal.fire("로그인이 필요합니다.", "채팅하기 기능을 사용하시려면 로그인이 필요합니다.", "warning");
            navigate('/login');
            return;
        }

        if (chatRoomExists) {
            setIsChatSidebarOpen(true);
            return;
        }

        try {
            const sellerId = product.user.userId;
            const buyerId = userInfo.userId;

            const response = await axios.post(`http://${SERVER_HOST}/chatRooms`, null, {
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

    useEffect(() => {
        const fetchDipsCount = async () => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/dips/count/product/${id}`);
                setDipsCount(response.data);
            } catch (error) {
                console.error('찜 개수 조회 실패', error);
            }
        };

        fetchDipsCount();
    }, [id, product]);

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
                setDipsCount(prevCount => prevCount - 1);
                Swal.fire("찜 상품에서 제외 했습니다.", "", "success");
            } else {
                // 찜 추가 요청
                await axios.post(`http://${SERVER_HOST}/dips/write/product/${userId}/${id}`);
                setIsDipped(true);
                setDipsCount(prevCount => prevCount + 1); 
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
            cancelButtonColor: 'rgb(221, 51, 51)',
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

    const introduceLines = product.description.split(/(?<=니다|입니다|습니다|있어요|해요)\s*/);
    const maxLinesToShow = 8;

    const handleShareClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    

    return (
        <>
            <Header />
            <div className={styles.productdetailBody}>
                <section className={styles.productdetailTop}>
                    <Carousel activeIndex={index} onSelect={handleSelect} interval={null} className={styles.carousel}>
                        {product.fileList.map((file, idx) => (
                            <Carousel.Item key={idx} className={styles.carouselItem}>
                                <img className={styles.productImage} src={file.source} alt="" />
                            </Carousel.Item>
                        ))}
                    </Carousel>
    
                    <div className={styles.productInfo}>
                        <div className={styles.productHeader}>
                            <p className={product.category2 === "" ? styles.lastproductCategory : styles.productCategory}>{product.category1}</p>
                            {product.category2 !== "" && <p className={styles.productCategory}>&nbsp; &gt; &nbsp;</p>}
                            <p className={product.category3 === "" ? styles.lastproductCategory : styles.productCategory}>{product.category2}</p>
                            {product.category3 !== "" && <p className={styles.productCategory}>&nbsp; &gt; &nbsp;</p>}
                            <p className={styles.lastproductCategory}>{product.category3}</p>
                        </div>


                        <div className={styles.productNameContainer}>
                            <h1 className={styles.productName}>{product.name}</h1>
                            <img
                                className={styles.shareImg}
                                src={shareImage}
                                alt="Share"
                                onClick={handleShareClick}
                            />
                        </div>

                        {isModalOpen && (
                            <div className={styles.modalOverlay} onClick={handleCloseModal}>
                                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                    <h3 className={styles.modaltitle}>공유하기</h3>
                                    <img className={styles.modalqrimg}
                                        src={`https://api.qrserver.com/v1/create-qr-code/?data=http://${SERVER_HOST.slice(0, SERVER_HOST.length - 5)}:3000/ProductDetail/${id}`}
                                        alt="QR Code"
                                    />
                                    <button onClick={handleCloseModal} className={styles.closeModalButton}>닫기</button>
                                </div>
                            </div>
                        )}
                
                        <h2 className={styles.productPrice}>
                            {product.price === 0 ? '무료나눔' : `${product.price.toLocaleString()} 원`}
                        </h2>

                        <h5 className={styles.productpostinfo}>
                            {formatRegDate(product.regDate)}·조회 {product.viewCount}·찜 {dipsCount}
                        </h5>

                        <div className={styles.area}>
                            <div>{product.dealingType === "직거래" && <img src={one} alt="아이콘" />}{product.dealingType === "직거래" && "거래희망지역"} </div>
                            <div>{product.dealingType === "직거래" && <img src={place} alt='위치'/>}{product.dealingType === "직거래" && '\u00A0' + product.desiredArea}</div>
                        </div>

                        <div className={styles.productInfoBottom}>
                            <div className={styles.productInfoBottomDiv}>
                                <p>제품상태</p>
                                <p>{product.status}</p>
                            </div>
                            <div className={styles.productInfoBottomLine}></div>
                            <div className={styles.productInfoBottomDiv}>
                                <p>거래방식</p>
                                <p>{product.dealingType}</p>
                            </div>
                            <div className={styles.productInfoBottomLine}></div>
                            <div className={styles.productInfoBottomDiv}>
                                <p>판매상태</p>
                                <p>{product.dealingStatus}</p>
                            </div>
                        </div>
                        
                        {!isOwner && product.dealingStatus !== "판매완료" && (
                        <div className={styles.chatDipButton}>
                            <button className={styles.dipButton} onClick={dip}>
                                {isDipped ? <img src={FullDipHeart} alt='찜 취소하기'/> : <img src={DipHeart} alt='찜하기'/>}
                            </button>
                            <button className={styles.chatButton} onClick={toggleChatSidebar}>
                                채팅하기
                            </button>
                        </div>
                        )}

                        {isOwner && (
                            <div className={styles.changeButton}>
                                <button className={styles.imageButton} onClick={handleUpdate}>
                                    <img src={updateImage} alt="상품수정" className={styles.updateImage} />
                                    <span className={styles.buttonText}>상품수정</span>
                                </button>
                                <div className={styles.productInfoBottomLine}></div>
                                <button className={styles.imageButton} onClick={deleteProduct}>
                                    <img src={deleteImage} alt="상품삭제" className={styles.deleteImage} />
                                    <span className={styles.buttonText}>상품삭제</span>
                                </button>
                            </div>
                        )}
                    </div>
                </section>
    
                <section className={styles.productdetailBottom}>
                    <div className={styles.productInfoDetail}>
                        <h2 className={styles.infotext}>상품정보</h2>
                        {/* <div>{product.description}</div> */}


                        <div className={styles.infoBoxdetail}>
                        {introduceLines.slice(0, showFullIntroduce ? introduceLines.length : maxLinesToShow).map((line, index) => (
                            <p key={index} className={styles.introduce}>{line}</p>
                        ))}
                        {introduceLines.length > maxLinesToShow && (
                            <button onClick={() => setShowFullIntroduce(!showFullIntroduce)} className={styles.moreButton}>
                                {showFullIntroduce ? '접기' : '더보기 +'}
                            </button>
                        )}
                        </div>
                    </div>
    
                    <div className={styles.userInfo}>
                        <h2 className={styles.infotext}>가게정보</h2>
                        <div className={styles.nickNameAndProfileImgFrame}>
                            <span className={styles.sellerNickName}>{product.user.userName}</span>
                            <img className={styles.sellerProfileImg} src={profileImg} alt='프로필'/>
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
                        {/* <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=http://localhost:3000/ProductDetail/${id}`}
                            style={{ width: '150px', height: '150px' }}
                            alt="QR Code"
                        /> */}
                    </div>
                </section>
    
                {/* 사이드바 */}
                {isChatSidebarOpen && (
                    <>
                        <div className={`${styles.overlay} ${isChatSidebarOpen ? styles.overlayActive : ''}`} onClick={() => setIsChatSidebarOpen(false)}/>
                        <div className={`${styles.chatSidebar} ${isChatSidebarOpen ? styles.chatSidebarOpen : ''}`}>
                            <button className={styles.closeButton} onClick={() => setIsChatSidebarOpen(false)}>
                                <img src={x} alt='x' height={25} width={25} />
                            </button>
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
