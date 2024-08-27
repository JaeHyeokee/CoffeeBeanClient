import React, { useState } from 'react';
import WriteReviewList from './WriterReviewList';
import Style from '../../css/my/ReviewList.module.css';
import { Tab, Tabs } from 'react-bootstrap';

const ReviewList = () => {
    const [reviewType, setReviewType] = useState('received');
    return (
        <>
            <WriteReviewList/>
        </>
    );
};

export default ReviewList;