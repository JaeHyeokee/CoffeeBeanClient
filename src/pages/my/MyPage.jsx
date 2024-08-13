import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Style from '../../css/my/MyPage.module.css';
import MyDealList from './MyDealList';
import MyInformation from './MyInformation';
import ReviewList from './ReviewList';
import UnRegister from './UnRegister';
import { Nav } from 'react-bootstrap';

const MyPage = () => {
    const [activePage, setActivePage] = useState('SaleList');
    const [isProductOrCar, setIsProductOrCar] = useState('product');

    useEffect(() => {}, [isProductOrCar]);

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    return (
        <>
            <Header />
            <div className={Style.myHomeBody}>
                <div className={Style.myNavBody}>
                    <div className={Style.myPage}>마이 페이지</div>
                    <div className={Style.myPayInfo}>거래 정보</div>
                    <Nav className={`flex-column ${Style.myNavBox}`}>
                        <Nav.Item className={activePage === 'SaleList' ? `${Style.active}` : ''} onClick={() => handlePageChange('SaleList')}>판매 내역</Nav.Item>
                        <Nav.Item className={activePage === 'BuyList' ? `${Style.active}` : ''} onClick={() => handlePageChange('BuyList')}>구매 내역</Nav.Item>
                        <Nav.Item className={activePage === 'DipsList' ? `${Style.active}` : ''} onClick={() => handlePageChange('DipsList')}>찜 목록</Nav.Item>
                    </Nav>
                    <div className={Style.myAccountInfo}>내 정보</div>
                    <Nav className={`flex-column ${Style.myNavBox}`}>
                        <Nav.Item className={activePage === 'MyInformation' ? `${Style.active}` : ''} onClick={() => handlePageChange('MyInformation')}>내 정보 관리</Nav.Item>
                        <Nav.Item className={activePage === 'ReviewList' ? `${Style.active}` : ''} onClick={() => handlePageChange('ReviewList')}>나의 후기</Nav.Item>
                        <Nav.Item className={activePage === 'UnRegister' ? `${Style.active}` : ''} onClick={() => handlePageChange('UnRegister')}>탈퇴하기</Nav.Item>
                    </Nav>
                </div>
                <section className={Style.myPageActivated}>
                    {activePage === 'SaleList' && <MyDealList pageType={'sell'} isProductOrCar={isProductOrCar} setIsProductOrCar={setIsProductOrCar}/>}
                    {activePage === 'BuyList' && <MyDealList pageType={'buy'} isProductOrCar={isProductOrCar} setIsProductOrCar={setIsProductOrCar}/>}
                    {activePage === 'DipsList' && <MyDealList pageType={'dips'} isProductOrCar={isProductOrCar} setIsProductOrCar={setIsProductOrCar}/>}
                    {activePage === 'MyInformation' && <MyInformation/>}
                    {activePage === 'ReviewList' && <ReviewList/>}
                    {activePage === 'UnRegister' && <UnRegister/>}
                </section>
            </div>
        </>
    );
};

export default MyPage;