import React from 'react';
import LoginForm from '../components/LoginForm';
import KaKaoLogin from '../components/Kakao/KaKaoLogin';

const LogIn = () => {
    return (
        <div>
            <div className='container'>
                <LoginForm/>
                <KaKaoLogin/>
            </div>
        </div>
    );
};

export default LogIn;