import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../../css/product/ProductDetail.css'

const ProductDetail = () => {
    const{id} = useParams();

    const products = [
        {
            id: 1,
            image: 'https://via.placeholder.com/200',
            title: '삼성전자 2024 스마트 모니터 (미개봉)',
            price: 220000,
            location: '서둔동',
            time: '11분 전',
            status: '중고',
            dealing_type: '택배',
            dealing_status: '판매중'


        },
        {
            id: 2,
            image: 'https://via.placeholder.com/200',
            title: '아이폰 12 128기가 화이트',
            price: 250000,
            location: '철산3동',
            time: '20분 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'

        },
        {
            id: 3,
            image: 'https://via.placeholder.com/200',
            title: 'LG OLED TV 55인치',
            price: 1200000,
            location: '강남구',
            time: '30분 전',
            status: '중고',
            dealing_type: '택배',
            dealing_status: '판매완료'

        },
        {
            id: 4,
            image: 'https://via.placeholder.com/200',
            title: '삼성 갤럭시 S21 256기가',
            price: 450000,
            location: '신사동',
            time: '1시간 전',
            status: '중고',
            dealing_type: '택배',
            dealing_status: '판매완료'
        },
        {
            id: 5,
            image: 'https://via.placeholder.com/200',
            title: 'Apple AirPods Pro',
            price: 150000,
            location: '홍대',
            time: '2시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 6,
            image: 'https://via.placeholder.com/200',
            title: '소니 WH-1000XM4 무선 헤드폰',
            price: 350000,
            location: '부산진구',
            time: '3시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 7,
            image: 'https://via.placeholder.com/200',
            title: 'Samsung Galaxy Buds 2',
            price: 120000,
            location: '서울시',
            time: '5시간 전',
            status: '중고',
            dealing_type: '택배',
            dealing_status: '판매중'
        },
        {
            id: 8,
            image: 'https://via.placeholder.com/200',
            title: 'MacBook Air 2023',
            price: 1400000,
            location: '강서구',
            time: '6시간 전',
            status: '중고',
            dealing_type: '택배',
            dealing_status: '판매중'
        },
        {
            id: 9,
            image: 'https://via.placeholder.com/200',
            title: 'LG 27인치 게이밍 모니터',
            price: 300000,
            location: '안양시',
            time: '7시간 전',
            status: '중고',
            dealing_type: '택배',
            dealing_status: '판매중'
        },
        {
            id: 10,
            image: 'https://via.placeholder.com/200',
            title: 'Sony PlayStation 5',
            price: 600000,
            location: '성남시',
            time: '8시간 전',
            status: '중고',
            dealing_type: '택배',
            dealing_status: '판매중'
        },
        {
            id: 11,
            image: 'https://via.placeholder.com200',
            title: 'Apple iPad Pro 11인치',
            price: 800000,
            location: '일산',
            time: '9시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'

        },
        {
            id: 12,
            image: 'https://via.placeholder.com/200',
            title: '닌텐도 스위치 OLED',
            price: 400000,
            location: '부천시',
            time: '10시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 13,
            image: 'https://via.placeholder.com/200',
            title: 'Razer DeathAdder 게이밍 마우스',
            price: 80000,
            location: '수원시',
            time: '11시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 14,
            image: 'https://via.placeholder.com/200',
            title: 'ASUS TUF 15.6인치 노트북',
            price: 900000,
            location: '대전',
            time: '12시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 15,
            image: 'https://via.placeholder.com/200',
            title: 'Bose QuietComfort 35 II',
            price: 300000,
            location: '광주',
            time: '13시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 16,
            image: 'https://via.placeholder.com/200',
            title: 'GoPro Hero 10',
            price: 500000,
            location: '제주도',
            time: '14시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 17,
            image: 'https://via.placeholder.com/200',
            title: '스타벅스 5만원',
            price: 47000,
            location: '군자동',
            time: '1시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        },
        {
            id: 18,
            image: 'https://via.placeholder.com/200',
            title: '삼천리 자전거',
            price: '150,000',
            location: '',
            time: '2시간 전',
            status: '새상품',
            dealing_type: '직거래',
            dealing_status: '예약중'
        }
    ];

    const productId = parseInt(id, 10);
    const product = products.find(p => p.id === productId);

    return (
        <>
        <Header/>
        <div className='productdetail-body'>
            <div className="product-detail">
                {product ? (
                    <>
                    <section className='productdetail-top'>
                        <div className='product-image'>
                            <img src={product.image} alt='' />
                        </div>

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