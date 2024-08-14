import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import CarItem from '../components/CarItem';
import styles from '../../css/car/CarList.module.css';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 20;

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { category, subcategory } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8088/car/list')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCars(response.data);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching car list', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (Array.isArray(cars)) {
            const filtered = cars.filter(car => {
                return (
                    (category ? car.category1 === category : true) &&
                    (subcategory ? car.category2 === subcategory : true)
                );
            });
            setFilteredCars(filtered);
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
        }
    }, [cars, category, subcategory]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentItems = filteredCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <>
            <Header />
            <div className={styles.carListBody}>
                <div className={styles.searchResult}>검색결과</div>

                <table className={styles.categoryContainer}>
                    <tbody>
                        {/* 필터 및 검색 관련 내용 */}
                    </tbody>
                </table>

                <div className={styles.carList}>
                    {loading ? (
                        <p>로딩 중...</p>
                    ) : (
                        currentItems.length > 0 ? (
                            currentItems.map(car => (
                                <CarItem key={car.id} car={car} />
                            ))
                        ) : (
                            <p>해당 카테고리의 차량이 없습니다.</p>
                        )
                    )}
                </div>

                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CarList;
