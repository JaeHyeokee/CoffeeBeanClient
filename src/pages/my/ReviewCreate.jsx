import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, ListGroup, Col, Row } from 'react-bootstrap';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

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
        const { name, value, type, checked } = e.target;
        setSaveReview({
            ...saveReview,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value
        });
    };    

    const validate = () => {
        if (!saveReview.reviewContent) {
            window.alert('후기를 입력해 주세요.');
            return false;
        } else if (!rating){
            window.alert('평가를 선택해 주세요.');
            return false;
        }
        return true;
    };

    useEffect(() => {
        axios({
            method: "get",
            url: `http://localhost:8088/review/checkInfo/${chatRoomId}/${writerId}`
        })
            .then(response => {
                const { data, status } = response;
                if (status == 200) {
                    console.log("‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️" + data);
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

        console.log(saveReview);

        axios({
            method: 'post',
            url: `http://localhost:8088/review/write/${chatRoomId}/${writerId}`,
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
                        url: `http://localhost:8088/user/reliabilityUpdate/${review.recipientId}`,
                        headers: {
                            "Content-Type": 'multipart/form-data',
                        },
                        data: { rating },
                    })
                    .then(response => {
                        const { data, status, statusText } = response;
                        if(status === 200){
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
            .catch (error => {
                console.error('Submission failed:', error.response?.data || error.message);
                window.alert('등록 중 오류가 발생했습니다.');
            });
    };

    const isSeller = (recipient, seller) => {
        return recipient.userId === seller.userId;
    };

    const handleRatingClick = (selectedRating) => {
        setRating(selectedRating);
    };

    return (
        <>
            <Header />
            <Button variant="secondary" onClick={() => navigate(-1)}>이전</Button>
            <h3>후기 작성</h3>
            <div style={{ flex: '1' }}>
                {product.fileList && product.fileList.length > 0 && (
                    <img
                        src={product.fileList[0].source}
                        alt="product"
                    />
                )}
            </div>
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
            <hr />
            {review.recipient ? (
                <p>{review.recipient.nickName}</p>
            ) : (
                <p>정보가 없습니다</p>
            )}님과의 거래는 어떠셨나요?
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                <FaStar
                    size={50}
                    color={rating === 'Best' ? 'gold' : 'gray'}
                    onClick={() => handleRatingClick('Best')}
                    style={{ cursor: 'pointer' }}
                />
                <FaThumbsUp
                    size={50}
                    color={rating === 'Good' ? 'blue' : 'gray'}
                    onClick={() => handleRatingClick('Good')}
                    style={{ cursor: 'pointer' }}
                />
                <FaThumbsDown
                    size={50}
                    color={rating === 'Bad' ? 'red' : 'gray'}
                    onClick={() => handleRatingClick('Bad')}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <hr />
            생생한 후기를 남기고 공유해 보세요.
            <Form onSubmit={submitSaveReview}>
            <Form.Label>옵션 선택:</Form.Label>
                    <Form.Check
                        type="checkbox"
                        label="응답이 빨라요!"
                        name="response"
                        value={saveReview.response}
                        checked={saveReview.response}
                        onChange={handleInputChange}
                    />
                    <Form.Check
                        type="checkbox"
                        label="친절/매너가 좋아요!"
                        name="manner"
                        value={saveReview.manner}
                        checked={saveReview.manner}
                        onChange={handleInputChange}
                    />
                    <Form.Check
                        type="checkbox"
                        label="거래 시간을 잘 지켜요!"
                        name="time"
                        value={saveReview.time}
                        checked={saveReview.time}
                        onChange={handleInputChange}
                    />
                    <Form.Check
                        type="checkbox"
                        label="친절하지 않아요..."
                        name="badManner"
                        value={saveReview.badManner}
                        checked={saveReview.badManner}
                        onChange={handleInputChange}
                    />
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}></Form.Label>
                <Col sm={10}>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="reviewContent"
                        value={saveReview.reviewContent}
                        onChange={handleInputChange}
                    />
                </Col>
            </Form.Group>
            <Button variant="primary" type="submit" className="me-2">작성완료</Button>
            </Form>
        </>
    );
};

export default ReviewCreate;