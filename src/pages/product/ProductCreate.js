import React from 'react';
import '../../css/product/ProductCreate.css'
import Header from '../components/Header';
import attachment from '../../image/Attachment.png'
import price from '../../image/ProductPrice.png'
import check from '../../image/Uncheck.png'
import { Link } from 'react-router-dom';

const ProductCreate = () => {
    return (
        <>
        <Header/>
        <div className='page-container'>
        <div className='productcreate-body'>

            <button className='add-attachment'>
                <img src={attachment} alt='첨부파일'/>
                <h4>추가하기</h4>
            </button>

            <div className='product-name'>
                <input type='text' className='product-name-input' placeholder='상품명'/>
            </div>

            <div className='product-category'>
                <button className='product-category-button'>패션의류</button>
                <button className='product-category-button'>뷰티</button> 
                <button className='product-category-button'>노트북/PC</button>                  
                <button className='product-category-button'>도서/음반/문구</button>                  
                <button className='product-category-button'>레저/여행</button>                  
            </div>

            <div className='product-price'>
                <img src={price} alt='' />
                <input type='text' className='product-input-price' placeholder='가격' />
            </div>

            <div className="product-info">
                <textarea className="product-input-info" placeholder="상품 설명"></textarea>
            </div>

            <div className='product-status'>
                <p>상품상태</p>
                <button className='product-status-button1'>중고</button>
                <button className='product-status-button2'>새상품</button>
            </div>

            <div className='deal-way'>
                <p>거래방법</p>
                <button className='deal-way-button1'>
                    <img src={check} alt='' />택배거래</button>
                <button className='deal-way-button2'>
                    <img src={check} alt='' />직거래</button>
            </div>

            <div>
                <Link to='/ProductDetail/:id'>
                <button className='register-button'>등록하기</button>
                </Link>
            </div>

        </div>
        </div>

        </>
    );
};

export default ProductCreate;