import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { FaStar, FaThumbsUp, FaThumbsDown, FaArrowLeft } from 'react-icons/fa';
import { SERVER_HOST } from '../../apis/Api';
import styles from '../../css/my/ReviewCreate.module.css';
import Footer from '../components/Footer';

const ReviewCreate = () => {

    const navigate = useNavigate();
    const { chatRoomId, writerId } = useParams();

    const [review, setReview] = useState({
        writer: "",
        recipient: "",
        recipientId: ""
    });

    const [product, setProduct] = useState({
        name: "",
        fileList: [],
    });

    const [saveReview, setSaveReview] = useState({
        reviewContent: "",
        response: 0,
        manner: 0,
        time: 0,
        badManner: 0,
    });

    const [rating, setRating] = useState("");

    const handleInputChange = (e) => {
        const { name, checked, type } = e.target;
        if (type === "checkbox") {
            setSaveReview(prevState => ({
                ...prevState,
                [name]: checked ? 1 : 0
            }));
        } else {
            setSaveReview(prevState => ({
                ...prevState,
                [name]: e.target.value
            }));
        }
    };

    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const validate = () => {
        if (!rating) {
            window.alert('평가를 선택해 주세요.');
            return false;
        } else if (!saveReview.reviewContent) {
            window.alert('후기를 입력해 주세요.');
            return false;
        }
        return true;
    };

    useEffect(() => {
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/review/checkInfo/${chatRoomId}/${writerId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status == 200) {
                    setReview({
                        writer: data.writer,
                        recipient: data.recipient,
                        recipientId: data.recipient.userId
                    });
                    setProduct(data.product);
                } else {
                    window.alert('읽어오기 실패');
                }
            });
    }, []);

    const submitSaveReview = (e) => {
        e.preventDefault();

        if (!validate()) return;

        axios({
            method: 'post',
            url: `http://${SERVER_HOST}/review/write/${chatRoomId}/${writerId}`,
            headers: {
                "Content-Type": 'application/json',
            },
            data: JSON.stringify(saveReview),
        })
            .then(response => {
                const { data, status, statusText } = response;
                if (status === 201) {
                    axios({
                        method: 'post',
                        url: `http://${SERVER_HOST}/user/reliabilityUpdate/${review.recipientId}`,
                        headers: {
                            "Content-Type": 'multipart/form-data',
                        },
                        data: { rating },
                    })
                        .then(response => {
                            const { data, status, statusText } = response;
                            if (status === 200) {
                                window.alert('등록 완료');
                                navigate(`/ReviewDetail/${chatRoomId}/${writerId}`);
                            } else {
                                window.alert('등록 실패');
                            }
                        })
                } else {
                    window.alert('등록 실패');
                }
            })
            .catch(error => {
                console.error('Submission failed:', error.response?.data || error.message);
                window.alert('등록 중 오류가 발생했습니다.');
            });
    };

    const isSeller = (recipient, seller) => {
        return recipient.userId === seller.userId;
    };

    return (
        <>
            <Header />
            <br/><br/>
            <div className={styles.reviewCreateContainer}>
                <div className={styles.firstHeader}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>
                    <div className={styles.title}>후기 작성</div>
                </div>
                <hr className={styles.firstHeaderLine} />
                <div className={styles.productInfo}>
                    <div className={styles.productImageWrapper}>
                        {product.fileList && product.fileList.length > 0 && (
                            <img
                                src={product.fileList[0].source}
                                alt="product"
                                className={styles.productImage}
                            />
                        )}
                    </div>
                    <div className={styles.productDetails}>
                        <div className={styles.name}>{product.name}</div>
                        <div className={styles.nickname}>{review.recipient?.nickName}</div>
                    </div>
                </div>
                <hr className={styles.divider} />
                <div className={styles.transactionQuestion}>
                    <h5><strong>{review.recipient?.nickName}님과의 거래는 어떠셨나요?</strong></h5>
                </div>

                <div className={styles.ratingSection}>
                    <div className={`${styles.iconContainer} ${rating === 'Best' ? styles.active : ''}`} onClick={() => handleRatingClick('Best')}>
                        <div className={styles.iconWrapper}>
                            <FaStar className={styles.icon} />
                        </div>
                        <div>최고예요</div>
                    </div>
                    <div className={`${styles.iconContainer} ${rating === 'Good' ? styles.active : ''}`} onClick={() => handleRatingClick('Good')}>
                        <div className={styles.iconWrapper}>
                            <FaThumbsUp className={styles.icon} />
                        </div>
                        <div>좋아요</div>
                    </div>
                    <div className={`${styles.iconContainer} ${rating === 'Bad' ? styles.active : ''}`} onClick={() => handleRatingClick('Bad')}>
                        <div className={styles.iconWrapper}>
                            <FaThumbsDown className={styles.icon} />
                        </div>
                        <div>아쉬워요</div>
                    </div>
                </div>
                <hr className={styles.divider} />
                <Form onSubmit={submitSaveReview} className={styles.reviewOptions}>
                    <label>
                        <input
                            type="checkbox"
                            name="response"
                            checked={saveReview.response}
                            onChange={handleInputChange}
                            className={styles.customCheckbox}
                        />
                        응답이 빨라요!
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="manner"
                            checked={saveReview.manner}
                            onChange={handleInputChange}
                            className={styles.customCheckbox}
                        />
                        친절/매너가 좋아요!
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="time"
                            checked={saveReview.time}
                            onChange={handleInputChange}
                            className={styles.customCheckbox}
                        />
                        거래 시간을 잘 지켜요!
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="badManner"
                            checked={saveReview.badManner}
                            onChange={handleInputChange}
                            className={styles.customCheckbox}
                        />
                        친절하지 않아요...
                    </label>
                    <div className={styles.reviewTextarea}>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="reviewContent"
                            value={saveReview.reviewContent}
                            onChange={handleInputChange}
                            placeholder="생생한 후기를 남기고 공유해 보세요."
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>후기 등록</button>
                </Form>
            </div>
            <br/><br/>
            <Footer />
        </>
    );
};

export default ReviewCreate;
