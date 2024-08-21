import { useEffect, useContext, useRef } from "react";
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { useNavigate } from "react-router-dom";

const KakaoCallback = () => {
    const navigate = useNavigate();
    const { kakaoLogin } = useContext(LoginContext);
    const isCalledRef = useRef(false);  // useRef로 isCalled 상태를 관리

    useEffect(() => {
        const handleKakaoLogin = async () => {
            const code = new URL(window.location.href).searchParams.get("code");
            console.log("KakaoCallback useEffect 실행됨");
            console.log("현재 code 값:", code);
            console.log("isCalledRef.current 값:", isCalledRef.current);

            if (code && !isCalledRef.current) {
                isCalledRef.current = true;  // 첫 실행 시 바로 true로 설정하여 반복 방지
                try {
                    console.log("kakaoLogin 호출 시작");
                    await kakaoLogin(code);  // 비동기 함수 호출
                    console.log("kakaoLogin 호출 완료");
                    navigate('/');  // 예시: 로그인 후 홈으로 이동
                } catch (error) {
                    console.error("kakaoLogin failed:", error);
                }
            }
        };

        handleKakaoLogin();
    }, [kakaoLogin, navigate]);  // isCalledRef는 의존성 배열에 추가할 필요 없음

    return <div>로그인 중...</div>;
};

export default KakaoCallback;