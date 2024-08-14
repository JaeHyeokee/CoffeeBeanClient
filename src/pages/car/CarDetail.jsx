import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import styles from '../../css/car/CarDetail.module.css';
import { Carousel } from 'react-bootstrap';
import ChatFrame from '../chatting/ChatFrame';
import x from '../../image/x.svg';
import Swal from 'sweetalert2';
import axios from 'axios';

const CarDetail = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [recommendedCars, setRecommendedCars] = useState([]);
    const [index, setIndex] = useState(0);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [showFullIntroduce, setShowFullIntroduce] = useState(false); // 더보기 버튼 상태
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8088/car/detail/${id}`)
            .then(response => {
                setCar(response.data);
                window.scrollTo(0, 0); // 페이지 로드 시 스크롤을 맨 위로 이동
            })
            .catch(error => {
                console.error('실패', error);
            });
    }, [id]);

    useEffect(() => {
        if (car) {
            axios.get(`http://localhost:8088/car/category2/${car.category2}`)
                .then(response => {
                    setRecommendedCars(response.data);
                })
                .catch(error => {
                    console.error('추천 차량 불러오기 실패', error);
                });
        }
    }, [car]);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
    };

    const dip = () => {
        Swal.fire({
            title: '찜콩',
            html: '<div style="display: flex; align-items: center; justify-content: center;"></div>',
            showConfirmButton: false,
            width: '400px',
        });
    };

    useEffect(() => {
        if (isChatSidebarOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isChatSidebarOpen]);

    if (!car) {
        return <div>Loading...</div>;
    }

    const introduceLines = car.introduce.split(/(?<=니다|입니다|습니다)\s*/);
    const maxLinesToShow = 5; // 처음에 보여줄 줄 수

    const handleImageClick = (carId) => {
        navigate(`/CarDetail/${carId}`);
        window.scrollTo(0, 0); // 페이지 이동 시 스크롤을 맨 위로 이동
    };

    return (
        <>
            <Header />
            <div className={styles.cardetailBody}>
                <section className={styles.cardetailTop}>
                    <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                        {car.fileList.map((file, idx) => (
                            <Carousel.Item key={idx} className={styles.carouselItem}>
                                <img src={file.source} alt={file.filename} />
                            </Carousel.Item>
                        ))}
                    </Carousel>

                    <div className={styles.carInfo}>
                        <p>{car.category1} {car.category2}</p>
                        <h2 className={styles.carName}>{car.name}</h2>
                        <h1 className={styles.carPrice}>
                            {car.price === 0 ? '가격협의' : `${car.price.toLocaleString()} 만원`}
                        </h1>
                        <div className={styles.carInfoBottom}>
                            <div>
                                <p>제품상태</p>
                                <p>{car.status}</p>
                            </div>
                            <div>
                                <p>판매상태</p>
                                <p>{car.dealingStatus}</p>
                            </div>
                        </div>
                        <div className={styles.chatDipButton}>
                            <button className={styles.chatButton} onClick={toggleChatSidebar}>
                                채팅하기
                            </button>
                            <button className={styles.dipButton} onClick={dip}>찜하기</button>
                        </div>
                    </div>
                </section>

                <section className={styles.cardetailInfo}>
                    <div className={styles.leftPanel}>
                        <div className={styles.infoBox}>
                            <h2>차량 기본정보</h2>
                            <p>연식: {car.modelYear} 년</p>
                            <p>차량번호: {car.carNum}</p>
                            <p>주행거리: {car.distance} KM</p>
                            <p>배기량: {car.displacement} cc</p>
                            <p>변속기: {car.transmission}</p>
                            <p>연료: {car.fuel}</p>
                        </div>
                        <div className={styles.infoBox}>
                            <h2>보험처리</h2>
                            <p>보험사고(피해) 이력 횟수: {car.insuranceVictim} 회</p>
                            <p>보험사고(가해) 이력 횟수: {car.insuranceInjurer} 회</p>
                            <p>소유자 변경 이력 횟수: {car.ownerChange} 회</p>
                        </div>
                    </div>
                    <div className={styles.rightPanel}>
                        <div className={styles.infoBox}>
                            <h2>가게정보</h2>
                            <p>이름: {car.user.userName}</p>
                            <p>이메일: {car.user.email}</p>
                        </div>
                    </div>
                </section>

                <section className={styles.cardetailBottom}>
                    <div className={styles.infoBox}>
                        <h2>상품정보</h2>
                        {introduceLines.slice(0, showFullIntroduce ? introduceLines.length : maxLinesToShow).map((line, index) => (
                            <p key={index} className={styles.introduce}>{line}</p>
                        ))}
                        {introduceLines.length > maxLinesToShow && (
                            <button onClick={() => setShowFullIntroduce(!showFullIntroduce)} className={styles.moreButton}>
                                {showFullIntroduce ? '접기' : '더보기'}
                            </button>
                        )}
                    </div>
                </section>

                <section className={styles.carRecommend}>
                    <h2>추천 차량</h2>
                    <div className={styles.recommendationContainer}>
                        {recommendedCars.map((recCar) => {
                            const firstImage = recCar.fileList.length > 0 ? recCar.fileList[0].source : '';
                            return (
                                <div key={recCar.carId} className={styles.recommendationCard} onClick={() => handleImageClick(recCar.carId)}>
                                    {firstImage && (
                                        <img src={firstImage} alt={recCar.name} className={styles.recommendationImage} />
                                    )}
                                    <h3>{recCar.name}</h3>
                                    <p>{recCar.price === 0 ? '가격협의' : `${recCar.price} 만원`}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {isChatSidebarOpen && (
                    <>
                        <div className={`${styles.overlay} ${isChatSidebarOpen ? styles.active : ''}`} onClick={toggleChatSidebar} />
                        <div className={`${styles.chatSidebar} ${isChatSidebarOpen ? styles.open : ''}`}>
                            <button className={styles.closeButton} onClick={toggleChatSidebar}>
                                <img src={x} alt='닫기' height={25} width={25} />
                            </button>
                            <ChatFrame productId={parseInt(id, 10)} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default CarDetail;
