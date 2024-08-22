import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, NavigationType, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUser } from 'react-icons/fa';  // 사용자 아이콘 import
import styles from '../../css/my/RecipientReviewList.module.css';
import { SERVER_HOST } from '../../apis/Api';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Footer from '../components/Footer';

const ReviewList = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { userInfo } = useContext(LoginContext);

    const [reviews, setReviews] = useState([]);
    const [sampleReview, setSampleReview] = useState({
        timeCount: "",
        mannerCount: "",
        badMannerCount: "",
        responseCount: ""
    });
    const [profileImages, setProfileImages] = useState({});

    useEffect(() => {
        const fetchProfileImage = async (writerId) => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/user/profile/${writerId}`);
                const imageUrl = response.data;
                setProfileImages(prevState => ({
                    ...prevState,
                    [writerId]: imageUrl
                }));
            } catch (error) {
                console.error('Failed to fetch profile image:', error);
            }
        };

        axios({
            method: "get",
            url: `http://${SERVER_HOST}/review/list/recipient/${userId}`
        }).then(response => {
            const { data, status } = response;
            if (status === 200) {
                setReviews(data);
                data.forEach(review => {
                    fetchProfileImage(review.review.writer.userId);
                });
            } else {
                window.alert('읽어오기 실패');
            }
        });
    }, [userId]);

    useEffect(() => {
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/user/sampleReview/${userId}`
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
            <div className={styles.reviewListContainer}>
                <div className={styles.firstHeader}>
                    <button className={styles.backButton} onClick={() => navigate('/MyPage')}>
                        <FaArrowLeft />
                    </button>
                    <div className={styles.title}>거래 후기</div>
                    <div></div>
                </div>
                <hr className={styles.firstHeaderLine} />
                <div className={styles.header}>
                    <div className={styles.navLinkContainer}>
                        <Link to={'/ReviewList/recipient/' + userId} className={`${styles.navLink} ${styles.activeNavLink}`}>나의 후기</Link>
                        <Link to={'/ReviewList/writer/' + userId} className={styles.navLink}>내가 쓴 후기</Link>
                    </div>
                </div>
                <hr className={styles.divider} />
                <div className={styles.positivePoints}>
                    <h4>이런 점이 좋았어요!</h4>
                    <ul>
                        <li>
                            <span>
                                친절/매너가 좋아요!
                            </span>
                            <span className={styles.reviewCount}><FaUser className={styles.userIcon} />{sampleReview.mannerCount}</span>
                        </li>
                        <li>
                            <span>
                                응답이 빨라요!
                            </span>
                            <span className={styles.reviewCount}><FaUser className={styles.userIcon} />{sampleReview.responseCount}</span>
                        </li>
                        <li>
                            <span>
                                거래 시간을 잘 지켜요!
                            </span>
                            <span className={styles.reviewCount}><FaUser className={styles.userIcon} />{sampleReview.timeCount}</span>
                        </li>
                        <li>
                            <span>
                                친절하지 않아요...
                            </span>
                            <span className={styles.reviewCount}><FaUser className={styles.userIcon} />{sampleReview.badMannerCount}</span>
                        </li>
                    </ul>
                </div>
                <div className={styles.detailedReviews}>
                    <h4>상세한 후기도 있어요!</h4>
                    {reviews.map((item, index) => (
                        <div key={index} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <img className={styles.myHomeProfileImg} src={profileImages[item.review.writer.userId] || 'https://img2.joongna.com/common/Profile/Default/profile_f.png'} alt='프로필' />
                                <span className={styles.nickname}>
                                    {item.review.writer.nickName}
                                </span>
                                {isSeller(item.review.recipient, item.product.user) ? (
                                    <div className={styles.sellerInfo}>
                                        <span className={styles.sellerTag}>구매자</span>
                                    </div>
                                ) : (
                                    <div className={styles.sellerInfo}>
                                        <span className={styles.sellerTag}>판매자</span>
                                    </div>
                                )}
                                <span className={styles.date}>
                                    {item.review.regDate}
                                </span>
                            </div>
                            <div className={styles.reviewContent}>
                                {item.review.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewList;
