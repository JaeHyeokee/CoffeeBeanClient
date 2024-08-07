import React, { useState } from 'react';
import '../css/home.css';
import Header from './components/Header.jsx';
import { Link } from 'react-router-dom';
import products from './components/ExData.js'; 

const Home = () => {
    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(0);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        const maxPage = Math.ceil(products.length / itemsPerPage) - 1;
        setCurrentPage((prevPage) => Math.min(prevPage + 1, maxPage));
    };

    const startIndex = currentPage * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
        <Header/>
        <div className='home-body'>
        <section>
            <div className="product-list">
                <h2>당신을 위한 추천상품!</h2>
                <div className="product-items">
                    {currentProducts.map(product => (
                        <Link key={product.id} to={`/ProductDetail/${product.id}`} className="product-item">
                            <img src={product.image} alt={product.title} />
                            <h3>{product.title}</h3>
                            <p>{product.price.toLocaleString()}원</p>
                            <p>{product.location} | {product.time}</p>
                        </Link>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 0}>
                        이전
                    </button>
                    <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(products.length / itemsPerPage) - 1}>
                        다음
                    </button>
                </div>
            </div>
        </section>
        <section>
            <div className="product-list">
                <h2>방금 등록된 상품</h2>
                <div className="product-items">
                    {currentProducts.map(product => (
                        <Link key={product.id} to={`/ProductDetail/${product.id}`} className="product-item">
                            <img src={product.image} alt={product.title} />
                            <h3>{product.title}</h3>
                            <p>{product.price.toLocaleString()}원</p>
                            <p>{product.location} | {product.time}</p>
                        </Link>
                    ))}
                </div>
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 0}>
                        이전
                    </button>
                    <button onClick={handleNextPage} disabled={currentPage >= Math.ceil(products.length / itemsPerPage) - 1}>
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
