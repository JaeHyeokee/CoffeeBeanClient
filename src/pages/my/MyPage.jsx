import React, { useState } from 'react';
import Header from '../components/Header';
import '../../css/my/MyPage.css'
import MyHome from './MyHome';
import SaleList from './SaleList';
import BuyList from './BuyList';
import DipsList from './DipsList';
import MyInformation from './MyInformation';
import ReviewList from './ReviewList';
import UnRegister from './UnRegister';
import { Nav } from 'react-bootstrap';

const MyPage = () => {
    const [activePage, setActivePage] = useState('MyHome');

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    return (
        <>
            <Header />
            <div className='myhome-body'>
                <div className='my-nav-body'>
                    <div className='mypage'>마이 페이지</div>
                    <div className='my-pay-info'>거래 정보</div>
                    <Nav id='my-nav-box' className='flex-column'>
                        <Nav.Item className={activePage === 'SaleList' ? 'active' : ''} onClick={() => handlePageChange('SaleList')}>판매 내역</Nav.Item>
                        <Nav.Item className={activePage === 'BuyList' ? 'active' : ''} onClick={() => handlePageChange('BuyList')}>구매 내역</Nav.Item>
                        <Nav.Item className={activePage === 'DipsList' ? 'active' : ''} onClick={() => handlePageChange('DipsList')}>찜 목록</Nav.Item>
                    </Nav>
                    <div className='my-account-info'>내 정보</div>
                    <Nav id='my-nav-box' className='flex-column'>
                        <Nav.Item className={activePage === 'MyInformation' ? 'active' : ''} onClick={() => handlePageChange('MyInformation')}>내 정보 관리</Nav.Item>
                        <Nav.Item className={activePage === 'ReviewList' ? 'active' : ''} onClick={() => handlePageChange('ReviewList')}>나의 후기</Nav.Item>
                        <Nav.Item className={activePage === 'UnRegister' ? 'active' : ''} onClick={() => handlePageChange('UnRegister')}>탈퇴하기</Nav.Item>
                    </Nav>
                </div>
                <section className='mypage-activated'>
                    {activePage === 'SaleList' && <SaleList/>}
                    {activePage === 'BuyList' && <BuyList/>}
                    {activePage === 'DipsList' && <DipsList/>}
                    {activePage === 'MyInformation' && <MyInformation/>}
                    {activePage === 'ReviewList' && <ReviewList/>}
                    {activePage === 'UnRegister' && <UnRegister/>}
                </section>
            </div>
        </>
    );
};

export default MyPage;