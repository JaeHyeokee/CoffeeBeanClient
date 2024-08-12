import React, { useContext, useEffect } from 'react';
import React, { useState } from 'react';
import '../../css/product/ProductCreate.css'
import Header from '../components/Header';
import price from '../../image/ProductPrice.png'
import { Form, Link, Navigate, useNavigate } from 'react-router-dom';
import Category from '../components/Category';
import axios from 'axios';

const ProductCreate = () => {

    const navigate = useNavigate();

    // const { isLogin, roles } = useContext(LoginContext);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isLogin) {
    //         Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") })
    //         return;
    //     }

    //     console.log(`/member : ${roles}`);
    // }, []);

    const [product, setProduct] = useState({
        name:"",
        description:"",
        price:"",
        dealingStatus:"",
        category1:"",
        category2:"",
        category3:"",
        status:"",
        dealingType:"",
        desiredArea:""
    })

    const changeValue = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
        });
    };

    const submitProduct = (e) => {
        e.preventDefault();

        axios({
            method:'post',
            url:'http://localhost8088/product/write/2',
            headers: {
                "Content-Type": 'application/json',
            },
            data: JSON.stringify(product),
        })
        .then(response => {
            const {data, status, statusText} = response;
            if(status === 201){
                console.log('상품생성', data);
                navigate(`/product/detail/${data.id}`)
            }else{
                alert ('등록 실패-')
            }
        })
    };
 
    return (
        <>
        <Header/>
      {/*   <Form onSubmit={submitProduct}>
        <div className='productcreate-body'>

                    <button className='add-attachment'>
                        <img src={attachment} alt='첨부파일' />
                        <h4>추가하기</h4>
                    </button>

            <Form.Group className='product-name' controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control type='text' placeholder='상품명' onChange={changeValue} name='name'/>
            </Form.Group>

            <Category/>            

            <Form.Group className='product-price' controlId="formBasicPrice">
                <Form.Label>Price</Form.Label>
                <img src={price} alt='' />
                <Form.Control type='text' placeholder='가격' onChange={changeValue} className='product-input-price' name='price'/>
            </Form.Group>

            <Form.Group className="product-info" controlId="formBasicdescription">
                <Form.Control type='textarea' placeholder="상품 설명" onChange={changeValue} className="product-input-info" name='description'/>
            </Form.Group>

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
        </Form> */}

        </>
    );
};

export default ProductCreate;