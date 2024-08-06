import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../../css/product/ProductList.css'

const ProductList = () => {

    const { category, subcategory, subsubcategory } = useParams();
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
            </div>
        </>
    );
};

export default ProductList;