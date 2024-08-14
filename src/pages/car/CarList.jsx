import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import CarItem from '../components/CarItem';
import styles from '../../css/car/CarList.module.css';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 20;
const PAGES_PER_GROUP = 10; // 한 번에 표시할 페이지 버튼 수

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { category, subcategory } = useParams();

    useEffect(() => {
        setLoading(true);
        const fetchCars = async () => {
            try {
                console.log(`Fetching cars for category: ${category}, subcategory: ${subcategory}`);
                const response = await axios.get(`http://localhost:8088/car/filter`, {
                    params: {
                        category1: category,
                        category2: subcategory
                    }
                });
                console.log('Response data:', response.data);
                if (Array.isArray(response.data)) {
                    setCars(response.data);
                    setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
                }
            } catch (error) {
                console.error('Error fetching car list', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [category, subcategory]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentItems = cars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const renderPagination = () => {
        const startPage = Math.floor((currentPage - 1) / PAGES_PER_GROUP) * PAGES_PER_GROUP + 1;
        const endPage = Math.min(startPage + PAGES_PER_GROUP - 1, totalPages);
        const pageButtons = [];

        if (startPage > 1) {
            pageButtons.push(
                <button
                    key="prev"
                    className={styles.pageButton}
                    onClick={() => handlePageChange(startPage - 1)}
                >
                    &laquo;
                </button>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            pageButtons.push(
                <button
                    key="next"
                    className={styles.pageButton}
                    onClick={() => handlePageChange(endPage + 1)}
                >
                    &raquo;
                </button>
            );
        }

        return pageButtons;
    };

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
                    {renderPagination()}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CarList;
