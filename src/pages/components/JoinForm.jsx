import React, { useState, useEffect } from 'react';
import { checkEmail, sendEmail, verifyCode } from '../../apis/Auth';
import * as Swal from '../../apis/Alert';
import { SERVER_HOST } from '../../apis/Api';
import styles from '../../css/my/Join.module.css';
import MainLogo from '../../image/MainLogo.png';
import Header from '../components/Header';
import Footer from '../components/Footer';

const JoinForm = ({ join }) => {
    const KAKAO_CLIENT_ID = 'YOUR_KAKAO_CLIENT_ID';
    const REDIRECT_URI = `http://${SERVER_HOST}/oauth/callback/kakao`;

    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const [emailDomain, setEmailDomain] = useState('naver.com');
    const [customDomain, setCustomDomain] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailDomainChange = (e) => {
        const selectedDomain = e.target.value;
        setEmailDomain(selectedDomain);
        if (selectedDomain !== "") {
            setCustomDomain('');
        }
    };

    const handleCustomDomainChange = (e) => {
        setCustomDomain(e.target.value);
    };

    const sendVerificationCode = async () => {
        const fullEmail = email + "@" + (emailDomain === "" ? customDomain : emailDomain);

        try {
            // 이메일 중복검사 실시
            const checkResponse = await checkEmail(fullEmail);
            if (checkResponse.status === 409) {
                Swal.alert('이 이메일은 사용중입니다.');
                return;
            }

            const response = await sendEmail(fullEmail);
            if (response.status === 200) {
                setEmailSent(true);
                setCountdown(180); // 3분 카운트다운 시작
                Swal.alert('인증번호가 이메일로 발송되었습니다.');
            } else {
                Swal.alert('인증번호 발송 실패');
            }
        } catch (error) {
            console.error('인증번호 발송 에러코드 :', error);
            if (error.response) {
                Swal.alert(`인증번호 발송 중 에러 발생: ${error.response.data.message}`);
            } else if (error.message.includes("Invalid Addresses")) {
                Swal.alert('유효하지 않은 이메일 주소입니다. 이메일 주소를 확인해 주세요.');
            } else {
                Swal.alert('인증번호 발송 중 에러 발생');
            }
        }
    };

    const handleVerifyCode = async () => {
        const fullEmail = email + "@" + (emailDomain === "" ? customDomain : emailDomain);
        const verifyCodeValue = document.getElementById('verifyCode').value;

        try {
            const response = await verifyCode(fullEmail, verifyCodeValue);
            if (response.data.success) {
                setEmailVerified(true);
                Swal.alert('이메일 인증 성공!');
            } else {
                Swal.alert('이메일 인증 실패.' + response.data.message);
            }
        } catch (error) {
            console.error('Verification failed:', error);
            Swal.alert('이메일 인증 중 에러 발생');
        }
    };

    const onJoin = (e) => {
        e.preventDefault();
        if (!emailVerified) {
            Swal.alert('먼저 이메일 인증을 완료해주세요.');
            return;
        }
        const userName = e.target.userName.value;
        const password = e.target.password.value;
        const nickName = e.target.nickName.value;
        const verifyCode = e.target.verifyCode ? e.target.verifyCode.value : '';

        const fullEmail = email + "@" + (emailDomain === "" ? customDomain : emailDomain);

        join({ userName, password, nickName, email: fullEmail, verifyCode });
    };

    return (
        <>
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img src={MainLogo} alt="My Image" className={styles.image} />
            </div>
            <div className={styles.formWrapper}>
                <div className={styles.form}>
                    <div className={styles.signupTitle}>회원가입</div>
                    <form className={styles.signupForm} onSubmit={onJoin}>
                        {/* 아이디 */}
                        <div>
                            <label htmlFor="userName">아이디</label>
                            <input
                                id="userName"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                name="userName"
                                autoComplete="userName"
                                required
                            />
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label htmlFor="password">비밀번호</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                name="password"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        {/* 닉네임 */}
                        <div>
                            <label htmlFor="nickName">닉네임</label>
                            <input
                                id="nickName"
                                type="text"
                                placeholder="닉네임을 입력하세요"
                                name="nickName"
                                autoComplete="nickname"
                                required
                            />
                        </div>

                        {/* 이메일 */}
                        <div className={styles.emailContainer}>
                            <label htmlFor="email">이메일</label>
                            <div className={styles.emailInputWrapper}>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="이메일을 입력하세요"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                                @
                                <select
                                    id="emailDomain"
                                    value={emailDomain}
                                    onChange={handleEmailDomainChange}
                                    required
                                >
                                    <option value="naver.com">naver.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="">직접입력</option>
                                </select>
                                {emailDomain === "" && (
                                    <input
                                        type="text"
                                        placeholder="도메인 입력"
                                        value={customDomain}
                                        onChange={handleCustomDomainChange}
                                        required
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                className={styles.emailButton}
                                onClick={sendVerificationCode}
                                disabled={countdown > 0}
                            >
                                인증번호 발송
                            </button>
                        </div>

                        {/* 인증코드 입력 및 카운트다운 */}
                        {emailSent && (
                            <div className={styles.verificationContainer}>
                                <label htmlFor="verifyCode">인증번호</label>
                                <input
                                    id="verifyCode"
                                    type="text"
                                    placeholder="인증번호를 입력하세요"
                                    name="verifyCode"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.verifyButton}
                                    onClick={handleVerifyCode}
                                >
                                    인증 확인
                                </button>
                                <div className={styles.countdown}>
                                    {countdown > 0
                                        ? `남은 시간: ${Math.floor(countdown / 60)}분 ${countdown % 60}초`
                                        : "인증 시간이 만료되었습니다."}
                                </div>
                            </div>
                        )}

                        <button className={styles.btn} type="submit">
                            회원가입
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default JoinForm;
