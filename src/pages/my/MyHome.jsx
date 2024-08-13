import React, { useContext } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Style from '../../css/my/MyHome.module.css';
import { LoginContext } from '../../contexts/LoginContextProvider';

const MyHome = () => {
    const { userInfo } = useContext(LoginContext);

    return (
        <section className={Style.myHomeInfo}>
            <img className={Style.myHomeProfileImg} src='https://img2.joongna.com/common/Profile/Default/profile_f.png' alt='프로필'/>
            <div className={Style.myHomeProfileContent}>
                <div>
                    <span className={Style.nickNamePrint}>{userInfo.userName}</span>
                    <p className={Style.oneLineIntro}>안녕하세요! 키티에요~</p>
                </div>
                <div>
                    <div className={Style.trustIndexInfo}>
                        <div className={Style.myTrustIndex}>
                            <p className={Style.myTrustIndexLabel}>신뢰지수</p>
                            <p className={Style.myTrustIndexFigure}>{userInfo.reliability}</p>
                        </div>
                        <p className={Style.maxTrustIndex}>1,000</p>
                    </div>
                    <ProgressBar className={Style.trustIndexBar} now={userInfo.reliability / 10}/>
                </div>
            </div>
        </section>
    );
};

export default MyHome;