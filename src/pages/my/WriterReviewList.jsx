import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const ReviewList = () => {

    const navigate = useNavigate();
    const { userId } = useParams();

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios({
            method: "get",
            url: `http://localhost:8088/review/list/writer/${userId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status == 200) {
                    console.log(data);
                    setReviews(data);
                } else {
                    window.alert('읽어오기 실패');
                }
            });
    }, []);

    const isSeller = (recipient, seller) => {
        return recipient.userId === seller.userId;
    };

    return (
        <>
        <Header />
        <Link to={'/ReviewList/recipient/' + userId}>내 후기</Link> | 
        <h3>내가 쓴 후기</h3>
        {reviews.map((item, index) => (
            <div key={index} style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                <div style={{ flex: '1' }}>
                    {item.product.fileList && item.product.fileList.length > 0 && (
                        <img
                            src={item.product.fileList[0].source}
                            alt="product"
                            style={{ maxWidth: '200px', height: 'auto' }}
                        />
                    )}
                </div>
                <div style={{ flex: '2', paddingLeft: '20px' }}>
                    <div>{item.product.name}</div>
                    {item.review.recipient && item.review.writer && (
                        isSeller(item.review.recipient, item.review.writer) ? (
                            <div>판매자</div>
                        ) : (
                            <div>구매자</div>
                        )
                    )}
                    {item.review.recipient ? (
                        <p>{item.review.recipient.nickName}</p>
                    ) : (
                        <p>정보가 없습니다</p>
                    )}
                    <div>{item.product.price}원</div>
                    <div>{item.review.regDate}</div>
                </div>
                <div>
                    {item.review.content}
                </div>
            </div>
        ))}
    </>
    );
};

export default ReviewList;