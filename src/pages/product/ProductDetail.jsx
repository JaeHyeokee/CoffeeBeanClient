import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import x from '../../image/x.svg';
import Swal from 'sweetalert2';
import { Carousel } from 'react-bootstrap';
import styles from '../../css/product/ProductDetail.module.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Chat from '../chatting/Chat';

const ProductDetail = () => {
    const { id } = useParams();  // productId
    const [product, setProduct] = useState(null);
    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [chatRoomExists, setChatRoomExists] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null); // 채팅방 ID 상태 추가
    const { userInfo } = useContext(LoginContext);

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
        Swal.fire({
            title: '찜콩',
            html: '<div style="display: flex; align-items: center; justify-content: center;"></div>',
            showConfirmButton: false,
            width: '400px',
        });
    };

    if (!product) {
        return <p>상품을 찾을 수 없습니다.</p>;
    }

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
                            <div className={styles.chatDipButton}>
                                <button className={styles.chatButton} onClick={toggleChatSidebar}>
                                    채팅하기
                                </button>
                                <button className={styles.dipButton} onClick={dip}>찜하기</button>
                            </div>
                        </div>
                    </section>

                    <section className={styles.productdetailBottom}>
                        <div className={styles.productInfoDetail}>
                            <p>상품정보</p>
                            <div>{product.description}</div>
                        </div>

                        <div className={styles.userInfo}>
                            <p>가게정보</p>
                            <div>id: {product.user.userId}</div>
                            <div>name: {product.user.userName}</div>
                        </div>
                    </section>
                </div>

                {/* 사이드바 */}
                {isChatSidebarOpen && (
                    <>
                        <div className={`overlay ${isChatSidebarOpen ? 'active' : ''}`} onClick={() => setIsChatSidebarOpen(false)} />
                        <div className={`chat-sidebar ${isChatSidebarOpen ? 'open' : ''}`}>
                            <button className='close-button' onClick={() => setIsChatSidebarOpen(false)}>
                                <img src={x} alt='x' height={25} width={25} />
                            </button>
                            <Chat chatRoomId={chatRoomId} /> {/* 채팅방 ID를 Chat 컴포넌트에 전달 */}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProductDetail;
