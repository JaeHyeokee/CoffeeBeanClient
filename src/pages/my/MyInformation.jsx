import React from 'react';
import { Button, Form } from 'react-bootstrap';
import Style from '../../css/my/MyInformation.module.css';
import Pencil from '../../image/Pencil.png';

const MyInformation = () => {
    return (
        <>
            <h1>내 정보 관리</h1>
            <Form>
                <Form.Group className={Style.profileImgGroup}>
                    <div className={Style.profileImgFrame}>
                        <img className={Style.profileImg} src='https://img2.joongna.com/common/Profile/Default/profile_f.png' alt=''/>
                        <Button className={Style.imgUpdateBtn}><img className={Style.imgUpdateBtnImg} src={Pencil} alt=''/></Button>
                    </div>
                </Form.Group>
                <Form.Group>
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control variant='success'/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>한 줄 소개</Form.Label>
                    <Form.Control/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>이름</Form.Label>
                    <Form.Control/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>이메일</Form.Label>
                    <Form.Control/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>새 비밀번호</Form.Label>
                    <Form.Control/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>새 비밀번호 확인</Form.Label>
                    <Form.Control/>
                </Form.Group>
            </Form>
        </>
    );
};

export default MyInformation;