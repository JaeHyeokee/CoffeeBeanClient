import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/car/CarItem.module.css'; // CSS 모듈을 임포트

const CarItem = (props) => {
    const { car } = props;
    const { carId, name, price, fileList, modelYear, carNum, fuel, transmission, distance } = car;
    const navigate = useNavigate();

    const handleImageClick = () => {
        navigate(`/carDetail/${carId}`);
    };

    const firstImage = fileList.length > 0 ? fileList[0].source : '';

    return (
        <div className={styles.carItem} onClick={handleImageClick}>
            {firstImage && (
                <img src={firstImage} alt={name} className={styles.carItemImage} />
            )}
            <div className={styles.carItemDetails}>
                <h3 className={styles.carItemName}>{name}</h3>
                <div className={styles.carItemInfo}>
                    <span>{modelYear} 년식</span>·<span>{distance} KM</span>·<span>{carNum}</span>
                </div>
                <div className={styles.carItemInfo}>
                    <span>{fuel}</span>·<span>{transmission}</span>
                </div>
                <p className={styles.carItemPrice}>{price === 0 ? '가격협의' : `${price} 만원`}</p>
            </div>
        </div>
    );
};

export default CarItem;
