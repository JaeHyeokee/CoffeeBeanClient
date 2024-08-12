import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../../css/car/CarList.css';
import axios from 'axios';
import CarItem from '../components/CarItem';

const CarList = () => {
    const [cars, setCars] = useState([])
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const { category, subcategory } = useParams(); 

    useEffect(() => {
        axios.get('http://localhost:8088/car/list')
        .then(response => {
            console.log(response.data);
            if(Array.isArray(response.data)){
                setCars(response.data);
            }else {
                console.log('에러에ㅓ레어레ㅓㄹ에ㅓㄹ에ㅓㄹ에ㅓ레어레어레어레어레어렌에ㅓㄹ')
            }
            setLoading(false);
        })
    }, []);

    useEffect(() => {
        if(Array.isArray(cars)){
            const filterd = cars.filter(car => {
                return (
                    (category ? car.category1 === category : true) &&
                    (subcategory ? car.category2 === subcategory : true)
                );
            });
            setFilteredCars(filterd);
        }
    }, [ cars, category, subcategory]);

    return (
        <>
            <Header />
            <div className='carlist-body'>
                <div className='search-result'>검색결과</div>

                <table className='category-container'>
                    <tbody>
                        <tr>
                            <td className='category1'>
                                <h2>카테고리</h2>
                            </td>
                            <td>
                                <div className='category1-result'>
                                    <p>전체</p>
                                    {category && <p>&gt; {category}</p>}
                                    {subcategory && <p>&gt; {subcategory}</p>}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='category2'>
                                <h2>가격</h2>
                            </td>
                            <td>
                                <div className='category2-result'>
                                    <input type='text' className='car-input-price1' placeholder=' 최소가격' />
                                    <p>~</p>
                                    <input type='text' className='car-input-price2' placeholder=' 최대가격' />
                                    <button className='category2-result-button'>적용</button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='category3'>
                                <h2>옵션</h2>
                            </td>
                            <td>
                                <div className='category3-result'>판매완료 상품 포함</div>
                            </td>
                        </tr>

                        <tr>
                            <td className='category4'>
                                <h2>선택한 필터</h2>
                            </td>
                            <td>
                                <div className='category4-result'>
                                    <p>선택한 필터 검색 결과 뽑아내기</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='car-list'>
                    {loading ? (
                        <p>로딩~</p>
                    ) : (
                        filteredCars.length > 0 ? (
                            filteredCars.map(car => (
                                <CarItem key={car.id} car={car}/>
                            ))
                        ) : (
                            <p>해당 카테고리 존재하는 제품이 엄슴</p>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default CarList;
