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
                <img src={firstImage} alt={name} className={styles.productItemImage} />
            )}
            <h3 className={styles.productItemName}>{name}</h3>
            <p className={styles.productItemPrice}>{price === 0 ? '가격협의' : `${price} 원`}</p>
        </div>
    );
};

export default ProductItem;