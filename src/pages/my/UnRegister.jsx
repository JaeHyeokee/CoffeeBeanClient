import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Uncheck from '../../image/FormUncheck.svg';
import Check from '../../image/FormCheck.svg';

const UnRegister = () => {
    const [checked, setChecked] = useState(false);

    return (
        <>
            <h1>회원 탈퇴</h1>
            <br/>
            <h3>탈퇴 사유를 알려주시면<br/>개선을 위해 노력하겠습니다</h3>
            <br/>
            <Form>
                <Form.Group className="">
                    <Form.Label><h5>다중 선택이 가능해요.</h5></Form.Label><br/>
                    <div>
                        <Form.Check name="gender" id="gender1" value="MALE" custom/>
                        <img src={checked ? Check : Uncheck} alt='Check Box'/>
                        <label htmlFor="사용 빈도가 낮고 개인정보 및 보안 우려">kkkkkkkkk</label>
                    </div>
                    <Form.Check label="비매너 사용자들로 인한 불편 (사기 등)" name="gender" id="gender2" value="FEMALE"/>
                    <Form.Check label="서비스 기능 불편 (상품등록/거래 등)" name="gender" id="gender2" value="FEMALE"/>
                    <Form.Check label="이벤트 등의 목적으로 한시 사용" name="gender" id="gender2" value="FEMALE"/>
                    <Form.Check label="기타" name="gender" id="gender2" value="FEMALE"/>
                </Form.Group>
            </Form>
        </>
    );
};

export default UnRegister;