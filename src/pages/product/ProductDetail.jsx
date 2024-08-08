import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../../css/product/ProductDetail.css';
import { Carousel } from 'react-bootstrap';
import products from '../components/ExData';
import ChatFrame from '../chatting/ChatFrame';
import x from '../../image/x.svg';
import Swal from 'sweetalert2';

const ProductDetail = () => {
    const { id } = useParams();
    const productId = parseInt(id, 10);
    const product = products.find(p => p.id === productId);

    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
    }

    const dip = () => {
        Swal.fire({
            title: '찜콩',
            html: '<div style="display: flex; align-items: center; justify-content: center;">' +
                  '</div>',
            showConfirmButton: false, // 확인 숨기기
            width: '400px',

            //계속 둘러보기, 찜 목록가기
            
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

    return (
        <>
            <Header />
            <div className='productdetail-body'>
                <div className="product-detail">
                    {product ? (
                        <>
                            <section className='productdetail-top'>
                            <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                        <Carousel.Item>
                            <img className='product-image' src={product.image} />
                            <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className='product-image' src={product.image} />
                            <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className='product-image' src={product.image}/>
                            <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                            </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        </Carousel>

                                <div className='product-info'>
                                    <p>카테고리 경로 들어갈 자리</p>
                                    <h1>{product.title}</h1>
                                    <h1>가격: {product.price.toLocaleString()}원</h1>
                                    <div className='product-info-bottom'>
                                        <div>
                                            <p>제품상태</p>
                                            <p>{product.status}</p>
                                        </div>
                                        <div>
                                            <p>거래방식</p>
                                            <p>{product.dealing_type}</p>
                                        </div>
                                        <div>
                                            <p>판매상태</p>
                                            <p>{product.dealing_status}</p>
                                        </div>
                                    </div>
                                    <div className='chat-dip-button'>
                                        <button className="chat-button" onClick={toggleChatSidebar}>
                                            채팅하기
                                        </button>
                                        
                                        <button className='dip-button' onClick={dip}>찜하기</button>
                                    </div>
                                </div>
                            </section>

                            <section className='productdetail-bottom'>
                                <div className='product-info-detail'>
                                    <p>상품정보</p>
                                </div>

                                <div className='user-info'>
                                    <p>가게정보</p>
                                </div>
                            </section>
                        </>
                    ) : (
                        <p>상품을 찾을 수 없습니다.</p>
                    )}

                    {isChatSidebarOpen && (
                        <>
                            <div className={`overlay ${isChatSidebarOpen ? 'active' : ''}`} onClick={toggleChatSidebar} /> {/* 채팅 사이드바 나왔을때 뒷 배경 반투명하게 */}
                            <div className={`chat-sidebar ${isChatSidebarOpen ? 'open' : ''}`}>
                                <button className='close-button' onClick={toggleChatSidebar}>
                                    <img src={x} alt='닫기' height={25} width={25} />
                                </button>
                                <ChatFrame productId={productId} /> {/* 상품id 전달 */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
