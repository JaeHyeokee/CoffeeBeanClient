import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../../apis/auth';
import * as Swal from '../../apis/alert';
import JoinForm from '../components/JoinForm';

const Join = () => {

    const navigate = useNavigate();

    const join = async (form) => {
        console.log(`join()`, form);

        let response;
        try {
            response = await auth.join(form);
        } catch (error) {
            console.log(`${error}`);
            console.log(`회원 가입 요청중 에러가 발생했습니다`);
            return;
        }

        const { data, status } = response;
        console.log(`data : ${data}`);
        console.log(`status : ${status}`);

        if (status === 200) {
            console.log(`회원가입 성공!`);
            Swal.alert("회원가입 성공", "메인 화면으로 이동합니다.", "success", () => { navigate("/login") })
        }
        else {
            console.log(`회원가입 실패!`);
            Swal.alert("회원가입 실패", "회원가입에 실패하였습니다.", "error")
        }
    }
    return (
        <div className='container'>
            <JoinForm join={join} />
        </div>
    );
};

export default Join;