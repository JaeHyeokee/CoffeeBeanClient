import React, { useState, useContext, useEffect } from 'react';
import { Form, ListGroup, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import price from '../../image/ProductPrice.png';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import * as Swal from '../../apis/Alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../../css/car/CarCreate.module.css';
import { SERVER_HOST } from '../../apis/Api';

const categories = {
    "국산차": ["현대", "제네시스", "기아", "쉐보레", "르노코리아(삼성)", "KG모빌리티(쌍용)"],
    "외제차": ["벤츠", "포르쉐", "BMW", "페라리", "롤스로이스", "벤틀리", "람보르기니", "테슬라", "랜드로버"]
};

const CarCreate = () => {
    const navigate = useNavigate();
    const { userInfo, isLogin, roles } = useContext(LoginContext);
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
        files: []
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

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
        setCar(prevCar => ({
            ...prevCar,
            [name]: newValue
        }));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSubCategoryChange = (e) => {
        setCar(prevCar => ({
            ...prevCar,
            category2: e.target.value
        }));
    };

    const handleStatusChange = (status) => {
        setCar(prevCar => ({
            ...prevCar,
            status: status
        }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file: file,
            name: file.name,
            id: URL.createObjectURL(file)  // 이미지 미리보기 URL 생성
        }));

        setCar(prevCar => ({
            ...prevCar,
            files: [...prevCar.files, ...newFiles]
        }));
    };

    const handleFileRemove = (fileId) => {
        setCar(prevCar => ({
            ...prevCar,
            files: prevCar.files.filter(file => file.id !== fileId)
        }));
    };

    const submitCar = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Add car data to FormData
        Object.keys(car).forEach(key => {
            if (key !== 'files') {
                formData.append(key, car[key]);
            }
        });

        // Add files to FormData
        car.files.forEach(file => {
            formData.append('files', file.file);
        });

        axios({
            method: 'post',
            url: `http://${SERVER_HOST}/car/write/${userId}`,
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
            {isLogin && roles.isUser &&
                <>
                    <Header />
                    <Form onSubmit={submitCar} className={styles.productCreateBody}>
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
                                {car.files.map(file => (
                                    <div key={file.id} className={styles.previewImageContainer}>
                                        <img src={file.id} alt={`Preview ${file.name}`} className={styles.previewImage} />
                                        <Button variant="danger" onClick={() => handleFileRemove(file.id)}>X</Button>
                                    </div>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className={styles.productName} controlId="formBasicTitle">
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
                                <Form.Control
                                    as="select"
                                    value={car.category1}
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">카테고리1 선택</option>
                                    {Object.keys(categories).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </Form.Control>
                            </div>

                            <div>
                                <Form.Control
                                    as="select"
                                    value={car.category2}
                                    onChange={handleSubCategoryChange}
                                    disabled={!selectedCategory}
                                >
                                    <option value="">카테고리2 선택</option>
                                    {subCategoryOptions.map(subCategory => (
                                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                                    ))}
                                </Form.Control>
                            </div>
                        </Form.Group>

                        <Form.Group className={styles.productPrice} controlId="formBasicPrice">
                            <img src={price} alt='가격 아이콘' />
                            <Form.Control
                                type='number'
                                placeholder='판매가격(만원)'
                                value={car.price}
                                onChange={changeValue}
                                className={styles.productInputPrice}
                                name='price'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicModelYear">
                            <Form.Control
                                type='number'
                                placeholder='연식'
                                value={car.modelYear}
                                onChange={changeValue}
                                name='modelYear'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicCarNum">
                            <Form.Control
                                type='text'
                                placeholder='차량 번호'
                                value={car.carNum}
                                onChange={changeValue}
                                name='carNum'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicDistance">
                            <Form.Control
                                type='number'
                                placeholder='주행 거리'
                                value={car.distance}
                                onChange={changeValue}
                                name='distance'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicDisplacement">
                            <Form.Control
                                type='number'
                                placeholder='배기량'
                                value={car.displacement}
                                onChange={changeValue}
                                name='displacement'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicFuel">
                            <Form.Control
                                type='text'
                                placeholder='연료'
                                value={car.fuel}
                                onChange={changeValue}
                                name='fuel'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicTransmission">
                            <Form.Control
                                type='text'
                                placeholder='변속기'
                                value={car.transmission}
                                onChange={changeValue}
                                name='transmission'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicInsuranceVictim">
                            <Form.Control
                                type='number'
                                placeholder='보험 이력 (피해자) 횟수'
                                value={car.insuranceVictim}
                                onChange={changeValue}
                                name='insuranceVictim'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicInsuranceInjurer">
                            <Form.Control
                                type='number'
                                placeholder='보험 이력 (가해자) 횟수'
                                value={car.insuranceInjurer}
                                onChange={changeValue}
                                name='insuranceInjurer'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicOwnerChange">
                            <Form.Control
                                type='number'
                                placeholder='소유자 변경 이력 횟수'
                                value={car.ownerChange}
                                onChange={changeValue}
                                name='ownerChange'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicIntroduce">
                            <Form.Control
                                as='textarea'
                                rows={5}
                                value={car.introduce}
                                placeholder='실제 촬영한 사진과 함께 상세 정보를 입력해주세요.'
                                onChange={changeValue}
                                name='introduce'
                            />
                        </Form.Group>

                        <Form.Group className={styles.productSubmit}>
                            <Button type='submit' className={styles.submitButton}>등록</Button>
                        </Form.Group>
                    </Form>
                    <Footer />
                </>
            }
        </>
    );
};

export default CarCreate;
