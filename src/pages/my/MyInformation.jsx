import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Style from '../../css/my/MyInformation.module.css';
import Pencil from '../../image/Pencil.png';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { SERVER_HOST } from '../../apis/Api';
import axios from 'axios';
import * as Swal from '../../apis/Alert';

const MyInformation = () => {

    const { userInfo } = useContext(LoginContext);
    const userId = userInfo.userId;
    const [file, setFile] = useState(null);
    const [profileImg, setProfileImg] = useState(null); // 프로필 이미지 상태
    const defaultProfileImg = 'https://img2.joongna.com/common/Profile/Default/profile_f.png'; // 기본 이미지 URL

    console.log("userid : " + userId);

    useEffect(() => {
        // 프로필 이미지 불러오기
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/user/profile/${userId}`);
                const imageUrl = response.data;
                setProfileImg(imageUrl);
            } catch (error) {
                console.error('Failed to fetch profile image:', error);
                // 이미지가 없거나 에러가 발생하면 기본 이미지로 설정
                setProfileImg(defaultProfileImg);
            }
        };

        fetchProfileImage();
    }, [userId]);

    // 프로필 변경
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImg(imageUrl); // 선택된 파일을 미리보기 이미지로 설정
        }
    };

    // 프로필 등록
    const handleImageUpload = async () => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post(`http://${SERVER_HOST}/user/profileUpload/${userId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Profile image uploaded successfully:', response.data);
                Swal.alert('프로필 이미지가 성공적으로 저장되었습니다.');
            } catch (error) {
                console.error('Failed to upload profile image:', error);
                Swal.alert('프로필 이미지 업로드에 실패했습니다.');
            }
        }
    };

    // 프로필 삭제
    const handleImageDelete = async () => {
        try {
            const response = await axios.delete(`http://${SERVER_HOST}/user/profile/${userId}`);
            console.log('Profile image deleted successfully:', response.data);
            setProfileImg(defaultProfileImg); // 이미지 삭제 후 기본 이미지로 변경
            Swal.alert('프로필 이미지가 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('Failed to delete profile image:', error);
            Swal.alert('프로필 이미지 삭제에 실패했습니다.');
        }
    };

    return (
        <>
            <h1>내 정보 관리</h1>
            <Form>
                <Form.Group className={Style.profileImgGroup}>
                    <div className={Style.profileImgFrame}>
                        <img className={Style.profileImg} src={profileImg} alt='Profile' />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="fileInput"
                            onChange={handleImageChange}  // 이미지 변경 이벤트 핸들러
                        />
                        <Button
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <img className={Style.imgUpdateBtnImg} src={Pencil} alt='Edit' />
                        </Button>
                    </div>
                    <div>
                        <Button onClick={handleImageUpload} className={Style.profileSave} >
                            프로필 이미지 저장
                        </Button>
                        <Button onClick={handleImageDelete} className={Style.profileSave} >
                            프로필 이미지 삭제
                        </Button>
                    </div>

                </Form.Group>

                {/* ------------------------------------------------------- */}

                <Form.Group>
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control variant='success' />
                </Form.Group>
                <Form.Group>
                    <Form.Label>한 줄 소개</Form.Label>
                    <Form.Control />
                </Form.Group>
                <Form.Group>
                    <Form.Label>이름</Form.Label>
                    <Form.Control />
                </Form.Group>
                <Form.Group>
                    <Form.Label>이메일</Form.Label>
                    <Form.Control />
                </Form.Group>
                
            </Form>
        </>
    );
};

export default MyInformation;