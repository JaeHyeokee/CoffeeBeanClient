import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/car/CarItem.module.css'; // CSS 모듈을 임포트

const CarItem = (props) => {
    const { car } = props;
    const { carId, name, price, fileList } = car;
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
            <h3 className={styles.carItemName}>{name}</h3>
            <p className={styles.carItemPrice}>{price === 0 ? '가격협의' : `${price} 만원`}</p>
        </div>
    );
};

export default CarItem;
