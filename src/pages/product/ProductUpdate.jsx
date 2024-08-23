import React, { useState, useContext, useEffect } from 'react';
import '../../css/product/ProductCreate.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../css/product/ProductCreate.module.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import price from '../../image/ProductPrice.png';
import { SERVER_HOST } from '../../apis/Api';

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

const ProductUpdate = () => {
    const navigate = useNavigate();

    const { userInfo } = useContext(LoginContext);
    const userId = userInfo.userId;

    const { id } = useParams(); //상품 Id

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
        fileList: [],
    });

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
    
        if (!Array.isArray(product.dealingType) || product.dealingType.length === 0) {
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
    
        if (!Array.isArray(product.fileList) || product.fileList.length === 0) {
            newErrors.files = "사진을 1장 이상 첨부해주세요.";
            formIsValid = false;
        }
    
        setErrors(newErrors);
        return formIsValid;
    };
    

    //삭제 할 파일
    const [deletedFileIds, setDeletedFileIds] = useState([]);

    //카테고리
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [subSubCategoryOptions, setSubSubCategoryOptions] = useState([]);

    useEffect(() => {
        axios.get(`http://${SERVER_HOST}/product/detail/${id}`)
            .then(response => {
                const productData = response.data;
                setProduct({
                    ...productData,
                    fileList: productData.fileList.map(file => ({
                        ...file,
                        fileId: file.attachmentId // 파일 ID가 포함되었는지 확인
                    })) || [],
                    dealingType: Array.isArray(productData.dealingType) ? productData.dealingType : []
                });
                setSelectedCategory(productData.category1);
                setSelectedSubCategory(productData.category2);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);


    //선택한 카테고리에 따라 서브카테고리 업데이트
    useEffect(() => {
        setSubCategoryOptions(categories[selectedCategory] || []);
        setSelectedSubCategory(product.category2);
    }, [selectedCategory]);

    //선택한 서브 카테고리에 따라 서브서브카테고리 업데이트
    useEffect(() => {
        setSubSubCategoryOptions(subcategories[selectedSubCategory] || []);
    }, [selectedSubCategory]);

    //입력값 변경
    const handleInputChange = (e) => {
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

    //카테고리1,2,3 변경하는 함수
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setProduct(prevProduct => ({ ...prevProduct, category1: category }));
    };

    const handleSubCategoryChange = (e) => {
        const subCategory = e.target.value;
        setSelectedSubCategory(subCategory);
        setProduct(prevProduct => ({ ...prevProduct, category2: subCategory }));
    };

    const handleSubSubCategoryChange = (e) => {
        setProduct(prevProduct => ({ ...prevProduct, category3: e.target.value }));
    };

    //파일
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const fileArray = Array.from(files).map(file => ({
                file,
                filename: file.name,
                source: URL.createObjectURL(file)
            }));
            setProduct(prevProduct => ({
                ...prevProduct,
                fileList: [...prevProduct.fileList, ...fileArray]
            }));
        }
    };

    //파일 삭제
    const handleFileRemove = (filename, fileId) => {
        setProduct(prevProduct => {
            const updatedFileList = prevProduct.fileList.filter(file => file.filename !== filename);

            console.log('업데이트된 파일 목록:', updatedFileList);

            return {
                ...prevProduct,
                fileList: updatedFileList
            };
        });

        if (fileId) {
            setDeletedFileIds(prevIds => [...prevIds, fileId]);
        } else {
            console.warn('파일 ID가 없음:', filename);
        }
    };


    //업데이트 제출
    const submitProduct = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();

        // 기존 파일 및 기타 데이터 추가
        Object.keys(product).forEach(key => {
            if (key === 'fileList') {
                product.fileList.forEach(file => {
                    formData.append('files', file.file);
                });
            } else if (key === 'dealingType') {
                product.dealingType.forEach(type => {
                    formData.append('dealingType', type);
                });
            } else {
                formData.append(key, product[key]);
            }
        });

        // 삭제할 파일 ID 추가
        deletedFileIds.forEach(attachmentId => {
            formData.append('delfile', attachmentId);
        });

        axios.put(`http://${SERVER_HOST}/product/update/${id}`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
            }
        })
            .then(response => {
                if (response.status === 200) {
                    console.log('상품 업데이트 성공:', response.data);
                    navigate(`/ProductDetail/${id}`);
                } else {
                    alert('업데이트 실패');
                }
            })
            .catch(error => {
                console.error('업데이트 오류:', error);
            });
    };


    return (
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
                    {product.fileList.length > 0 && (
                            <div className={styles.previewContainer}>
                                {product.fileList.map((file, index) => (
                                    <div key={index} className={styles.previewImageContainer}>
                                        <img
                                            src={file.source}
                                            alt={`Preview ${file.filename}`}
                                            className={styles.previewImage}
                                        />
                                        <Button
                                            variant="danger"
                                            onClick={() => handleFileRemove(file.filename, file.fileId)}
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                    {isSubmitted && errors.files && <p className={styles.errorText}>{errors.files}</p>}
                </Form.Group>

                <Form.Group className={styles.productName} controlId="formBasicTitle">
                    {/* <Form.Label>상품명</Form.Label> */}
                    <Form.Control
                        type='text'
                        value={product.name}
                        placeholder='상품명'
                        onChange={handleInputChange}
                        name='name'
                    />
                    {isSubmitted && errors.name && <p className={styles.errorText}>{errors.name}</p>}
                </Form.Group>

                <Form.Group className={styles.productPrice} controlId="formBasicPrice">
                    {/* <Form.Label>가격</Form.Label> */}
                    <img src={price} alt='가격 아이콘' />
                    <Form.Control
                        type='number'
                        placeholder='가격'
                        value={product.price}
                        onChange={handleInputChange}
                        className={styles.productInputPrice}
                        name='price'
                    />
                    {isSubmitted && errors.price && <p className={styles.errorText}>{errors.price}</p>}
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
                            <option value="">선택하세요</option>
                            {subCategoryOptions.map(subCat => (
                                <option key={subCat} value={subCat}>{subCat}</option>
                            ))}
                        </Form.Control>
                    </div>
                </Form.Group>

                <Form.Group className={styles.productDesiredArea} controlId="formBasicDesiredArea">
                    {/* <Form.Label>거래희망지역</Form.Label> */}
                    <Form.Control
                        type='text'
                        placeholder='거래희망지역'
                        value={product.desiredArea}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                            onClick={() => setProduct(prevProduct => ({ ...prevProduct, status: '새상품' }))}
                        >
                            새상품
                        </button>
                        <button
                            type="button"
                            className={`${styles.statusButton} ${product.status === '중고' ? styles.selected : ''}`}
                            onClick={() => setProduct(prevProduct => ({ ...prevProduct, status: '중고' }))}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                    className={styles.customCheckbox}
                                />
                                <label htmlFor="dealing-type-shipping" className={styles.customCheckboxLabel}>
                                    <span className={styles.customCheckboxText}>배송</span>
                                </label>
                            </div>
                            {isSubmitted && errors.dealingType && <p className={styles.errorText}>{errors.dealingType}</p>}
                        </Form.Group>

                        <button className={styles.registerButton} type='submit'>수정하기</button>
            </Form>
            <Footer />
        </>
    );
};

export default ProductUpdate;
