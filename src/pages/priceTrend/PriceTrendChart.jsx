import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import axios from 'axios';
import { SERVER_HOST } from '../../apis/Api';
import { Chart as ChartJS, Title, Tooltip, Legend, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LinearScale, CategoryScale, PointElement, LineElement);

const PriceTrendChart = ({ category1, category2, category3 }) => {
    const [priceInfo, setPriceInfo] = useState(null);

    useEffect(() => {
        axios.get(`http://${SERVER_HOST}/product/priceInfo`, {
            params: { category1, category2, category3 }
        })
        .then(response => {
            console.log(response.data);
            setPriceInfo(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, [category1, category2, category3]);

    if (!priceInfo) return <div>Loading...</div>;

    // Scatter 차트 데이터
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
            // x축
            x: {
                type: 'linear', // x가 숫자값을 가질 때 연속적으로 표시
                position: 'bottom', // x축을 하단에 배치
                title: {
                    display: false // x축 레이블 숨기기
                },
                ticks: {
                    display: false // x축 눈금 숨기기
                }
            },
            // y축
            y: {
                beginAtZero: true,  // y축의 시작점 0
                title: {
                    display: true,
                    text: 'Price'
                }
            }
        },
        // 차트 추가 기능
        plugins: {
            legend: {   // 범례 표시
                display: true, 
                position: 'top'
            },
            title: {
                display: true,
                text: `Price Distribution for ${category2 || category3 || category1}`
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
