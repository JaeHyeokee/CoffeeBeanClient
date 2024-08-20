import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { SERVER_HOST } from '../../apis/Api';

const ReviewDetail = () => {

    const navigate = useNavigate();
    const { chatRoomId, writerId } = useParams();

    const [review, setReivew] = useState({
        reviewId: "",
        writer: null,
        recipient: null,
        content: "",
        regDate: "",
    });

    const [product, setProduct] = useState({
        name: "",
        price: "",
        fileList: [],
    });

    useEffect(() => {
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/review/detail/${chatRoomId}/${writerId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status == 200) {
                    console.log(data);
                    setReivew(data.review);
                    setProduct(data.product);
                } else {
                    window.alert('읽어오기 실패');
                }
            });
    }, []);

    const isSeller = (recipient, seller) => {
        return recipient.userId === seller.userId;
    };




    return (
        <div>
            <Header />
            <Button variant="secondary" onClick={() => navigate(`/WriterReviewList/${writerId}`)}>이전</Button>
            <h3>후기 상세</h3>
            <div style={{ padding: '20px' }}>
                <div style={{ flex: '1' }}>
                    {product.fileList && product.fileList.length > 0 && (
                        <img
                            src={product.fileList[0].source}
                            alt="product"
                        />
                    )}
                </div>
                <div style={{ flex: '2', paddingLeft: '20px' }}>
                    <div>{product.name}</div>
                    {review.recipient && review.writer && (
                        isSeller(review.recipient, review.writer) ? (
                            <div>판매자</div>
                        ) : (
                            <div>구매자</div>
                        )
                    )}
                    {review.recipient ? (
                        <p>{review.recipient.nickName}</p>
                    ) : (
                        <p>정보가 없습니다</p>
                    )}
                    <div>{product.price}원</div>
                    <div>{review.regDate}</div>
                </div>
                <div>
                    {review.content}
                </div>
            </div>
        </div>
    );
};

export default ReviewDetail;