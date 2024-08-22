import React from 'react';
import LoginForm from '../components/LoginForm';
import KaKaoLogin from '../components/Kakao/KaKaoLogin';
import Header from '../components/Header';
import Footer from '../components/Footer';
// import styles from '../../css/my/LogIn.module.css';

const LogIn = () => {
    return (
        <>
            <Header />
            <div className='container'>
                <LoginForm/>
                <KaKaoLogin/>
            </div>
            <Footer />
        </>

    );
};

export default LogIn;