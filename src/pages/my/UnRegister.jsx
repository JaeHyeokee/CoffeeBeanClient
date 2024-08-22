import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Uncheck from '../../image/FormUncheck.svg';
import Check from '../../image/FormCheck.svg';
import { LoginContext } from '../../contexts/LoginContextProvider';
import * as Swal from '../../apis/Alert';
import axios from 'axios';
import { SERVER_HOST } from '../../apis/Api';

const UnRegister = () => {
    const [checked, setChecked] = useState(false);
    const { userInfo, unRegister } = useContext(LoginContext);
    const userId = userInfo.userId;

    // 탈퇴 사유 상태
    const [quitReasons, setQuitReasons] = useState({
        badManners: 0,
        lowFrequency: 0,
        badService: 0,
        eventUse: 0,
        etc: ''
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setQuitReasons({
            ...quitReasons,
            [name]: checked ? 1 : 0  
        });
    };

    const handleEtcChange = (event) => {
        setQuitReasons({
            ...quitReasons,
            etc: event.target.value
        });
    };

    const Unregister = async () => {
        try {
            // 탈퇴 사유 데이터를 서버로 전송
            await axios.post(`http://${SERVER_HOST}/quit/write/${userId}`, quitReasons);

            // 회원 탈퇴 처리
            await axios.post(`http://${SERVER_HOST}/user/unRegister/${userId}`);

            Swal.alert("회원 탈퇴가 완료되었습니다.", "서비스를 이용해 주셔서 감사합니다.");
            unRegister();  // 로그아웃 처리
        } catch (error) {
            console.error("Failed to withdraw user:", error);
            Swal.alert("회원 탈퇴에 실패했습니다.");
        }
    };
    

    return (
        <>
            <h1>회원 탈퇴</h1>
            <br/>
            <h3>탈퇴 사유를 알려주시면<br/>개선을 위해 노력하겠습니다</h3>
            <br/>
            <Form>
            <Form.Group>
                    <Form.Label><h5>다중 선택이 가능해요.</h5></Form.Label><br />
                    <Form.Check
                        type="checkbox"
                        label="비매너 사용자들로 인한 불편 (사기 등)"
                        name="badManners"
                        checked={quitReasons.badManners}
                        onChange={handleCheckboxChange}
                    />
                    <Form.Check
                        type="checkbox"
                        label="사용 빈도가 낮음"
                        name="lowFrequency"
                        checked={quitReasons.lowFrequency}
                        onChange={handleCheckboxChange}
                    />
                    <Form.Check
                        type="checkbox"
                        label="서비스 기능 불편 (상품등록/거래 등)"
                        name="badService"
                        checked={quitReasons.badService}
                        onChange={handleCheckboxChange}
                    />
                    <Form.Check
                        type="checkbox"
                        label="이벤트 등의 목적으로 한시 사용"
                        name="eventUse"
                        checked={quitReasons.eventUse}
                        onChange={handleCheckboxChange}
                    />
                    <Form.Group>
                        <Form.Label>기타 사유</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={quitReasons.etc}
                            onChange={handleEtcChange}
                        />
                    </Form.Group>
                </Form.Group>
                
                    <Button onClick={Unregister}>
                        회원 탈퇴
                    </Button>
            </Form>
        </>
    );
}

export default UnRegister;