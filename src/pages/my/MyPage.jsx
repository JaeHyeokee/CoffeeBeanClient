import React, { useState } from 'react';
import Header from '../components/Header';
import '../../css/my/MyPage.css'
import MyHome from './MyHome';
import MyInformation from './MyInformation';
import ReviewList from './ReviewList';
import UnRegister from './UnRegister';
// import 'bootstrap/dist/css/bootstrap.min.css';

const MyPage = () => {
    const [activePage, setActivePage] = useState('MyHome');

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    return (
        <>
            <Header />
            <div className='myhome-body'>
                <nav className='my-nav-box'>
                    <div className='mypage'>마이 페이지</div>
                    <ul className='mypage-menu'>
                        <li className={activePage === 'MyHome' ? 'active' : ''} onClick={() => handlePageChange('MyHome')}>마이 홈</li>
                        <li className={activePage === 'MyInformation' ? 'active' : ''} onClick={() => handlePageChange('MyInformation')}>내 정보 관리</li>
                        <li className={activePage === 'ReviewList' ? 'active' : ''} onClick={() => handlePageChange('ReviewList')}>거래 후기</li>
                        <li className={activePage === 'UnRegister' ? 'active' : ''} onClick={() => handlePageChange('UnRegister')}>탈퇴하기</li>
                    </ul>
                </nav>
                <section className='mypage-activated'>
                    {activePage === 'MyHome' && <MyHome/>}
                    {activePage === 'MyInformation' && <MyInformation/>}
                    {activePage === 'ReviewList' && <ReviewList/>}
                    {activePage === 'UnRegister' && <UnRegister/>}
                </section>
            </div>
        </>
    );
};

export default MyPage;