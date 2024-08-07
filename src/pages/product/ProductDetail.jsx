import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../../css/product/ProductDetail.css';
import { Carousel } from 'react-bootstrap';
import products from '../components/ExData';

const ProductDetail = () => {
    const { id } = useParams();
    const productId = parseInt(id, 10);
    const product = products.find(p => p.id === productId);

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <>
        <Header/>
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
                                <button className='chat-button'>채팅하기</button>
                                <button className='dip-button'>찜하기</button>
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
            </div>
        </div>
        </>
    );
};

export default ProductDetail;
