import Cookies from 'js-cookie';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Swal from '../apis/alert';
import * as auth from '../apis/auth';
import api from '../apis/api';
import { SERVER_HOST } from '../apis/api'

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName';

// 반복되는 인증을 전역적으로 사용
const LoginContextProvider = ({children}) => {

  const navigate = useNavigate();

  // Context 에서 다룰 '상태'

  // 로그인 여부
  // const [isLogin, setIsLogin] = useState(false);
  const [ isLogin, setIsLogin ] = useState(JSON.parse(localStorage.getItem("isLogin")) || false);

  // 유저 정보
  // const [userInfo, setUserInfo] = useState({});
  const [ userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});

  // 권한 정보
  // const [roles, setRoles] = useState({ isMember: false, isAdmin: false });
  const [ roles, setRoles ] = useState(JSON.parse(localStorage.getItem("roles")) || {isUser: false, isAdmin: false});

  // 로그인 체크
  const loginCheck = async (isAuthPage = false) => {
    // 쿠키에 access token (JWT) 가 있는지 꺼내본다.
    const accessToken = Cookies.get('accessToken');
    console.log(`accessToken: ${accessToken}`);

    let response;
    let data;

    // JWT 이 없다면
    if(!accessToken){
      console.log('쿠키에 JWT(accessToken) 이 없음');
      logoutSetting();
      return;
    }

    // JWT 가 없는데, 인증이 필요한 페이지라면? -> 로그인 페이지로 가기
    if(!accessToken && isAuthPage){
      navigate('/login');
    }

    // JWT 토큰이 있다면?
    console.log('쿠키에 JWT(accessToken) 이 저장되어 있음');
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try{
      response = await auth.userInfo();
    } catch(error){
      console.error(`error: ${error}`);
      console.log(`status: ${response.status}`);
      return;
    }

    // 응답실패시 
    if(!response) return;

    // user 정보 획득 성공
    console.log('JWT (accessToken) 토큰으로 사용자 인증 정보 요청 성공');

    data = response.data;
    console.log(`data: ${data}`);

    // 인증실패
    if(data === 'UNAUTHORIZED' || response.status === 401){
      console.log('JWT(accessToken) 이 만료되었거나 인증에 실패했습니다.');
      return
    }

    // 인증 성공!
    loginSetting(data, accessToken);

  };
  useEffect(()=>{loginCheck()}, []);  // 최초에 loginCheck 실행

  // 로그인 요청
  const login = async (username, password, rememberId) => {
    console.log(`
      로그인 요청
      login(username:${username}, password:${password}, rememberId:${rememberId});
      `);

    // username 저장
    if(rememberId) Cookies.set('rememberId', username);
    else Cookies.remove('rememberId');

    try{
      // 요청보내기 전에 요청 내용을 콘솔에 출력
      console.log('로그인 요청 전송:', { username, password });

      const response = await auth.login(username, password);
      const { data, status, headers} = response;

      console.log('응답 상태:', status);
      console.log('응답 헤더:', headers);
      console.log('응답 바디:', data);

      const authorization = headers.authorization;
      // const accessToken = authorization.replace("Bearer ", "");  // 발급받은 JWT 추출

      if (!authorization) {
        throw new Error('헤더 없어요');
      }
      const accessToken = authorization.replace("Bearer ", "");  // 발급받은 JWT 추출

      console.log(`
        -- login 요청응답 --
          data : ${data}
          status : ${status}
          headers : ${headers}
          jwt : ${accessToken}
        `);

      // 로그인 성공
      if (status === 200) {
        Cookies.set("accessToken", accessToken);

        // 로그인 ➡ 로그인 체크 ➡ 로그인 세팅
        loginCheck();

        // 성공 팝업후 페이지 이동 -> "/"
        Swal.alert("로그인 성공", "메인화면으로 이동", "success", () => { navigate("/")})
      }


    } catch(error){
      console.log(`로그인 error: ${error}`);
      Swal.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.', 'error');
    }
  };

  const kakaoLogin = async (code) => {
    console.log("kakaoLogin 시작");
    try {
        const response = await api.post(`${SERVER_HOST}/oauth2/kakao/callback`, { code });
        console.log("kakaoLogin API 호출 완료");
        
        const { accessToken, user } = response.data;
        Cookies.set("accessToken", accessToken);
        console.log("쿠키에 저장된 accessToken:", Cookies.get("accessToken"));

        loginSetting(user, accessToken);
        await Swal.fire("카카오 로그인 성공", "메인화면으로 이동", "success");
        navigate("/");
    } catch (error) {
        await Swal.fire('카카오 로그인 실패', '로그인에 실패했습니다.', 'error');
    }
};

  // 로그아웃
  const logout = (force = false) => {
    
    // confirm 없이 강제 로그아웃.
    if(force){
      logoutSetting();  // 로그아웃 세팅

      // 페이이 지동 -> "/"
      navigate("/");
      return;
    }

    Swal.confirm("로그아웃 하시겠습니까", "로그아웃을 진행합니다", "warning", 
      (result) => {
        if(result.isConfirmed){
          logoutSetting();  // 로그아웃 세팅
          navigate("/");
        } 
      }
    );

  };

  // 로그인 세팅
  const loginSetting = (userData, accessToken) => {
    const {userId, userName, nickName, email, regDate, reliability, role} = userData;

    console.log(`
    loginSetting() 
       userId : ${userId}
       userName : ${userName}
       nickName : ${nickName}
       email : ${email}
       regDate : ${regDate}
       reliability : ${reliability}
       role : ${role}
    `);

    // JWT 토큰 을 header 저장
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // 로그인 여부
    if (!isLogin) {
      setIsLogin(true);
      console.log(isLogin);
    }

    // 유저 정보 세팅
    const updatedUserInfo = {userId, userName, nickName, email, regDate, reliability, role}
    if (JSON.stringify(userInfo) !== JSON.stringify(updatedUserInfo)) {
      setUserInfo(updatedUserInfo);
    }

    // 권한정보 세팅
    const updatedRoles = {isUser: false, isAdmin: false};
    role.split(',').forEach((role) => {
      role === 'ROLE_USER' && (updatedRoles.isUser = true);
      role === 'ROLE_ADMIN' && (updatedRoles.isAdmin = true);
    });
    if (JSON.stringify(roles) !== JSON.stringify(updatedRoles)) {
      setRoles(updatedRoles);
    }

    // 쿠키에 accessToken 저장
    Cookies.set("accessToken", accessToken);
    console.log("loginsetting에서 찍어봅니다. 쿠키에 저장된 accessToken:", Cookies.get("accessToken"));

    // 새로고침시 Context로 리로딩
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    localStorage.setItem("roles", JSON.stringify(updatedRoles));

    console.log("loginSetting에서 로컬 스토리지에 저장된 isLogin:", localStorage.getItem("isLogin"));
    console.log("loginSetting에서 로컬 스토리지에 저장된 userInfo:", localStorage.getItem("userInfo"));
    console.log("loginSetting에서 로컬 스토리지에 저장된 roles:", localStorage.getItem("roles"));
  };

  // 로그아웃 세팅
  const logoutSetting = () => {
    // 상태 비우기
    setIsLogin(false);
    setUserInfo(null);
    setRoles(null);
    // 쿠키 지우기
    Cookies.remove('accessToken');
    // axios 의 default  header 도 삭제
    api.defaults.headers.common.Authorization = undefined;

    // 새로고침]
    // local storage 지우기
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("roles");
  };

  return (
    <LoginContext.Provider value={ { isLogin, userInfo, roles, loginCheck, login, logout, kakaoLogin }}>
        {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;