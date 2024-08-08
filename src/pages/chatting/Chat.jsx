import React from 'react';
import '../../css/chatting/Chat.css';
import products from '../components/ExData';
const Chat = ({ productId }) => {
    const productData = products.find((item) => item.id === productId);

    return (
        <div className='chat-detail'>
            <h2>{productData.title}</h2>
            <img src={productData.image} alt={productData.title} />
            <p>가격: {productData.price.toLocaleString()}원</p>
            <p>위치: {productData.location}</p>
            <p>상태: {productData.status}</p>
            <p>거래 유형: {productData.dealing_type}</p>
            <p>거래 상태: {productData.dealing_status}</p>
            <p>게시 시간: {productData.time}</p>
            <p>이름: {productData.username}</p>
        </div>
    );
};

export default Chat;
