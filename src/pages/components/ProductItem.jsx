import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../../css/product/ProductItem.module.css"

const ProductItem = (props) => {
    const { product } = props;
    const {productId, name, price, fileList} = product;
    const navigate = useNavigate();

    const handleImageClick = () => {
        navigate(`/ProductDetail/${productId}`);
    };

    const firstImage = fileList.length > 0 ? fileList[0].source : '';

    return (
        <div className={styles.productItem} onClick={handleImageClick}>
            {firstImage && (
                <div className={styles.productItemContainer}>
                <img src={firstImage} alt={name} className={styles.productItemImage} />
                </div>
            )}
            <h3 className={styles.productItemName}>{name}</h3>
            <p className={styles.productItemPrice}>{price === 0 ? '가격협의' : `${price.toLocaleString()} 원`}</p>
            <p className={styles.productItemdDesiredArea}>{Math.floor((new Date() - new Date(product.regDate)) / (1000 * 60 * 60 * 24)) === 0 ? '오늘' : Math.floor((new Date() - new Date(product.regDate)) / (1000 * 60 * 60 * 24)) + '일 전'}</p>
        </div>
    );
};

export default ProductItem;