import React from 'react';

const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;


const KaKaoLogin = () => {

    const handleLogin = () => {
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    return (
        <button onClick={handleLogin}>
            카카오 로그인
        </button>
    );
};

export default KaKaoLogin;