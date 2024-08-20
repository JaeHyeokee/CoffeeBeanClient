import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import {Chart as ChartJs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, plugins} from 'chart.js'
import { Bar } from 'react-chartjs-2';
import styles from '../../css/admin/UserManagement.module.css';
import { SERVER_HOST } from '../../apis/Api';
ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserManagement = () => {

    //각 항목의 초기값 설정
    const [quitCount, setQuitCount] = useState({
        badManners: 0,  
        lowFrequency: 0,
        badService: 0, 
        eventUse:0,
        etc:0

    })

    useEffect(() => {
        axios.get(`http://${SERVER_HOST}/quit/list`)
        .then(response => {
            const data = response.data;
            console.log(data);
            //각 항목의 개수 Count
            const counts = data.reduce((acc, item) => {
                if (item.badManners === 1) acc.badManners += 1;
                    if (item.lowFrequency === 1) acc.lowFrequency += 1;
                    if (item.badService === 1) acc.badService += 1;
                    if (item.eventUse === 1) acc.eventUse += 1;
                    if (item.etc && item.etc.trim() !== '') acc.etc += 1;

                return acc;
            }, {badManners:0, lowFrequency:0, badService:0, eventUse:0, etc:0});

            setQuitCount(counts);
        })  
        .catch(error => {
            console.error('', error)
        });
    }, []);

    const chartData = {
        labels:['비매너 사용자', '이용 빈도 감소', '서비스 기능불편', '이벤트 등의 목적', '기타 사유'],
        datasets: [
            {
                label: "Count",
                data: [
                    quitCount.badManners,
                    quitCount.lowFrequency,
                    quitCount.badService,
                    quitCount.eventUse,
                    quitCount.etc
                ],
                backgroundColor: '#0dcc59ca'

            }
        ]
    }

    const chartOptions = {
        responsive: true,
        //차트에 추가할 수 있는 플러그인 (ex-title, legend)
        plugins: {
            legend: {   //차트의 범례
                position: 'top' //범례의 위치 상단 (bottom, right, left)
            },
            //차트의 제목
            title: {
                callback: {         //tooltip -> 사용자가 특정 그래프 위에 마우스를 올리면 나오는 팝업상자 ()
                    label: function(tooltipItem){
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                //해당 데이터의 레이블   //해당 데이터 항목의 실제값
                    }
                }
            }
        }
    }


    return (
        <>
        <div className={styles.usermanagementBody}>
        <p>회원탈퇴 사유 차트</p>
        <Bar data={chartData} options={chartOptions}/>
        </div>
        </>
    );
};

export default UserManagement;