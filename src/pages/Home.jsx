import React, { useEffect, useState } from 'react';
import '../css/home.css';
import Header from './components/Header.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from './components/Footer.jsx';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import main1 from '../image/main1.png';
import main2 from '../image/main2.png';
import main3 from '../image/main3.png';
import main4 from '../image/main4.png';
import main5 from '../image/main5.png';

const Home = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        // 인기 상품 가져오기
        axios.get('http://localhost:8088/product/top10')
            .then(response => {
                setTopProducts(response.data);
            })
            .catch(error => {
                console.error('인기 상품 가져오기 오류', error);
            });

        // 최근 등록된 상품 가져오기
        axios.get('http://localhost:8088/product/top10regDate')
            .then(response => {
                setRecentProducts(response.data);
            })
            .catch(error => {
                console.error('최근 등록된 상품 가져오기 오류', error);
            });
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true, // 좌우 화살표 사용 설정
    };

    return (
        <>
            <Header />
            <div className='home-body'>
                {/* 슬라이더 섹션 */}
                <section className='slider-section'>
                    <Slider {...sliderSettings}>
                        <div className="slider-item">
                            <img src={main1} alt="slider-img-1" />
                        </div>
                        <div className="slider-item">
                            <a href="https://thecheat.co.kr/rb/?mod=_search" target="_blank" rel="noopener noreferrer">
                                <img src={main2} alt="slider-img-2" />
                            </a>
                        </div>
                        <div className="slider-item">
                            <img src={main3} alt="slider-img-3" />
                        </div>
                        <div className="slider-item">
                            <img src={main4} alt="slider-img-4" />
                        </div>
                        <div className="slider-item">
                            <img src={main5} alt="slider-img-5" />
                        </div>
                    </Slider>
                </section>

                {/* 인기 상품 */}
                <section>
                    <div className="product-list">
                        <h2 className="maintext">실시간 인기 상품</h2>
                        <div className="product-items">
                            {topProducts.slice(0, 5).map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className="product-item">
                                    {/* <img src={product.fileList[0].source} alt={product.name} /> */}
                                    <h4>{product.name}</h4>
                                    <p className="price">{product.price.toLocaleString()}원</p>
                                    <p>{product.desiredArea || ' '} | {product.time}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="product-items">
                            {topProducts.slice(5, 10).map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className="product-item">
                                    <img src={product.fileList[0].source} alt={product.name} />
                                    <h4>{product.name}</h4>
                                    <p className="price">{product.price.toLocaleString()}원</p>
                                    <p>{product.desiredArea || ' '} | {product.time}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 최근 등록 상품 */}
                <section>
                    <div className="product-list">
                        <h2 className='maintext2'>방금 등록된 상품</h2>
                        <div className="product-items">
                            {recentProducts.slice(0, 5).map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className="product-item">
                                    {/* <img src={product.fileList[0].source} alt={product.name} /> */}
                                    <h4>{product.name}</h4>
                                    <p className="price">{product.price.toLocaleString()}원</p>
                                    <p>{product.desiredArea || ' '} | {product.time}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="product-items">
                            {recentProducts.slice(5, 10).map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className="product-item">
                                    <img src={product.fileList[0].source} alt={product.name} />
                                    <h4>{product.name}</h4>
                                    <p className="price">{product.price.toLocaleString()}원</p>
                                    <p>{product.desiredArea || ' '} | {product.time}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Home;
