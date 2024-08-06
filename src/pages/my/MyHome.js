import React from 'react';
import Header from '../components/Header';
import '../../css/my/MyHome.css'

const MyHome = () => {
    return (
        <>
            <Header />
            <div className='myhome-body'>
                <div className='mypage-box'>
                    <div className='mypage'>마이페이지</div>
                    <div className='deal-info'>거래정보 </div>
                    <p>판매내역</p>
                    <p>구매내역</p>
                    <p>택배</p>
                    <p>찜한상품</p>
                    <hr />
                    <div className='my-info'>내 정보 </div>
                    <p>내 정보 관리</p>
                    <p>거래 후기</p>
                    <p>탈퇴하기</p>
                </div>

                <section className='myinfo-detail'>
                    <p>커피빈#1212121212</p>
                </section>
            </div>
        </>
    );
};

export default MyHome;