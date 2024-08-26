import React, { useState } from 'react';
import WriteReviewList from './WriterReviewList';
import Style from '../../css/my/ReviewList.module.css';

const ReviewList = () => {
    const [reviewType, setReviewType] = useState('received');
    return (
        <div>
            <WriteReviewList/>
        </div>
    );
};

export default ReviewList;