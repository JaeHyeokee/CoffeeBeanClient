import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { SERVER_HOST } from '../../apis/Api';

const ReviewList = () => {

    const navigate = useNavigate();
    const { userId } = useParams();

    const [reviews, setReviews] = useState([]);

    const [sampleReview, setSampleReview] = useState({
        timeCount: "",
        mannerCount: "",
        badMannerCount: "",
        responseCount: ""
    });

    useEffect(() => {
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/review/list/recipient/${userId}`
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

    useEffect(() => {
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/user/sampleReview/${userId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status == 200) {
                    console.log(data);
                    setSampleReview(data);
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
            <h3>내 후기</h3> |
            <Link to={'/ReviewList/writer/' + userId}>내가 쓴 후기</Link>
            <h4>이런 점이 좋았어요!</h4>
            응답이 빨라요! {sampleReview.responseCount}<br/>
            친절/매너가 좋아요! {sampleReview.mannerCount}<br/>
            거래 시간을 잘 지켜요! {sampleReview.timeCount}<br/>
            친절하지 않아요... {sampleReview.badMannerCount}
            <h4>상세한 후기도 있어요!</h4>
            {reviews.map((item, index) => (
                <div key={index} style={{ padding: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                    <div style={{ flex: '2', paddingLeft: '20px' }}>
                        {item.recipient ? (
                            <p>{item.recipient.nickName}</p>
                        ) : (
                            <p>정보가 없습니다</p>
                        )}
                        {item.recipient && item.writer && (
                            isSeller(item.recipient, item.writer) ? (
                                <div>판매자</div>
                            ) : (
                                <div>구매자</div>
                            )
                        )}
                        <div>{item.regDate}</div>
                    </div>
                    <div>
                        {item.content}
                    </div>
                </div>
            ))}
        </>
    );
};

export default ReviewList;