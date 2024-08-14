import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../../css/product/ProductList.css';
import ProductItem from '../components/ProductItem';
import Footer from '../components/Footer';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { category, subcategory, subsubcategory } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8088/product/list')
            .then(response => {
                console.log('응답데이터:' + response.data);
                if(Array.isArray(response.data)){
                    setProducts(response.data);
                }else {
                    console.log('에러에러에러에ㅓ레ㅓ레ㅓ레ㅓㅔㅓㅔ')
                }
                setLoading(false);
            })
            
    }, []);

    useEffect(() => {   //카테고리 제품 필터링
        if (Array.isArray(products)) {
            const filtered = products.filter(product => {
                return (
                    (category ? product.category1 === category : true) &&
                    (subcategory ? product.category2 === subcategory : true) &&
                    (subsubcategory ? product.category3 === subsubcategory : true)
                );
            });
            setFilteredProducts(filtered);
        }
    }, [products, category, subcategory, subsubcategory]);

    return (
        <>
            <Header />
            <div className='productlist-body'>
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
                                    <p>&gt; {category}</p> 
                                    {subcategory && <p>&gt; {subcategory}</p>}
                                    {subsubcategory && <p>&gt; {subsubcategory}</p>}
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td className='category2'>
                                <h2>가격</h2>
                            </td>
                            <td>
                                <div className='category2-result'>
                                    <input type='text' className='product-input-price1' placeholder=' 최소가격'/>
                                    <p>~</p>
                                    <input type='text' className='product-input-price2' placeholder=' 최대가격'/>
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
                                <div className='category4-result'>위에 선택한 필터 검색 결과 뽑아내기</div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='product-list'>
                    {loading ? (
                        <p>로.딩.중..</p>
                    ) : (
                        filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductItem key={product.id} product={product} />
                            ))
                        ) : (
                            <p>해당 카테고리에 대한 제품이 없습니다.</p>
                        )
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProductList;
