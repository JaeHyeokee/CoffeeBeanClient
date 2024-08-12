import React, { useContext, useEffect } from 'react';
import '../../css/product/ProductCreate.css'
import Header from '../components/Header';
import attachment from '../../image/Attachment.png'
import price from '../../image/ProductPrice.png'
import check from '../../image/Uncheck.png'
import { Link, useNavigate } from 'react-router-dom';
import Category from '../components/Category';
import { LoginContext } from '../../contexts/LoginContextProvider';
import * as Swal from '../../apis/alert';


const ProductCreate = () => {

    // const { isLogin, roles } = useContext(LoginContext);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isLogin) {
    //         Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") })
    //         return;
    //     }

    //     console.log(`/member : ${roles}`);
    // }, []);

    return (
        <>
            <Header />
            <div className='page-container'>
                <div className='productcreate-body'>

                    <button className='add-attachment'>
                        <img src={attachment} alt='첨부파일' />
                        <h4>추가하기</h4>
                    </button>

                    <div className='product-name'>
                        <input type='text' className='product-name-input' placeholder='상품명' />
                    </div>

                    <Category />

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