import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import ChatFrame from '../chatting/ChatFrame';
import x from '../../image/x.svg';
import Swal from 'sweetalert2';
import { Carousel } from 'react-bootstrap';
import styles from '../../css/product/ProductDetail.module.css';
import Chat from '../chatting/Chat';
import Footer from '../components/Footer';
import { LoginContext } from '../../contexts/LoginContextProvider';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);

    const{userInfo ,isLogin} = useContext(LoginContext);
    const userId = userInfo ? userInfo.userId : null;
    const navigate = useNavigate();

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
        if (!isLogin) {
            Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") });
            navigate('/login');
        } else {
            setIsChatSidebarOpen(!isChatSidebarOpen);
        }
    }

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
                            <p>가게정보</p>
                            <div>id:{product.user.userId}</div>
                            <div>name:{product.user.userName}</div>
                        </div>
                    </section>
                </div>

                 {/* 사이드바 */}
                 {isChatSidebarOpen && (
                    <>
                        <div className={`${styles.overlay} ${isChatSidebarOpen ? styles.overlayActive : ''}`} onClick={toggleChatSidebar}/>
                        <div className={`${styles.chatSidebar} ${isChatSidebarOpen ? styles.chatSidebarOpen : ''}`}>
                            <button className={styles.closeButton} onClick={toggleChatSidebar}> <img src={x} alt='x' height={25} width={25} /> </button>
                            <ChatFrame productId={id} />
                        </div>
                    </>
                )}
            </div>
            <Footer/>
        </>
    );
};

export default ProductDetail;
