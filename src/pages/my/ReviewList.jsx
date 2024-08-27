import React, { useState } from 'react';
import RecipientReviewList from './RecipientReviewList';
import WriteReviewList from './WriterReviewList';
import Style from '../../css/my/ReviewList.module.css';
import { Tab, Tabs } from 'react-bootstrap';

const ReviewList = () => {
    const [reviewType, setReviewType] = useState('received');
    return (
        <>
            <h1>거래 후기</h1>
            <Tabs className={Style.s} activeKey={reviewType} onSelect={(k) => setReviewType(k)}>
                <Tab eventKey='received' title='나의 후기'>
                    <RecipientReviewList/>
                </Tab>
                <Tab eventKey='write' title='내가 쓴 후기'>
                    <WriteReviewList/>
                </Tab>
            </Tabs>
        </>
    );
};

export default ReviewList;