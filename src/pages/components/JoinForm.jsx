import React from 'react';

const JoinForm = ({join}) => {

const onJoin = (e) => {
    e.preventDefault();
    const userName = e.target.userName.value;
    const password = e.target.password.value;
    const nickName = e.target.nickName.value;
    const email = e.target.email.value;

    join({userName, password, nickName, email});
}

    return (
        <div className="form">
        <h2 className="login-title">회원가입</h2>
    
        <form className="login-form" onSubmit={(e) => onJoin(e)}>
            {/* 유저 이름 */}
          <div>
            <label htmlFor="userName">Username</label>
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
              type="text"
              placeholder="email"
              name="email"
              autoComplete="email"
              required
            />
          </div>

            {/* 이메일 인증번호
          <div>
            <label htmlFor="email">Password</label>
            <input
              id="email"
              type="email"
              placeholder="email"
              name="email"
              autoComplete="current-email"
              required
            />
          </div>  */}




         
          <button className="btn btn--form btn-login" type="submit">
            Join
          </button>
  
  
        </form>
      </div>
    );
};

export default JoinForm;