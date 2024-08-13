import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import ChatFrame from '../chatting/ChatFrame';
import x from '../../image/x.svg';
import Swal from 'sweetalert2';
import { Carousel } from 'react-bootstrap';
import styles from '../../css/product/ProductDetail.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8088/product/detail/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('실패', error);
            });
    }, [id]);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
    };

    const dip = () => {
        Swal.fire({
            title: '찜콩',
            html: '<div style="display: flex; align-items: center; justify-content: center;"></div>',
            showConfirmButton: false, // 확인 숨기기
            width: '400px',
        });
    };

    useEffect(() => {
        if (isChatSidebarOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isChatSidebarOpen]);

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
                            <div>id:{product.user.userId}</div>
                            <div>name:{product.user.userName}</div>
                        </div>
                    </section>
                </div>

                {isChatSidebarOpen && (
                    <>
                        <div className={`${styles.overlay} ${isChatSidebarOpen ? 'active' : ''}`} onClick={toggleChatSidebar} />
                        <div className={`${styles.chatSidebar} ${isChatSidebarOpen ? 'open' : ''}`}>
                            <button className={styles.closeButton} onClick={toggleChatSidebar}>
                                <img src={x} alt='닫기' height={25} width={25} />
                            </button>
                            <ChatFrame productId={id} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProductDetail;
