import React, { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import Footer from '../components/Footer';
import styles from '../../css/car/CarCreate.module.css';
import * as Swal from '../../apis/alert';

const categories = {
    "국산차": ["현대", "제네시스", "기아", "쉐보레", "르노코리아(삼성)", "KG모빌리티(쌍용)"],
    "외제차": ["벤츠", "포르쉐", "BMW", "페라리", "롤스로이스", "벤틀리", "람보르기니", "테슬라", "랜드로버"]
};

const CarCreate = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(LoginContext);
    const userId = userInfo?.userId;

    const [car, setCar] = useState({
        name: "",
        price: "",
        introduce: "",
        dealingStatus: "판매중",
        category1: "",
        category2: "",
        status: "중고",
        modelYear: "",
        carNum: "",
        distance: "",
        displacement: "",
        fuel: "",
        transmission: "",
        insuranceVictim: "",
        insuranceInjurer: "",
        ownerChange: "",
    });

    useEffect(() => {
        if (!userInfo || !userId) {
            Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") });
            navigate('/login');
        }
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (selectedCategory) {
            setSubCategoryOptions(categories[selectedCategory] || []);
            setCar(prevCar => ({
                ...prevCar,
                category1: selectedCategory,
                category2: ""
            }));
        }
    }, [selectedCategory]);

    const changeValue = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) : value;
        setCar({
            ...car,
            [name]: newValue
        });
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSubCategoryChange = (e) => {
        setCar({
            ...car,
            category2: e.target.value
        });
    };

    const handleStatusChange = (status) => {
        setCar({
            ...car,
            status: status
        });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const submitCar = (e) => {
        e.preventDefault();

        console.log(car);

        const formData = new FormData();

        // Add car data to FormData
        Object.keys(car).forEach(key => {
            formData.append(key, car[key]);
        });

        // Add files to FormData
        files.forEach(file => {
            formData.append('files', file);
        });

        axios({
            method: 'post',
            url: `http://localhost:8088/car/write/${userId}`,
            headers: {
                "Content-Type": 'multipart/form-data',
            },
            data: formData,
        })
        .then(response => {
            const { data, status } = response;
            if (status === 201) {
                console.log('차량 등록 성공:', data);
                navigate(`/CarDetail/${data}`);
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
            <Header />
            <Form onSubmit={submitCar} className={styles.productCreateBody}>
                <Form.Group className={styles.productImg} controlId="formBasicImage">
                    <Form.Label>이미지</Form.Label>
                    <div>
                        <input type='file' multiple name='files' onChange={handleFileChange} />
                    </div>
                    <div className={styles.previewContainer}>
                        {previews.map((src, index) => (
                            <img key={index} src={src} alt={`Preview ${index}`} className={styles.previewImage} />
                        ))}
                    </div>
                </Form.Group>

                <Form.Group className={styles.productName} controlId="formBasicTitle">
                    <Form.Label>차량명</Form.Label>
                    <Form.Control
                        type='text'
                        value={car.name}
                        placeholder='차량명'
                        onChange={changeValue}
                        name='name'
                    />
                </Form.Group>

                <Form.Group className={styles.productCategory} controlId="formBasicCategory1">
                    <div>
                        <Form.Label>카테고리1</Form.Label>
                        <Form.Control
                            as="select"
                            value={car.category1}
                            onChange={handleCategoryChange}
                        >
                            <option value="">카테고리 선택</option>
                            {Object.keys(categories).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Form.Control>
                    </div>

                    <div>
                        <Form.Label>카테고리2</Form.Label>
                        <Form.Control
                            as="select"
                            value={car.category2}
                            onChange={handleSubCategoryChange}
                            disabled={!selectedCategory}
                        >
                            <option value="">카테고리 선택</option>
                            {subCategoryOptions.map(subCategory => (
                                <option key={subCategory} value={subCategory}>{subCategory}</option>
                            ))}
                        </Form.Control>
                    </div>
                </Form.Group>

                <Form.Group className={styles.productPrice} controlId="formBasicPrice">
                    <Form.Label>가격 (만원)</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='가격 (만원)'
                        value={car.price}
                        onChange={changeValue}
                        className={styles.productInputPrice}
                        name='price'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicModelYear">
                    <Form.Label>연식</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='연식'
                        value={car.modelYear}
                        onChange={changeValue}
                        name='modelYear'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicCarNum">
                    <Form.Label>차량 번호</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='차량 번호'
                        value={car.carNum}
                        onChange={changeValue}
                        name='carNum'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicDistance">
                    <Form.Label>주행 거리</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='주행 거리'
                        value={car.distance}
                        onChange={changeValue}
                        name='distance'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicDisplacement">
                    <Form.Label>배기량</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='배기량'
                        value={car.displacement}
                        onChange={changeValue}
                        name='displacement'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicFuel">
                    <Form.Label>연료</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='연료'
                        value={car.fuel}
                        onChange={changeValue}
                        name='fuel'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicTransmission">
                    <Form.Label>변속기</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='변속기'
                        value={car.transmission}
                        onChange={changeValue}
                        name='transmission'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicInsuranceVictim">
                    <Form.Label>보험 이력 (피해자)</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='보험 이력 (피해자)'
                        value={car.insuranceVictim}
                        onChange={changeValue}
                        name='insuranceVictim'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicInsuranceInjurer">
                    <Form.Label>보험 이력 (가해자)</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='보험 이력 (가해자)'
                        value={car.insuranceInjurer}
                        onChange={changeValue}
                        name='insuranceInjurer'
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicOwnerChange">
                    <Form.Label>소유자 변경 이력</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder='소유자 변경 이력'
                        value={car.ownerChange}
                        onChange={changeValue}
                        name='ownerChange'
                    />
                </Form.Group>

                <Form.Group className={styles.productStatus}>
                    <Form.Label>상태</Form.Label>
                    <Form.Check
                        inline
                        label="중고"
                        type="radio"
                        name="status"
                        value="중고"
                        checked={car.status === '중고'}
                        onChange={() => handleStatusChange('중고')}
                    />
                    <Form.Check
                        inline
                        label="새 상품"
                        type="radio"
                        name="status"
                        value="새상품"
                        checked={car.status === '새상품'}
                        onChange={() => handleStatusChange('새상품')}
                    />
                </Form.Group>

                <Form.Group className={styles.productDetail} controlId="formBasicIntroduce">
                    <Form.Label>소개</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={5}
                        value={car.introduce}
                        placeholder='소개'
                        onChange={changeValue}
                        name='introduce'
                    />
                </Form.Group>

                <Form.Group className={styles.productSubmit}>
                    <button type='submit' className={styles.submitButton}>등록</button>
                </Form.Group>
            </Form>
            <Footer />
        </>
    );
};

export default CarCreate;
