import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import MyDealListSub from './MyDealListSub';
import Style from '../../css/my/MyDealListTab.module.css';

const MyDealListTab = (props) => {
    const { activatedKey, setActivatedKey, pageType, isProductOrCar } = props;

    return (
        <Tabs className={Style.sellStatus} activeKey={activatedKey} onSelect={(k) => setActivatedKey(k)}>
            <Tab eventKey='all' title='전체'>
                <MyDealListSub activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
            <Tab eventKey='onSale' title='판매중'>
                <MyDealListSub activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
            <Tab eventKey='booked' title='예약중'>
                <MyDealListSub activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
            <Tab eventKey='outOfSale' title='판매완료'>
                <MyDealListSub activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
        </Tabs>
    );
};

export default MyDealListTab;