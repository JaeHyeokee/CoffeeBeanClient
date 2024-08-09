import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../../css/car/CarList.css';

const CarList = () => {
    const { category, subcategory } = useParams(); 

    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);

    useEffect(() => {
        const fetchCars = () => {
            const data = [
                { id: 1, name: '제네시스 G80', category: '국산차', subcategory: '제네시스' },
                { id: 2, name: '현대 소나타', category: '국산차', subcategory: '현대' },
                { id: 3, name: '벤츠 C-Class', category: '수입차', subcategory: '벤츠' },
                { id: 4, name: 'BMW 320i', category: '수입차', subcategory: 'BMW' }
            ];
            setCars(data);
        };
        fetchCars();
    }, []);

    useEffect(() => {
        const result = cars.filter(car =>
            (!category || car.category === category) &&
            (!subcategory || car.subcategory === subcategory)
        );
        setFilteredCars(result);
    }, [category, subcategory, cars]);

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
                    {filteredCars.length > 0 ? (
                        filteredCars.map(car => (
                            <div key={car.id} className='car-item'>
                                <p>{car.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>해당 카테고리 및 서브카테고리에 맞는 자동차가 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default CarList;
