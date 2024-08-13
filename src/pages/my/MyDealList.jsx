import React, { useContext, useEffect, useState } from 'react';
import MyHome from './MyHome';
import MyDealListSub from './MyDealListSub';
import { Button, Tab, Tabs } from 'react-bootstrap';
import Style from '../../css/my/MyDealList.module.css';

const MyDealList = (props) => {
    const [ key, setKey ] = useState('all');
    const { pageType, isProductOrCar, setIsProductOrCar } = props;

     const handleClick = (e) => {
        if(e.target.value === 'product' && isProductOrCar === 'car') setIsProductOrCar('product');
        if(e.target.value === 'car' && isProductOrCar === 'product') setIsProductOrCar('car');
    }

    return (
        <>
            <MyHome/>
            <section className={Style.sellList}>
                <div className={Style.myListHeader}>
                    <p className={Style.sellTitle}>{pageType === 'sell' ? '판매 내역' : pageType === 'buy' ? '구매 내역' : '찜 목록'}</p>
                    <div className={Style.categoryFilterButtonFrame}>
                        <Button className={isProductOrCar === 'product' ? Style.categoryFilterButtonActive : Style.categoryFilterButton} onClick={handleClick} value='product'>중고 물품</Button>
                        <Button className={isProductOrCar === 'car' ? Style.categoryFilterButtonActive : Style.categoryFilterButton} onClick={handleClick} value='car'>중고차</Button>
                    </div>
                </div>
                <Tabs className={Style.sellStatus} activeKey={key} onSelect={(k) => setKey(k)}>
                    <Tab eventKey='all' title='전체'>
                        <MyDealListSub key={key} isProductOrCar={isProductOrCar} pageType={pageType}/>
                    </Tab>
                    <Tab eventKey='onSale' title='판매중'>
                        <MyDealListSub key={key} isProductOrCar={isProductOrCar} pageType={pageType}/>
                    </Tab>
                    <Tab eventKey='booked' title='예약중'>
                        <MyDealListSub key={key} isProductOrCar={isProductOrCar} pageType={pageType}/>
                    </Tab>
                    <Tab eventKey='outOfSale' title='판매완료'>
                        <MyDealListSub key={key} isProductOrCar={isProductOrCar} pageType={pageType}/>
                    </Tab>
                </Tabs>
            </section>
        </>
    );
};

export default MyDealList;