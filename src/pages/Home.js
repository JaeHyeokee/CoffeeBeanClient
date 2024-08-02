import React, { useState } from 'react';
import '../css/home.css';



const Home = () => {
    const products = [
        {
            id: 1,
            image: 'https://via.placeholder.com/150',
            title: '삼성전자 2024 스마트 모니터 (미개봉)',
            price: 220000,
            location: '서둔동',
            time: '11분 전',
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/150',
            title: '아이폰 12 128기가 화이트',
            price: 250000,
            location: '철산3동',
            time: '20분 전',
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/150',
            title: 'LG OLED TV 55인치',
            price: 1200000,
            location: '강남구',
            time: '30분 전',
        },
        {
            id: 4,
            image: 'https://via.placeholder.com/150',
            title: '삼성 갤럭시 S21 256기가',
            price: 450000,
            location: '신사동',
            time: '1시간 전',
        },
        {
            id: 5,
            image: 'https://via.placeholder.com/150',
            title: 'Apple AirPods Pro',
            price: 150000,
            location: '홍대',
            time: '2시간 전',
        },
        {
            id: 6,
            image: 'https://via.placeholder.com/150',
            title: '소니 WH-1000XM4 무선 헤드폰',
            price: 350000,
            location: '부산진구',
            time: '3시간 전',
        },
        // 추가 데이터
        {
            id: 7,
            image: 'https://via.placeholder.com/150',
            title: 'Samsung Galaxy Buds 2',
            price: 120000,
            location: '서울시',
            time: '5시간 전',
        },
        {
            id: 8,
            image: 'https://via.placeholder.com/150',
            title: 'MacBook Air 2023',
            price: 1400000,
            location: '강서구',
            time: '6시간 전',
        },
        {
            id: 9,
            image: 'https://via.placeholder.com/150',
            title: 'LG 27인치 게이밍 모니터',
            price: 300000,
            location: '안양시',
            time: '7시간 전',
        },
        {
            id: 10,
            image: 'https://via.placeholder.com/150',
            title: 'Sony PlayStation 5',
            price: 600000,
            location: '성남시',
            time: '8시간 전',
        },
        {
            id: 11,
            image: 'https://via.placeholder.com/150',
            title: 'Apple iPad Pro 11인치',
            price: 800000,
            location: '일산',
            time: '9시간 전',
        },
        {
            id: 12,
            image: 'https://via.placeholder.com/150',
            title: '닌텐도 스위치 OLED',
            price: 400000,
            location: '부천시',
            time: '10시간 전',
        },
        {
            id: 13,
            image: 'https://via.placeholder.com/150',
            title: 'Razer DeathAdder 게이밍 마우스',
            price: 80000,
            location: '수원시',
            time: '11시간 전',
        },
        {
            id: 14,
            image: 'https://via.placeholder.com/150',
            title: 'ASUS TUF 15.6인치 노트북',
            price: 900000,
            location: '대전',
            time: '12시간 전',
        },
        {
            id: 15,
            image: 'https://via.placeholder.com/150',
            title: 'Bose QuietComfort 35 II',
            price: 300000,
            location: '광주',
            time: '13시간 전',
        },
        {
            id: 16,
            image: 'https://via.placeholder.com/150',
            title: 'GoPro Hero 10',
            price: 500000,
            location: '제주도',
            time: '14시간 전',
        }
    ];

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
        <section>
            <div className="product-list">
                <h2>당신을 위한 추천상품!</h2>
                <div className="product-items">
                    {currentProducts.map(product => (
                        <div key={product.id} className="product-item">
                            <img src={product.image} alt={product.title} />
                            <h3>{product.title}</h3>
                            <p>{product.price}원</p>
                            <p>{product.location} | {product.time}</p>
                        </div>
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
    );
};

export default Home;