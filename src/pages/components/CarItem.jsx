import React from 'react';

const CarItem = (props) => {
    const {id, name, price} = props.car
    return (
        <div>
            <td>{id}</td>
            <td>{name}</td>
            <td>{price}</td>
        </div>
    );
};

export default CarItem;