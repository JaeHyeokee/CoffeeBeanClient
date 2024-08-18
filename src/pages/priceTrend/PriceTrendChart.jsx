import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';

// Chart.js 모듈 등록
ChartJS.register(Title, Tooltip, Legend, LinearScale, CategoryScale, PointElement, LineElement);

const PriceTrendChart = ({ category2 }) => {
    const [priceInfo, setPriceInfo] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8088/product/priceInfo', { params: { category2 } })
            .then(response => {
                console.log(response.data);
                setPriceInfo(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [category2]);

    if (!priceInfo) return <div>Loading...</div>;

    // Scatter 차트
    const data = {
        datasets: [
            {
                label: 'Price Distribution',                    
                data: priceInfo.prices.map((price, idx) => ({ x: idx + 1, y: price })),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    // 차트 옵션
    const options = {
        scales: {
            //x축
            x: {
                type: 'linear', //x가 숫자값을 가질때 연속적으로 표시
                position: 'bottom', //x축을 하단에 배치
                title: {
                    display: false // x축 레이블 숨기기
                },
                ticks: {
                    display: false // x축 눈금 숨기기
                }
            },
            //y축
            y: {
                beginAtZero: true,  //y축의 시작점 0
                title: {
                    display: true,
                    text: 'Price'
                }
            }
        },
        //차트 추가 기능
        plugins: {
            legend: {   //범례표시
                display: true, 
                position: 'top'
            },
            title: {
                display: true,
                text: `Price Distribution for ${category2}`
            }
        }
    };

    return (
        <div>
            <Scatter data={data} options={options} />
        </div>
    );
};


export default PriceTrendChart;
