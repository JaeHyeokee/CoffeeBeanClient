import React, { useState } from 'react';
import { checkEmail, sendEmail, verifyCode } from '../../apis/Auth';
import * as Swal from '../../apis/Alert';
import { SERVER_HOST } from '../../apis/Api';

const JoinForm = ({ join }) => {

  const KAKAO_CLIENT_ID = 'YOUR_KAKAO_CLIENT_ID';  // 카카오에서 발급받은 앱의 REST API 키
  const REDIRECT_URI = `http://${SERVER_HOST}/oauth/callback/kakao`;  // 카카오에서 설정한 리다이렉트 URI


  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

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

    join({ userName, password, nickName, email, verifyCode });
  }

  // 이메일 인증 코드 발송 
  const sendVerificationCode = async () => {
    try {
      // 이메일 중복검사 실시
      const checkResponse = await checkEmail(email);
      console.log('이메일 상태값은 :'+ checkResponse.status);
      if (checkResponse.status === 409) {
        Swal.alert('이 이메일은 사용중입니다.');
        return;
      } 

      const response = await sendEmail(email);
      if (response.status === 200) {
        setEmailSent(true);
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

    // 이메일 인증 코드 검증
    const handleVerifyCode = async () => {
      const verifyCodeValue = document.getElementById('verifyCode').value;

      console.log('이메일 :', email , 'code : ', verifyCodeValue);
      try {
        const response = await verifyCode(email, verifyCodeValue);
        console.log('response는 ' + response.data);
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

    return (
      <div className="form">
        <h2 className="login-title">회원가입</h2>

        <form className="login-form" onSubmit={(e) => onJoin(e)}>
          {/* 유저 이름 */}
          <div>
            <label htmlFor="userName">ID</label>
            <input
              id="userName"
              type="text"
              placeholder="userName"
              name="userName"
              autoComplete="userName"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickName">nickname</label>
            <input
              id="nickName"
              type="text"
              placeholder="nickName"
              name="nickName"
              autoComplete="nickName"
              required
            />
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email">email</label>
            <input
              id="email"
              type="email"
              placeholder="email"
              name="email"
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" onClick={sendVerificationCode}>인증번호 발송</button>
          </div>

          {/* 인증코드 입력 */}
          {emailSent && (
            <div>
              <label htmlFor="verifyCode">Verify Code</label>
              <input
                id="verifyCode"
                type="text"
                placeholder="verifyCode"
                name="verifyCode"
                required
              />
              <button onClick={handleVerifyCode}>인증 확인</button>
            </div>
          )}




          <button className="btn btn--form btn-login" type="submit">
            Join
          </button>


        </form>
      </div>
    );
  };

  export default JoinForm;