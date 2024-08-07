import React from 'react';

const ProductItem = (props) => {
    const {id, name, price} = props.product;
    return (
        <div>
            <td>{id}</td>
            <td>{name}</td>
            <td>{price}</td>
        </div>
    );
};

export default ProductItem;