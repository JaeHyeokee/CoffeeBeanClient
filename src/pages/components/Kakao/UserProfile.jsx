import React, { useEffect, useState } from 'react';
import { SERVER_HOST } from '../../../apis/Api';
import axios from 'axios';
import { SERVER_HOST } from '../../../apis/Api';


const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            axios.get(`http://${SERVER_HOST}/api/user`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => {
                setUserInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // 에러 처리 (예: 로그아웃 또는 에러 메시지 표시)
            });
        }
    }, []);

    return (
        <div>
            {userInfo ? (
                <div>
                    <h1>{userInfo.name}님의 프로필</h1>
                    <p>Email: {userInfo.email}</p>
                    {/* 추가적인 사용자 정보 표시 */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;