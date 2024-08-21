import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/my/RecipientReviewList.module.css';

const ReviewList = () => {
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
            url: `http://localhost:8088/review/list/recipient/${userId}`
        }).then(response => {
            const { data, status } = response;
            if (status === 200) {
                setReviews(data);
            } else {
                window.alert('읽어오기 실패');
            }
        });
    }, [userId]);

    useEffect(() => {
        axios({
            method: "get",
            url: `http://localhost:8088/user/sampleReview/${userId}`
        }).then(response => {
            const { data, status } = response;
            if (status === 200) {
                setSampleReview(data);
            } else {
                window.alert('읽어오기 실패');
            }
        });
    }, [userId]);

    const isSeller = (recipient, seller) => {
        return recipient.userId === seller.userId;
    };

    return (
        <>
            <Header />
            <div className={styles.reviewContainer}>
                <div className={styles.header}>
                    <Link to={'/ReviewList/recipient/' + userId} className={styles.link}>내 후기</Link>
                    <Link to={'/ReviewList/writer/' + userId} className={`${styles.link} ${styles.activeLink}`}>내가 쓴 후기</Link>
                </div>
                <hr className={styles.divider} />
                <div className={styles.positivePoints}>
                    <h4>이런 점이 좋았어요!</h4>
                    <ul>
                        <li>
                            <span>친절/매너가 좋아요!</span>
                            <span className={styles.reviewCount}>{sampleReview.mannerCount}</span>
                        </li>
                        <li>
                            <span>응답이 빨라요.</span>
                            <span className={styles.reviewCount}>{sampleReview.responseCount}</span>
                        </li>
                        <li>
                            <span>거래 시간을 잘 지켜요.</span>
                            <span className={styles.reviewCount}>{sampleReview.timeCount}</span>
                        </li>
                        <li>
                            <span>친절하지 않아요...</span>
                            <span className={styles.reviewCount}>{sampleReview.badMannerCount}</span>
                        </li>
                    </ul>
                </div>
                <div className={styles.detailedReviews}>
                    <h4>상세한 후기도 있어요!</h4>
                    {reviews.map((item, index) => (
                        <div key={index} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                            <span className={styles.nickname}>
                                {item.review && item.review.recipient ? item.review.recipient.nickName : "정보가 없습니다"}
                            </span>
                                {item.review.recipient && item.review.writer && (
                                    isSeller(item.review.recipient, item.product.user) ? (
                                        <div className={styles.sellerInfo}>
                                            <span className={styles.sellerTag}>구매자</span>
                                        </div>
                                    ) : (
                                        <div className={styles.sellerInfo}>
                                            <span className={styles.sellerTag}>판매자</span>
                                        </div>
                                    )
                                )}
                            <span className={styles.date}>
                                {item.review && item.review.regDate}
                            </span>
                        </div>
                        <div className={styles.reviewContent}>
                            {item.review && item.review.content}
                        </div>
                    </div>
                    
                    ))}
                </div>
            </div>
        </>
    );
};

export default ReviewList;
