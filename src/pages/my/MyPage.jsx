import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Style from '../../css/my/MyPage.module.css';
import DealListFrame from './DealListFrame';
import MyInformation from './MyInformation';
// import ReviewList from './WriterReviewList';
import ReviewList from './ReviewList';
import UnRegister from './UnRegister';
import { Nav } from 'react-bootstrap';
import UserManagement from '../admin/UserManagement';
import { LoginContext } from '../../contexts/LoginContextProvider';

const MyPage = () => {
    const [activePage, setActivePage] = useState('SaleList');
    const [isProductOrCar, setIsProductOrCar] = useState('product');

    const { roles } = useContext(LoginContext);

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    return (
        <>
            <Header/>
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
                    {roles.isAdmin && (
                        <>
                            <div className={Style.myAccountInfo}>관리자</div>
                            <Nav className={`flex-column ${Style.myNavBox}`}>
                                <Nav.Item className={activePage === 'UserManagement' ? `${Style.active}` : ''} onClick={() => handlePageChange('UserManagement')}>회원탈퇴 차트</Nav.Item>
                            </Nav>
                        </>
                    )}
                </div>
                <section className={Style.myPageActivated}>
                    {activePage === 'SaleList' && <DealListFrame pageType={'sell'} isProductOrCar={isProductOrCar} setIsProductOrCar={setIsProductOrCar}/>}
                    {activePage === 'BuyList' && <DealListFrame pageType={'buy'} isProductOrCar={isProductOrCar} setIsProductOrCar={setIsProductOrCar}/>}
                    {activePage === 'DipsList' && <DealListFrame pageType={'dips'} isProductOrCar={isProductOrCar} setIsProductOrCar={setIsProductOrCar}/>}
                    {activePage === 'MyInformation' && <MyInformation/>}
                    {activePage === 'ReviewList' && <ReviewList/>}
                    {activePage === 'UnRegister' && <UnRegister/>}
                    {activePage === 'UserManagement' && <UserManagement/>}
                </section>
            </div>
            <Footer/>
        </>
    );
};

export default MyPage;