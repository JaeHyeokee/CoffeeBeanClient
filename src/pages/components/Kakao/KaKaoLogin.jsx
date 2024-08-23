import React from 'react';
import kakao from '../../../image/kakao_logo.png';
import styles from '../../../css/my/LogIn.module.css';

const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

const KaKaoLogin = () => {
    const handleLogin = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    return (
        <button className={styles.kakaoButton} onClick={handleLogin}>
            <img src={kakao} alt="kakao" className={styles.kakaoIcon} />
            <span className={styles.kakaoText}>카카오톡 로그인</span>
        </button>
    );
};

export default KaKaoLogin;
