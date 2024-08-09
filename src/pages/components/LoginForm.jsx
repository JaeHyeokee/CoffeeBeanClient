import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { LoginContext } from '../../contexts/LoginContextProvider';

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
    <div className="form">
      <h2 className="login-title">Login</h2>

      <form className="login-form" onSubmit={ (e) => onLogin(e) }>
        <div>
          <label htmlFor="name">username</label>
          <input
                id="username"
                type="text"
                placeholder="username"
                name="username"
                autoComplete='username'
                required
                defaultValue={rememberUserId}
                />
        </div>
        <div>
          <label htmlFor="password">password </label>
          <input
                id="password"
                type="password"
                placeholder="password"
                name="password"
                autoComplete='current-password'
                required
                />
        </div>
        <div className='form-check'>
          <label className="toggle-btn">
            { !rememberUserId 
              ? 
              <input type="checkbox" id="remember-id" name='rememberId' value='0' />
              :
              <input type="checkbox" id="remember-id" name='rememberId' value='0' defaultChecked />
            }
            <span className="slider"></span>
          </label>
          <label htmlFor='remember-id' className='check-label'>아이디 저장</label>
        </div>

        <button className="btn btn--form btn-login" value="Login">
          Login
        </button>
      </form>
  </div>
    );
};

export default LoginForm;