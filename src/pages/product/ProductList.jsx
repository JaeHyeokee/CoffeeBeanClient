import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductItem from '../components/ProductItem';
import Footer from '../components/Footer';
import styles from '../../css/product/ProductList.module.css';
import PriceTrendChart from '../priceTrend/PriceTrendChart';

const ITEMS_PER_PAGE = 20;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceInfo, setPriceInfo] = useState({
        averagePrice: 0.0,
        minPrice: 0.0,
        maxPrice: 0.0,
        productCount: 0
    });
    const [minPriceFilter, setMinPriceFilter] = useState('');
    const [maxPriceFilter, setMaxPriceFilter] = useState('');

    const { category, subcategory, subsubcategory } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8088/product/category', {
                    params: {
                        category1: category || undefined,
                        category2: subcategory || undefined,
                        category3: subsubcategory || undefined,
                    }
                });
                console.log('상품 응답 데이터:', response.data);
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('상품 데이터 가져오기 실패:', error);
            } finally {
                setLoading(false);
            }
        };
    
        const fetchPriceInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8088/product/priceInfo', {
                    params: {
                        category1: category,
                        category2: subcategory,
                        category3: subsubcategory
                    }
                });
                setPriceInfo(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        
    
        fetchProducts();
        fetchPriceInfo();
    }, [category, subcategory, subsubcategory]);
    

    useEffect(() => {
        if (Array.isArray(products)) {
            const minPrice = parseFloat(minPriceFilter) || 0;
            const maxPrice = parseFloat(maxPriceFilter) || Infinity;
            const filtered = products.filter(product => {
                const productPrice = product.price;
                return (
                    (category ? product.category1 === category : true) &&
                    (subcategory ? product.category2 === subcategory : true) &&
                    (subsubcategory ? product.category3 === subsubcategory : true) &&
                    (productPrice >= minPrice && productPrice <= maxPrice)
                );
            });
            setFilteredProducts(filtered);
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
        }
    }, [products, category, subcategory, subsubcategory, minPriceFilter, maxPriceFilter]);

    const handlePriceFilterClick = () => {
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const currentItems = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <>
            <Header />
            <div className={styles.productlistBody}>
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
                                    {subsubcategory && <p>&gt; {subsubcategory}</p>}
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
                                    />
                                    <p>~</p>
                                    <input
                                        type='number'
                                        className={styles.productInputPrice}
                                        placeholder=' 최대가격'
                                        value={maxPriceFilter}
                                        onChange={(e) => setMaxPriceFilter(e.target.value)}
                                    />
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
                                <div className={styles.category3Result}>판매완료 상품 포함</div>
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

                <div className={styles.priceInfo}>
                    <h2>현재 페이지의 상품 가격을 비교해봤어요</h2>
                    <p>평균 가격: {priceInfo.averagePrice.toFixed(2)}</p>
                    <p>최저 가격: {priceInfo.minPrice.toFixed(2)}</p>
                    <p>최고 가격: {priceInfo.maxPrice.toFixed(2)}</p>
                    <p>상품 수: {priceInfo.productCount}</p>
                </div>

                <div>
                    <h1>분포도 - </h1>
                    <PriceTrendChart category1={category} category2={subcategory} category3={subsubcategory} />
                </div>

                <div className={styles.productList}>
                    {loading ? (
                        <p>로딩중...</p>
                    ) : (
                        filteredProducts.length > 0 ? (
                            currentItems.map(product => (
                                <ProductItem key={product.id} product={product} />
                            ))
                        ) : (
                            <p>해당 카테고리에 대한 제품이 없습니다.</p>
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
            <Footer />
        </>
    );
};

export default ProductList;
