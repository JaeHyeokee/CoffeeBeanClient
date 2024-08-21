import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import CarItem from '../components/CarItem';
import styles from '../../css/car/CarList.module.css';
import Footer from '../components/Footer';
import Soldout from '../../image/Soldout.png';
import UnSoldout from '../../image/UnSoldout.png';
import { SERVER_HOST } from '../../apis/Api';

const ITEMS_PER_PAGE = 20;
const PAGES_PER_GROUP = 10; // 한 번에 표시할 페이지 버튼 수

const CarList = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { category, subcategory } = useParams();
    const [carInfo, setCarInfo] = useState({  //현재 선택된 카테고리에 해당하는 차량들의 평균, 최소, 최대, 개수 저장
        averagePrice: 0.0,
        minPrice: 0.0,
        maxPrice: 0.0,
        carCount: 0    
    });
    const [minPriceFilter, setMinPriceFilter] = useState('');   //최소가격 필터 상태 저장 
    const [maxPriceFilter, setMaxPriceFilter] = useState('');   //최대가격 필터 상태 저장
    const [includeSoldOut, setIncludeSoldOut] = useState(false); //판매완료 상품 포함 상태 저장

    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get('keyword') || '';

    useEffect(() => {
        setLoading(true);
        const fetchCars = async () => {
            try {
                console.log(`Fetching cars for category: ${category}, subcategory: ${subcategory}`);
                
                let response;

                if(keyword !== '') {
                    response = await axios({
                        method: "get",
                        url: `http://${SERVER_HOST}/car/list/${keyword}`,
                    });
                } else {
                    response = await axios.get(`http://${SERVER_HOST}/car/filter`, {
                        params: {
                            category1: category,
                            category2: subcategory
                        }
                    });
                }

                console.log('Response data:', response.data);
                if (Array.isArray(response.data)) {
                    const carsExistPrice = response.data.filter(car => car.price > 0); // 가격이 0보다 큰 차량만 필터링

                    setCars(response.data); // 전체 차량을 상태에 저장
                    setFilteredCars(response.data); // 초기에는 모든 차량을 필터링된 상태로 설정
                    setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));

                    // 평균, 최저, 최고 가격 계산
                    if (carsExistPrice.length > 0) {
                        const totalPrices = carsExistPrice.reduce((total, car) => total + car.price, 0);
                        const averagePrice = totalPrices / carsExistPrice.length;
                        const minPrice = Math.min(...carsExistPrice.map(car => car.price));
                        const maxPrice = Math.max(...carsExistPrice.map(car => car.price));

                        setCarInfo({
                            averagePrice,
                            minPrice,
                            maxPrice,
                            carCount: carsExistPrice.length
                        });
                    } else {
                        setCarInfo({
                            averagePrice: 0.0,
                            minPrice: 0.0,
                            maxPrice: 0.0,
                            carCount: 0
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching car list', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [keyword, category, subcategory]);

    //사용자가 설정하는 가격 필터
    useEffect(() => {
        const minPrice = parseFloat(minPriceFilter) || 0;
        const maxPrice = parseFloat(maxPriceFilter) || Infinity;

        const filtered = cars.filter(car => {
            const carPrice = car.price;
            const isSoldOut = car.dealingStatus === '판매완료';

            return (
                (category ? car.category1 === category : true) &&
                (subcategory ? car.category2 === subcategory : true) &&
                (carPrice >= minPrice && carPrice <= maxPrice) &&
                (includeSoldOut || !isSoldOut)
            );
        });

        setFilteredCars(filtered);
        setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
        setCurrentPage(1); // 필터링 시 페이지를 1로 리셋
    }, [cars, minPriceFilter, maxPriceFilter, includeSoldOut, category, subcategory]);

    const handlePriceFilterClick = () => {
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 부드럽게 스크롤 이동
        });
    };

    const handleToggleSoldOut = () => {
        setIncludeSoldOut(prev => !prev);
    };

    const currentItems = filteredCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
            <Header/>
            <div className={styles.carListBody}>
                <div className={styles.searchResult}>검색결과</div>

                <table className={styles.categoryContainer}>
                    <tbody>
                        <tr>
                            <td className={styles.category1}>
                                <h2>카테고리</h2>
                            </td>
                            <td>
                                <div className={styles.category1Result}>
                                    <p>전체</p>
                                    <p>&gt; {category}</p>
                                    {subcategory && <p>&gt; {subcategory}</p>}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className={styles.category2}>
                                <h2>가격</h2>
                            </td>
                            <td>
                                <div className={styles.category2Result}>
                                    <input
                                        type='number'
                                        className={styles.productInputPrice}
                                        placeholder=' 최소가격'
                                        value={minPriceFilter}
                                        onChange={(e) => setMinPriceFilter(e.target.value)}
                                    /><p>만원</p>
                                    <p>~</p>
                                    <input
                                        type='number'
                                        className={styles.productInputPrice}
                                        placeholder=' 최대가격'
                                        value={maxPriceFilter}
                                        onChange={(e) => setMaxPriceFilter(e.target.value)}
                                    /><p>만원</p>
                                    <button
                                        className={styles.category2ResultButton}
                                        onClick={handlePriceFilterClick}
                                    >
                                        적용
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className={styles.category3}>
                                <h2>옵션</h2>
                            </td>
                            <td>
                                <div className={styles.category3Result}>
                                <button 
                                    className={styles.toggleButton}
                                    onClick={handleToggleSoldOut}
                                >
                                    <img 
                                        src={includeSoldOut ? Soldout : UnSoldout} 
                                        alt={includeSoldOut ? 'Exclude Sold Out' : 'Include Sold Out'} 
                                        className={styles.icon}
                                    />
                                    {includeSoldOut ? '판매완료 상품 제외' : '판매완료 상품 포함'}
                                </button>

                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className={styles.category4}>
                                <h2>선택한 필터</h2>
                            </td>
                            <td>
                                <div className={styles.category4Result}>위에 선택한 필터 검색 결과 뽑아내기</div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className={styles.price}>
                    <h4>현재 카테고리의 상품 가격 비교</h4>
                    <div className={styles.priceInfo}>
                        <p>평균 가격: {carInfo.averagePrice.toFixed(0)} 만원</p>
                        <p>최저 가격: {carInfo.minPrice.toFixed(0)} 만원</p>
                        <p>최고 가격: {carInfo.maxPrice.toFixed(0)} 만원</p>
                        <p>상품 수: {carInfo.carCount} 개</p>
                    </div>
                </div>

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
