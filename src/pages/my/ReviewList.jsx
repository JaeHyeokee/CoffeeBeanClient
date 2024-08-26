import React, { useState } from 'react';
import WriteReviewList from './WriterReviewList';

const ReviewList = () => {
    const [reviewType, setReviewType] = useState('received');
    return (
        <div>
            <WriteReviewList/>
        </div>
    );
};

export default ReviewList;