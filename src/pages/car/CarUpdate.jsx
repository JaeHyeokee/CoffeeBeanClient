import React, { useState, useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import * as Swal from '../../apis/alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../../css/car/CarUpdate.module.css';

// 카테고리 데이터
const categories = {
    "국산차": ["현대", "제네시스", "기아", "쉐보레", "르노코리아(삼성)", "KG모빌리티(쌍용)"],
    "외제차": ["벤츠", "포르쉐", "BMW", "페라리", "롤스로이스", "벤틀리", "람보르기니", "테슬라", "랜드로버"]
};

const CarUpdate = () => {
    const navigate = useNavigate();
    const { userInfo, isLogin, roles } = useContext(LoginContext);
    const { carId } = useParams();

    // 차량 정보 상태
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
        files: [], // 업로드된 파일
        fileList: [] // 파일 목록
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    // 사용자 로그인 및 권한 체크
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

        if (carId) {
            axios.get(`http://localhost:8088/car/detail/${carId}`)
                .then(response => {
                    const carData = response.data;
                    setCar(carData);
                    setSelectedCategory(carData.category1);
                })
                .catch(error => {
                    console.error('차량 정보를 불러오는 중 오류 발생:', error);
                });
        }
    }, [isLogin, roles, userInfo, navigate, carId]);

    // 선택된 카테고리에 따른 하위 카테고리 업데이트
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

    // 입력값 변경 핸들러
    const changeValue = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) : value;
        setCar(prevCar => ({
            ...prevCar,
            [name]: newValue
        }));
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // 하위 카테고리 변경 핸들러
    const handleSubCategoryChange = (e) => {
        setCar(prevCar => ({
            ...prevCar,
            category2: e.target.value
        }));
    };

    // 차량 상태 변경 핸들러
    const handleStatusChange = (status) => {
        setCar(prevCar => ({
            ...prevCar,
            status: status
        }));
    };

    // 파일 업로드 핸들러
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file: file,
            name: file.name,
            id: URL.createObjectURL(file) // 이미지 미리보기 URL 생성
        }));

        setCar(prevCar => ({
            ...prevCar,
            files: [...prevCar.files, ...newFiles]
        }));
    };

    // 파일 삭제 핸들러
    const handleFileRemove = (fileId) => {
        setCar(prevCar => ({
            ...prevCar,
            files: prevCar.files.filter(file => file.id !== fileId)
        }));
    };

    // 폼 제출 핸들러
    const submitUpdate = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // 차량 데이터 추가
        Object.keys(car).forEach(key => {
            if (key !== 'files' && key !== 'fileList') {
                formData.append(key, car[key]);
            }
        });

        // 파일 데이터 추가
        car.files.forEach(file => {
            formData.append('files', file.file);
        });

        axios({
            method: 'put',
            url: `http://localhost:8088/car/update/${carId}`,
            headers: {
                "Content-Type": 'multipart/form-data',
            },
            data: formData,
        })
        .then(response => {
            const { data, status } = response;
            if (status === 200) {
                console.log('차량 업데이트 성공:', data);
                navigate(`/CarDetail/${data}`);
            } else {
                alert('업데이트 실패');
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
                    <Form onSubmit={submitUpdate} className={styles.productCreateBody}>
                        <Form.Group className={styles.productImg} controlId="formBasicImage">
                            <Form.Label>이미지</Form.Label>
                            <div>
                                <Form.Control
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className={styles.previewContainer}>
                                {Array.isArray(car.fileList) && car.fileList.map(file => (
                                    <div key={file.attachmentId} className={styles.previewImageContainer}>
                                        <img src={file.source} alt={`Preview ${file.filename}`} className={styles.previewImage} />
                                    </div>
                                ))}
                                {Array.isArray(car.files) && car.files.map(file => (
                                    <div key={file.id} className={styles.previewImageContainer}>
                                        <img src={file.id} alt={`Preview ${file.name}`} className={styles.previewImage} />
                                        <Button variant="danger" onClick={() => handleFileRemove(file.id)}>삭제</Button>
                                    </div>
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
                                >
                                    <option value="">카테고리 선택</option>
                                    {subCategoryOptions.map(subCategory => (
                                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                                    ))}
                                </Form.Control>
                            </div>
                        </Form.Group>

                        <Form.Group className={styles.productDetail} controlId="formBasicPrice">
                            <Form.Label>가격</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='가격'
                                value={car.price}
                                onChange={changeValue}
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
                            <Button type='submit' className={styles.submitButton}>{carId ? '업데이트' : '등록'}</Button>
                        </Form.Group>
                    </Form>
                    <Footer />
                </>
            }
        </>
    );
};

export default CarUpdate;
