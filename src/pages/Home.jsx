import React, { useState } from 'react';
import '../css/home.css';
import Header from './components/Header.jsx';
import { Link } from 'react-router-dom';
import products from './components/ExData.js'; 

const Home = () => {
    const itemsPerPage = 6;

    /* 추천상품 관련 */
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

    /* 최신순 관련 */
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
                {/* 추천상품 섹션 */}
                <section>
                    <div className="product-list">
                        <h2>당신을 위한 추천상품!</h2>
                        <div className="product-items">
                            <button className='pagination-buttons' onClick={handlePrevPageRecommended} disabled={currentPageRecommended === 0}>
                                이전
                            </button>
                            {currentProductsRecommended.map(product => (
                                
                                <Link key={product.id} to={`/ProductDetail/${product.id}`} className="product-item">
                                    <img src={product.image} alt={product.title} />
                                    <h3>{product.title}</h3>
                                    <p>{product.price.toLocaleString()}원</p>
                                    <p>{product.location} | {product.time}</p>
                                </Link>
                            ))}
                            <button className='pagination-buttons' onClick={handleNextPageRecommended} disabled={currentPageRecommended >= Math.ceil(products.length / itemsPerPage) - 1}>
                                다음
                            </button>
                        </div>
                    </div>
                </section>

                {/* 방금 등록된 상품 섹션 */}
                <section>
                    <div className="product-list">
                        <h2>방금 등록된 상품</h2>
                        <div className="product-items">
                            {currentProductsAdded.map(product => (
                                <Link key={product.id} to={`/ProductDetail/${product.id}`} className="product-item">
                                    <img src={product.image} alt={product.title} />
                                    <h3>{product.title}</h3>
                                    <p>{product.price.toLocaleString()}원</p>
                                    <p>{product.location} | {product.time}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="pagination">
                            <button onClick={handlePrevPageAdded} disabled={currentPageAdded === 0}>
                                이전
                            </button>
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
