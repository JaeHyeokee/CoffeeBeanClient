import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/my/WriterReviewList.module.css';

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
                if (status === 200) {
                    console.log(data);
                    setReviews(data);
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
            <div className={styles.reviewListContainer}>
                <div className={styles.header}>
                    <div className={styles.navLinkContainer}>
                        <Link to={'/ReviewList/recipient/' + userId} className={styles.navLink}>내 후기</Link>
                        <Link to={'/WriterReviewList/' + userId} className={styles.activeNavLink}>내가 쓴 후기</Link>
                    </div>
                </div>
                <hr/>
                {reviews.map((item, index) => (
                    <div key={index} className={styles.reviewItem}>
                        <div className={styles.topContainer}>
                            <div className={styles.imageContainer}>
                                {item.product.fileList && item.product.fileList.length > 0 && (
                                    <img
                                        src={item.product.fileList[0].source}
                                        alt="product"
                                        className={styles.productImage}
                                    />
                                )}
                            </div>
                            <div className={styles.detailsContainer}>
                                <div className={styles.productName}>{item.product.name}</div>
                                {item.review.recipient && item.review.writer && (
                                    isSeller(item.review.recipient, item.product.user) ? (
                                        <div className={styles.sellerInfo}>
                                            <span className={styles.sellerTag}>판매자</span>
                                        </div>
                                    ) : (
                                        <div className={styles.sellerInfo}>
                                            <span className={styles.sellerTag}>구매자</span>
                                        </div>
                                    )
                                )}
                                {item.review.recipient ? (
                                    <p className={styles.sellerName}>{item.review.recipient.nickName}</p>
                                ) : (
                                    <p>정보가 없습니다</p>
                                )}
                                <div className={styles.price}>{item.product.price}원</div>
                                <div className={styles.date}>{item.review.regDate}</div>
                            </div>
                        </div>
                        <div className={styles.reviewContent}>
                            {item.review.content}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ReviewList;
