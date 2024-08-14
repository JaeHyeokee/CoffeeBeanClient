import React from 'react';
import Style from '../../css/components/Footer.module.css';
import Facebook from '../../image/Facebook.svg';
import Youtube from '../../image/Youtube.svg';
import NaverCafe from '../../image/NaverCafe.svg';
import Naver from '../../image/Naver.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className={Style.footerFrame}>
            <div className={Style.footerTop}>
                <div className={Style.footerInfo}>
                    <p className={Style.footerInfoTitle}>(주)커피빈 사업자 정보</p>
                    <p>(주)커피빈 | 대표자 : 이재혁</p>
                    <p>사업자 등록번호 : 010-4678-3712</p>
                    <p>통신판매신고번호 : 제2015 - 서울강남 - 03148호 </p>
                    <p>주소 : 서울특별시 강남구 테헤란로 26길 12 제일비전타워 13층</p>
                    <p>대표번호 : 1588-5890</p>
                    <p>메일 : jaehyeok817@gmail.com</p>
                    <p>호스팅제공자 : 아마존웹서비스</p>
                </div>
                <div className={Style.socialIconList}>
                    <Link to='https://www.facebook.com'><img src={Facebook} alt='Facebook'/></Link>
                    <Link to='https://www.youtube.com'><img src={Youtube} alt='Youtube'/></Link>
                    <Link to='https://www.youtube.com'><img src={NaverCafe} alt='NaverCafe'/></Link>
                    <Link to='https://www.naver.com'><img src={Naver} alt='Naver'/></Link>
                </div>
            </div>
            <p className={Style.footerBottom}>"커피빈" 상점의 판매상품을 제외한 모든 상품들에 대하여, (주)커피빈은 통신판매중개자로서 거래 당사자가 아니며 판매 회원과 구매 회원 간의 상품거래 정보 및 거래에 관여하지 않고, 어떠한 의무와 책임도 부담하지 않습니다.</p>
        </div>
    );
};

export default Footer;