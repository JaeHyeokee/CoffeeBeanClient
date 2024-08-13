import React, { useState, useContext, useEffect } from 'react';
import '../../css/product/ProductCreate.module.css'; // Updated import
import Header from '../components/Header';
import price from '../../image/ProductPrice.png';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/product/ProductCreate.module.css'; // Import CSS Module

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
        name: "",
        description: "",
        price: "",
        dealingStatus: "판매중",
        category1: "",
        category2: "",
        category3: "",
        status: "중고",
        dealingType: "직거래",
        desiredArea: ""
    });

    const changeValue = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'radio') {
            setProduct({
                ...product,
                [name]: value
            });
        } else if (type === 'checkbox') {
            setProduct(prevProduct => ({
                ...prevProduct,
                [name]: checked ? value : ""
            }));
        } else {
            setProduct({
                ...product,
                [name]: value,
            });
        }
    };

    const submitProduct = (e) => {
        e.preventDefault();

        axios({
            method: 'post',
            url: 'http://localhost:8088/product/write/1',
            headers: {
                "Content-Type": 'application/json',
            },
            data: JSON.stringify(product),
        })
        .then(response => {
            const { data, status } = response;
            if (status === 201) {
                console.log('상품생성', data);
                navigate(`/product/ProductDetail/${data.id}`);
            } else {
                alert('등록 실패-');
            }
        });
    };

    return (
        <>
        <Header />
            <Form onSubmit={submitProduct}>
                <div className={styles.productcreateBody}>
                    <Form.Group className={styles.productName} controlId="formBasicTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type='text' value={product.name} placeholder='상품명' onChange={changeValue} name='name' />
                    </Form.Group>

                    <Form.Group className={styles.productPrice} controlId="formBasicPrice">
                        <Form.Label>Price</Form.Label>
                        <img src={price} alt='' />
                        <Form.Control type='text' placeholder='가격' value={product.price} onChange={changeValue} className={styles.productInputPrice} name='price' />
                    </Form.Group>

                    <Form.Group className={styles.productInfo} controlId="formBasicDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='textarea' placeholder="상품 설명" value={product.description} onChange={changeValue} className={styles.productInputInfo} name='description' />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>판매 상태</Form.Label>
                        <Form.Check
                            type="radio"
                            id="status-sell"
                            name="dealingStatus"
                            value="판매중"
                            checked={product.dealingStatus === "판매중"}
                            onChange={changeValue}
                            label="판매중"
                        />
                        <Form.Check
                            type="radio"
                            id="status-sold-out"
                            name="dealingStatus"
                            value="품절"
                            checked={product.dealingStatus === "품절"}
                            onChange={changeValue}
                            label="품절"
                        />
                    </Form.Group>

                    {/* status */}
                    <Form.Group>
                        <Form.Label>상품 상태</Form.Label>
                        <Form.Check
                            type="radio"
                            id="status-new"
                            name="status"
                            value="새상품"
                            checked={product.status === "새상품"}
                            onChange={changeValue}
                            label="새상품"
                        />
                        <Form.Check
                            type="radio"
                            id="status-used"
                            name="status"
                            value="중고"
                            checked={product.status === "중고"}
                            onChange={changeValue}
                            label="중고"
                        />
                    </Form.Group>

                    {/* dealingType */}
                    <Form.Group>
                        <Form.Label>거래 방식</Form.Label>
                        <Form.Check
                            type="checkbox"
                            id="dealing-type-direct"
                            name="dealingType"
                            value="직거래"
                            checked={product.dealingType.includes("직거래")}
                            onChange={changeValue}
                            label="직거래"
                        />
                        <Form.Check
                            type="checkbox"
                            id="dealing-type-shipping"
                            name="dealingType"
                            value="배송"
                            checked={product.dealingType.includes("배송")}
                            onChange={changeValue}
                            label="배송"
                        />
                    </Form.Group>

                    <Form.Group className={styles.productName} controlId="formBasicDesiredArea">
                        <Form.Label>거래희망지역</Form.Label>
                        <Form.Control type='text' placeholder='거래희망지역' onChange={changeValue} name='desiredArea' />
                    </Form.Group>

                    <div>
                        <Button className={styles.registerButton} type='submit'>등록하기</Button>
                    </div>

                </div>
            </Form>
        </>
    );
};

export default ProductCreate;
