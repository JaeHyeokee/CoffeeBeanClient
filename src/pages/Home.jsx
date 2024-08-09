import React, { useEffect, useState } from 'react';
import '../css/home.css';
import Header from './components/Header.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const itemsPerPage = 6;

    useEffect(() => {
        axios.get('http://localhost:8088/product/list')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('에러에러에러', error);
            });
    }, []);

    /* 추천상품 이전,다음 버튼 */
    const [currentPageRecommended, setCurrentPageRecommended] = useState(0);

    const handlePrevPageRecommended = () => {
        setCurrentPageRecommended((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPageRecommended = () => {
        const maxPage = Math.ceil(products.length / itemsPerPage) - 1;
        setCurrentPageRecommended((prevPage) => Math.min(prevPage + 1, maxPage));
    };

    const startIndexRecommended = currentPageRecommended * itemsPerPage;
    const currentProductsRecommended = products.slice(startIndexRecommended, startIndexRecommended + itemsPerPage);

    /* 최신순 이전,다음 버튼*/
    const [currentPageAdded, setCurrentPageAdded] = useState(0); 

    const handlePrevPageAdded = () => {
        setCurrentPageAdded((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPageAdded = () => {
        const maxPage = Math.ceil(products.length / itemsPerPage) - 1;
        setCurrentPageAdded((prevPage) => Math.min(prevPage + 1, maxPage));
    };

    const startIndexAdded = currentPageAdded * itemsPerPage;
    const currentProductsAdded = products.slice(startIndexAdded, startIndexAdded + itemsPerPage);

    return (
        <>
            <Header/>
            <div className='home-body'>
                {/* 추천상품 */}
                <section>
                    <div className="product-list">
                        <h2>당신을 위한 추천상품!</h2>
                        <div className="product-items">
                            <button className='pagination-buttons' onClick={handlePrevPageRecommended} disabled={currentPageRecommended === 0}>
                                이전
                            </button>
                            {currentProductsRecommended.map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className="product-item">
                                    <img src={'//thumbnail10.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/2033058241318549-3fb6d002-7ce9-4075-a28d-7d09a1e93795.jpg'} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>{product.price.toLocaleString()}원</p>
                                    <p>{product.desiredArea} | {product.time}</p>
                                </Link>
                            ))}
                            <button className='pagination-buttons' onClick={handleNextPageRecommended} disabled={currentPageRecommended >= Math.ceil(products.length / itemsPerPage) - 1}>
                                다음
                            </button>
                        </div>
                    </div>
                </section>

                {/* 방금 등록된 상품 */}
                <section>
                    <div className="product-list">
                        <h2>방금 등록된 상품</h2>
                        <div className="product-items">
                        <button onClick={handlePrevPageAdded} disabled={currentPageAdded === 0}>
                                이전
                            </button>
                            {currentProductsAdded.map(product => (
                                <Link key={product.productId} to={`/ProductDetail/${product.productId}`} className="product-item">
                                    <img src={'//thumbnail10.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/2033058241318549-3fb6d002-7ce9-4075-a28d-7d09a1e93795.jpg'} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>{product.price.toLocaleString()}원</p>
                                    <p>{product.desiredArea} | {product.time}</p>
                                </Link>
                            ))}
                            <button onClick={handleNextPageAdded} disabled={currentPageAdded >= Math.ceil(products.length / itemsPerPage) - 1}>
                                다음
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
