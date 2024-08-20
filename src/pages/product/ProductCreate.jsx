import React, { useState, useContext, useEffect } from 'react';
import '../../css/product/ProductCreate.module.css';
import Header from '../components/Header';
import price from '../../image/ProductPrice.png';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/product/ProductCreate.module.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Footer from '../components/Footer';
import * as Swal from '../../apis/alert'

const categories = {
    "패션의류": ["여성의류", "남성의류"],
    "모바일/태블릿": ["스마트폰", "태블릿PC", "케이스/거치대/보호필름", "배터리/충전기/케이블"],
    "가구/인테리어": ["침실가구", "거실가구", "주방가구", "기타가구"],
    "반려동물/취미": ["반려동물", "키덜트", "핸드메이드/DIY", "악기"],
    "티켓/쿠폰": ["티켓", "상품권/쿠폰"]
};

const subcategories = {
    "여성의류": ["티셔츠/캐주얼의류", "니트/스웨터/가디건", "정장/원피스", "블라우스/셔츠/남방", "조끼/베스트", "바지/팬츠/청바지", "스커트/치마", "자켓/코트", "패딩/야상/점퍼", "트레이닝복", "언더웨어/잠옷", "파티복/드레스/기타"],
    "남성의류": ["티셔츠/캐주얼의류", "니트/스웨터/가디건", "정장", "조끼/베스트", "셔츠/남방", "바지/팬츠/청바지", "자켓/코트", "패딩/야상/점퍼", "트레이닝복", "언더웨어/잠옷", "테마의상/기타"],
    "스마트폰": ["삼성", "애플", "LG", "기타 제조사"],
    "태블릿PC": ["삼성", "애플", "기타 제조사"],
    "케이스/거치대/보호필름": [],
    "배터리/충전기/케이블": [],
    "침실가구": ["침대/매트리스", "서랍장/옷장", "화장대/협탁/거울"],
    "거실가구": ["소파", "거실테이블/의자", "거실장/장식장"],
    "주방가구": ["식탁/식탁의자", "렌지대/수납장", "기타 주방가구"],
    "기타가구": [],
    "반려동물": ["강아지용품", "고양이용품", "관상어용품", "기타반려동물 용품"],
    "키덜트": ["피규어/브릭", "프라모델", "레고/조립/블록", "무선조종/드론/헬리캠"],
    "핸드메이드/DIY": ["자수/뜨개질", "뷰티/아로마/캔들", "아트북/스크랩북", "DIY/공예"],
    "악기": ["건반악기", "현악기", "관악기/타악기"],
    "티켓": ["콘서트", "스포츠", "뮤지컬/연극/클래식"],
    "상품권/쿠폰": ["백화점/마트/편의점", "영화/문화/게임", "외식/주유"]
};

const ProductCreate = () => {

    const { isLogin, roles, userInfo } = useContext(LoginContext);
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        dealingStatus: "판매중",
        status: "중고",         
        dealingType: [],
        desiredArea: "",
        category1: "",
        category2: "",
        category3: "",
        files: []
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [subsubCategoryOptions, setSubSubCategoryOptions] = useState([]);

    //유효성 검사
    const [errors, setErrors] = useState({
        name: "",
        description: "",
        price: "",
        dealingType: "",
        desiredArea: "",
        category1: "",
        category2: "",
        files: []
    });

    const [isSubmitted, setIsSubmitted] = useState(false)

    const validateForm = () => {
        let formIsValid = true;
        const newErrors = {
            name: "",
            description: "",
            price: "",
            dealingType: "",
            desiredArea: "",
            category1: "",
            category2: "",
            files: []
        };

        if (!product.name) {
            newErrors.name = "상품명을 입력해주세요.";
            formIsValid = false;
        }

        if (!product.description) {
            newErrors.description = "상품 설명을 입력해주세요.";
            formIsValid = false;
        }

        if (!product.price) {
            newErrors.price = "상품 가격을 입력해주세요.";
            formIsValid = false;
        }

        if (product.dealingType.length === 0) {
            newErrors.dealingType = "거래 방법을 선택해주세요.";
            formIsValid = false;
        }

        if (!product.desiredArea) {
            newErrors.desiredArea = "희망 거래 지역을 입력해주세요.";
            formIsValid = false;
        }

        if (!product.category1) {
            newErrors.category1 = "카테고리1을 선택해주세요.";
            formIsValid = false;
        }

        if (!product.category2) {
            newErrors.category2 = "카테고리2를 선택해주세요.";
            formIsValid = false;
        }

        if (product.files.length === 0) {
            newErrors.files = "사진을 1장 이상 첨부해주세요.";
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };



    useEffect(() => {
        if (!userInfo || !roles) {
            console.error("사용자 정보 또는 권한 정보가 부족합니다.");
            Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") });
            return;
        }

        if (!isLogin || !roles.isUser) {
            Swal.alert("접근 권한이 없습니다.", "이전 화면으로 이동합니다.", "warning", () => { navigate(-1) });
            return;
        }
    }, [isLogin, roles, userInfo, navigate]);


    useEffect(() => {
        if (selectedCategory) {
            setSubCategoryOptions(categories[selectedCategory] || []);
            setProduct(prevProduct => ({
                ...prevProduct,
                category2: "",
                category3: ""
            }));
            setSelectedSubCategory("");
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedSubCategory) {
            setSubSubCategoryOptions(subcategories[selectedSubCategory] || []);
            setProduct(prevProduct => ({
                ...prevProduct,
                category3: ""
            }));
        }
    }, [selectedSubCategory]);

    if (!userInfo) return null;
    const userId = userInfo.userId;

    const changeValue = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'dealingType') {
                setProduct(prevProduct => ({
                    ...prevProduct,
                    dealingType: checked ? [...prevProduct.dealingType, value] : prevProduct.dealingType.filter(type => type !== value)
                }));
            }
        } else {
            setProduct(prevProduct => ({
                ...prevProduct,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file: file,
            filename: file.name,
            id: URL.createObjectURL(file)  // 이미지 미리보기 URL 생성
        }));

        setProduct(prevProduct => ({
            ...prevProduct,
            files: [...prevProduct.files, ...newFiles]
        }));
    };

    const handleFileRemove = (fileId) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            files: prevProduct.files.filter(file => file.id !== fileId)
        }));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setProduct(prevProduct => ({
            ...prevProduct,
            category1: e.target.value
        }));
    };

    const handleSubCategoryChange = (e) => {
        setSelectedSubCategory(e.target.value);
        setProduct(prevProduct => ({
            ...prevProduct,
            category2: e.target.value
        }));
    };

    const handleSubSubCategoryChange = (e) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            category3: e.target.value
        }));
    };

    const handleStatusChange = (status) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            status: status
        }));
    };

    const submitProduct = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!validateForm()) {
            return;
        }
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('dealingStatus', product.dealingStatus);
        formData.append('status', product.status);
        formData.append('desiredArea', product.desiredArea);
        formData.append('category1', product.category1);
        formData.append('category2', product.category2);
        formData.append('category3', product.category3);

        product.dealingType.forEach(type => {
            formData.append('dealingType', type);
        });

        product.files.forEach(file => {
            formData.append('files', file.file);
        });

        axios({
            method: 'post',
            url: `http://localhost:8088/product/write/${userId}`,
            headers: {
                "Content-Type": 'multipart/form-data',
            },
            data: formData,
        })
            .then(response => {
                const { data, status } = response;
                if (status === 201) {
                    console.log('상품 생성 성공:', data);
                    navigate(`/ProductDetail/${data}`);
                } else {
                    alert('등록 실패');
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error('서버 응답 오류:', error.response.data);
                } else if (error.request) {
                    console.error('요청 오류:', error.request);
                } else {
                    console.error('설정 오류:', error.message);
                }
            });
    };




    return (
        <>
            {
                isLogin && roles.isUser &&
                <>
                    <Header />
                    <Form onSubmit={submitProduct} className={styles.productCreateBody}>
                        <Form.Group className={styles.productImg} controlId="formBasicImage">
                            <Form.Label>이미지 첨부</Form.Label>
                            <div>
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className={styles.previewContainer}>
                                {product.files.map(file => (
                                    <div key={file.id} className={styles.previewImageContainer}>
                                        <img src={file.id} alt={`Preview ${file.name}`} className={styles.previewImage} />
                                        <Button variant="danger" onClick={() => handleFileRemove(file.id)}>X</Button>
                                    </div>
                                ))}
                            </div>
                            {isSubmitted && errors.files && <p className={styles.errorText}>{errors.files}</p>}
                        </Form.Group>

                        {/* 상품명, 카테고리, 가격 등 기존 폼 요소들 */}

                        <Form.Group className={styles.productName} controlId="formBasicTitle">
                            {/* <Form.Label>상품명</Form.Label> */}
                            <Form.Control
                                type='text'
                                value={product.name}
                                placeholder='상품명'
                                onChange={changeValue}
                                name='name'
                            />
                            {isSubmitted && errors.name && <p className={styles.errorText}>{errors.name}</p>}
                        </Form.Group>

                        <Form.Group className={styles.productCategory} controlId="formBasicCategory1">
                            <div>
                                <Form.Label>카테고리1</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={product.category1}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">카테고리 선택</option>
                                    {Object.keys(categories).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </Form.Control>
                                {isSubmitted && errors.category1 && <p className={styles.errorText}>{errors.category1}</p>}
                            </div>

                            <div>
                                <Form.Label>카테고리2</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={product.category2}
                                    onChange={handleSubCategoryChange}
                                    disabled={!selectedCategory}
                                >
                                    <option value="">카테고리 선택</option>
                                    {subCategoryOptions.map(subCategory => (
                                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                                    ))}
                                </Form.Control>
                                {isSubmitted && errors.category2 && <p className={styles.errorText}>{errors.category2}</p>}
                            </div>

                            <div>
                                <Form.Label>카테고리3</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={product.category3}
                                    onChange={handleSubSubCategoryChange}
                                    disabled={!selectedSubCategory}
                                >
                                    <option value="">카테고리 선택</option>
                                    {subsubCategoryOptions.map(subCategory => (
                                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                                    ))}
                                </Form.Control>
                            </div>
                        </Form.Group>

                        <Form.Group className={styles.productPrice} controlId="formBasicPrice">
                            {/* <Form.Label>가격</Form.Label> */}
                            <img src={price} alt='가격 아이콘' />
                            <Form.Control
                                type='number'
                                placeholder='가격'
                                value={product.price}
                                onChange={changeValue}
                                className={styles.productInputPrice}
                                name='price'
                            />
                            {isSubmitted && errors.price && <p className={styles.errorText}>{errors.price}</p>}
                        </Form.Group>

                        <Form.Group className={styles.productDesiredArea} controlId="formBasicDesiredArea">
                            {/* <Form.Label>거래희망지역</Form.Label> */}
                            <Form.Control
                                type='text'
                                placeholder='거래희망지역'
                                value={product.desiredArea}
                                onChange={changeValue}
                                name='desiredArea'
                            />
                            {isSubmitted && errors.desiredArea && <p className={styles.errorText}>{errors.desiredArea}</p>}
                        </Form.Group>

                        <Form.Group className={styles.productInfo} controlId="formBasicDescription">
                            {/* <Form.Label>상품 설명</Form.Label> */}
                            <Form.Control
                                as='textarea'
                                placeholder="상품 설명"
                                value={product.description}
                                onChange={changeValue}
                                className={styles.productInputInfo}
                                name='description'
                            />
                            <Form.Label>0/1000</Form.Label>
                            {isSubmitted && errors.description && <p className={styles.errorText}>{errors.description}</p>}
                        </Form.Group>

                        <Form.Group className={styles.statusTitle} controlId="formBasicDescription">
                            <div className={styles.statusTitle}>상품상태</div>
                            <div className={styles.statusButtonGroup}>
                                <button
                                    type="button"
                                    className={`${styles.statusButton} ${product.status === '새상품' ? styles.selected : ''}`}
                                    onClick={() => handleStatusChange('새상품')}
                                >
                                    새상품
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.statusButton} ${product.status === '중고' ? styles.selected : ''}`}
                                    onClick={() => handleStatusChange('중고')}
                                >
                                    중고
                                </button>
                            </div>
                            {isSubmitted && errors.dealingStatus && <p className={styles.errorText}>{errors.dealingStatus}</p>}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>거래 방법</Form.Label>
                            <div className={styles.dealingTypeGroup}>
                                <input
                                    type="checkbox"
                                    id="dealing-type-direct"
                                    name="dealingType"
                                    value="직거래"
                                    checked={product.dealingType.includes("직거래")}
                                    onChange={changeValue}
                                    className={styles.customCheckbox}
                                />
                                <label htmlFor="dealing-type-direct" className={styles.customCheckboxLabel}>
                                    <span className={styles.customCheckboxText}>직거래</span>
                                </label>

                                <input
                                    type="checkbox"
                                    id="dealing-type-shipping"
                                    name="dealingType"
                                    value="배송"
                                    checked={product.dealingType.includes("배송")}
                                    onChange={changeValue}
                                    className={styles.customCheckbox}
                                />
                                <label htmlFor="dealing-type-shipping" className={styles.customCheckboxLabel}>
                                    <span className={styles.customCheckboxText}>배송</span>
                                </label>
                            </div>
                            {isSubmitted && errors.dealingType && <p className={styles.errorText}>{errors.dealingType}</p>}
                        </Form.Group>

                        <button className={styles.registerButton} type='submit'>등록하기</button>
                    </Form>
                    <Footer />
                </>
            }
        </>
    );
};

export default ProductCreate;
