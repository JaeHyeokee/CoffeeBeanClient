import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { LoginContext } from '../../contexts/LoginContextProvider';
import KaKaoLogin from '../components/Kakao/KaKaoLogin';
import styles from '../../css/my/LogIn.module.css';
import MainLogo from '../../image/MainLogo.png';

const LoginForm = () => {

    const {login} = useContext(LoginContext);
    const [rememberUserId, setRememberUserId] = useState();

    const onLogin = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const rememberId = e.target.rememberId.checked;
    
        console.log(e.target.username.value)
        console.log(e.target.password.value)
        console.log(e.target.rememberId.checked)
    
        login(username, password, rememberId);  // 로그인 진행
    
    };

    useEffect(() => {
        // 쿠키에 저장된 username(아이디) 가져오기
        const rememberId = Cookies.get('rememberId');
        console.log(`쿠키 rememberId : ${rememberId}`);
        setRememberUserId(rememberId);
    },[])

    return (
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img src={MainLogo} alt="My Image" className={styles.image} />
        </div>
        <div className={styles.formWrapper}>
          <div className={styles.form}>
            <div className={styles.loginTitle}>Login</div>
            <form className={styles.loginForm} onSubmit={(e) => onLogin(e)}>
              <div>
                <label htmlFor="username">아이디</label>
                <input
                  id="username"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  name="username"
                  autoComplete="username"
                  required
                  defaultValue={rememberUserId}
                />
              </div>
              <div>
                <label htmlFor="password">비밀번호</label>
                <input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className={styles.formCheck}>
                <label className={styles.toggleBtn}>
                  <input
                    type="checkbox"
                    id="remember-id"
                    name="rememberId"
                    defaultChecked={rememberUserId}
                  />
                  <span className={styles.slider}></span>
                </label>
                <label htmlFor="remember-id" className={styles.checkLabel}>
                  아이디 저장
                </label>
              </div>
        
              <button className={styles.btn} type="submit">
                로그인
              </button>
        
              <KaKaoLogin />
        
              <div>
                아직 회원이 아니신가요?
                <a href="/Join" className={styles.signUpLink}>
                  회원가입
                </a>
                을 지금 하세요!
              </div>
            </form>
          </div>
        </div>
      </div>
    );
    
}

export default LoginForm;