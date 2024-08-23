import React from 'react';
import LoginForm from '../components/LoginForm';
import KaKaoLogin from '../components/Kakao/KaKaoLogin';
import Header from '../components/Header';
import Footer from '../components/Footer';
import my from '../../image/MyIcon.svg';
// import styles from '../../css/my/LogIn.module.css';

const LogIn = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <LoginForm/>
            </div>
            <Footer />
        </>

    );
};

export default LogIn;