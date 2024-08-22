import React, { useContext, useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Style from '../../css/my/MyHome.module.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import axios from 'axios';
import { SERVER_HOST } from '../../apis/Api';
import * as Swal from '../../apis/Alert';

const MyHome = () => {
    const { userInfo } = useContext(LoginContext);
    const [profileImg, setProfileImg] = useState('https://img2.joongna.com/common/Profile/Default/profile_f.png'); // 기본 프로필 이미지
    const [progress, setProgress] = useState(0);
    const userId = userInfo.userId;
    const [userData, setUserData] = useState({
        introduction: ''
    });

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/user/profile/${userInfo.userId}`);
                const imageUrl = response.data;
                setProfileImg(imageUrl); // 서버에서 가져온 이미지 URL로 프로필 이미지 설정
            } catch (error) {
                console.error('Failed to fetch profile image:', error);
                // 이미지 불러오기 실패 시 기본 이미지 유지
            }
        };

        fetchProfileImage();
    }, [userInfo.userId]);

    // 사용자 데이터 불러오기
    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://${SERVER_HOST}/user/${userId}`);
            const user = response.data;
            setUserData({
                introduction: user.introduction || '',
            });
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            Swal.alert('사용자 정보를 불러오는데 실패했습니다.');
        }
    };

    useEffect(()=> {
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        const targetReliability = Number(userInfo.reliability) || 0;

        if (targetReliability < 0 || targetReliability > 1000) {
            console.error('Invalid reliability value');
            return;
        }

        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if(oldProgress >= targetReliability) {
                    clearInterval(interval);
                    return targetReliability;
                }
                return Math.min(oldProgress + 10, targetReliability);
            });
        }, 10);
        return () => clearInterval(interval);
    }, [userInfo.reliability]);

    return (
        <section className={Style.myHomeInfo}>
            <img className={Style.myHomeProfileImg} src={profileImg} alt='프로필' />
            <div className={Style.myHomeProfileContent}>
                <div>
                    <span className={Style.nickNamePrint}>{userInfo.userName}</span>
                    <p className={Style.oneLineIntro}>{userData.introduction || '안녕하세요!'}</p>
                </div>
                <div>
                    <div className={Style.trustIndexInfo}>
                        <div className={Style.myTrustIndex}>
                            <p className={Style.myTrustIndexLabel}>신뢰지수</p>
                            <p className={Style.myTrustIndexFigure}>{progress}</p>
                        </div>
                        <p className={Style.maxTrustIndex}>1,000</p>
                    </div>
                    <ProgressBar className={Style.trustIndexBar} now={progress / 10} />
                </div>
            </div>
        </section>
    );
};

export default MyHome;