import React, { useContext, useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Style from '../../css/my/MyHome.module.css';
import { LoginContext } from '../../contexts/LoginContextProvider';

const MyHome = () => {
    const { userInfo } = useContext(LoginContext);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if(oldProgress >= userInfo.reliability) {
                    clearInterval(interval);
                    return userInfo.reliability;
                }
                return Math.min(oldProgress + 10, userInfo.reliability);
            });
        }, 10);
        return () => clearInterval(interval);
    }, [userInfo.reliability]);

    return (
        <section className={Style.myHomeInfo}>
            <img className={Style.myHomeProfileImg} src={'https://img2.joongna.com/common/Profile/Default/profile_f.png'} alt='프로필'/>
            <div className={Style.myHomeProfileContent}>
                <div>
                    <span className={Style.nickNamePrint}>{userInfo.userName}</span>
                    <p className={Style.oneLineIntro}>안녕하세요! 키티에요~</p>
                </div>
                <div>
                    <div className={Style.trustIndexInfo}>
                        <div className={Style.myTrustIndex}>
                            <p className={Style.myTrustIndexLabel}>신뢰지수</p>
                            <p className={Style.myTrustIndexFigure}>{progress}</p>
                        </div>
                        <p className={Style.maxTrustIndex}>1,000</p>
                    </div>
                    <ProgressBar className={Style.trustIndexBar} now={progress / 10}/>
                </div>
            </div>
        </section>
    );
};

export default MyHome;