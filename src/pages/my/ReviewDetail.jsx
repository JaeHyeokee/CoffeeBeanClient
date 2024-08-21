import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../../css/my/ReviewDetail.module.css';
import { Button } from 'react-bootstrap';
import { SERVER_HOST } from '../../apis/Api';

const ReviewDetail = () => {

    const navigate = useNavigate();
    const { chatRoomId, writerId } = useParams();

    const [review, setReview] = useState({
        reviewId: "",
        writer: null,
        recipient: null,
        content: "",
        regDate: "",
    });

    const [product, setProduct] = useState({
        name: "",
        price: "",
        user: "",
        fileList: [],
    });

    useEffect(() => {
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/review/detail/${chatRoomId}/${writerId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status === 200) {
                    setReview(data.review);
                    setProduct(data.product);
                } else {
                    window.alert('읽어오기 실패');
                }
            });
    }, [chatRoomId, writerId]);

    const isSeller = (recipient, seller) => {
        return recipient.userId === seller.userId;
    };

    return (
        <>
            <Header />
            <div className={styles.reviewDetailContainer}>
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate(`/WriterReviewList/${writerId}`)}>
                        <FaArrowLeft />
                    </button>
                    <div className={styles.title}>후기 상세</div>
                    <div></div> {/* Placeholder for alignment */}
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.imageContainer}>
                        {product.fileList && product.fileList.length > 0 && (
                            <img
                                src={product.fileList[0].source}
                                alt="product"
                                className={styles.productImage}
                            />
                        )}
                    </div>
                    <div className={styles.detailsContainer}>
                        <div className={styles.productName}>{product.name}</div>
                        {review.recipient && review.writer && (
                            isSeller(review.recipient, product.user) ? (
                                <div className={styles.sellerInfo}>
                                    <span className={styles.sellerTag}>판매자</span>
                                    <span className={styles.sellerName}>{review.recipient.nickName}</span>
                                </div>
                            ) : (
                                <div className={styles.sellerInfo}>
                                    <span className={styles.sellerTag}>구매자</span>
                                    <span className={styles.sellerName}>{review.recipient.nickName}</span>
                                </div>
                            )
                        )}
                        <div className={styles.price}>{product.price}원</div>
                        <div className={styles.date}>{review.regDate}</div>
                    </div>
                </div>
                <div className={styles.reviewContent}>
                    {review.content}
                </div>
            </div>
        </>
    );
};

export default ReviewDetail;
