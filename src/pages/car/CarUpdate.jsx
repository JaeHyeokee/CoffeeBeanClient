import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import price from '../../image/ProductPrice.png';
import { LoginContext } from '../../contexts/LoginContextProvider';
import * as Swal from '../../apis/Alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../../css/car/CarUpdate.module.css';
import { SERVER_HOST } from '../../apis/Api';

const categories = {
    "국산차": ["현대", "제네시스", "기아", "쉐보레", "르노코리아(삼성)", "KG모빌리티(쌍용)"],
    "외제차": ["벤츠", "포르쉐", "BMW", "페라리", "롤스로이스", "벤틀리", "람보르기니", "테슬라", "랜드로버"]
};

const CarUpdate = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(LoginContext);
    const userId = userInfo?.userId;

    const { carId } = useParams(); // 차량 ID

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
        fileList: []
    });

    const [deletedFileIds, setDeletedFileIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const [errors, setErrors] = useState({
        name: "",
        price: "",
        introduce: "",
        category1: "",
        category2: "",
        files: []
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = () => {
        let formIsValid = true;
        const newErrors = {
            name: "",
            price: "",
            introduce: "",
            category1: "",
            category2: "",
            files: []
        };

        if (!car.name) {
            newErrors.name = "상품명을 입력해주세요.";
            formIsValid = false;
        }

        if (!car.price) {
            newErrors.price = "상품 가격을 입력해주세요.";
            formIsValid = false;
        }

        if (!car.introduce) {
            newErrors.introduce = "상품 설명을 입력해주세요.";
            formIsValid = false;
        }

        if (!car.category1) {
            newErrors.category1 = "카테고리1을 선택해주세요";
            formIsValid = false;
        }

        if (!car.category2) {
            newErrors.category2 = "카테고리2를 선택해주세요";
            formIsValid = false;
        }
        if (!Array.isArray(car.fileList) || car.fileList.length === 0) {
            newErrors.files = "사진을 1장 이상 첨부해주세요.";
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };

    useEffect(() => {
        axios.get(`http://${SERVER_HOST}/car/detail/${carId}`)
            .then(response => {
                const carData = response.data;
                setCar({
                    ...carData,
                    fileList: carData.fileList.map(file => ({
                        ...file,
                        fileId: file.attachmentId // 파일 ID를 포함
                    })) || [],
                });
                setSelectedCategory(carData.category1);
                setSelectedSubCategory(carData.category2);
            })
            .catch(error => {
                console.error(error);
            });
    }, [carId]);
    
    useEffect(() => {
        setSubCategoryOptions(categories[selectedCategory] || []);
        setSelectedSubCategory(car.category2);
    }, [selectedCategory]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCar(prevCar => ({
            ...prevCar,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setCar(prevCar => ({ ...prevCar, category1: category }));
    };

    const handleSubCategoryChange = (e) => {
        const subCategory = e.target.value;
        setSelectedSubCategory(subCategory);
        setCar(prevCar => ({ ...prevCar, category2: subCategory }));
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const fileArray = Array.from(files).map(file => ({
                file,
                filename: file.name,
                source: URL.createObjectURL(file)
            }));
            setCar(prevCar => ({
                ...prevCar,
                fileList: [...prevCar.fileList, ...fileArray]
            }));
        }
    };

    const handleFileRemove = (fileId) => {
        setCar(prevCar => {
            const updatedFileList = prevCar.fileList.filter(file => file.fileId !== fileId);
            return {
                ...prevCar,
                fileList: updatedFileList
            };
        });

        if (fileId) {
            setDeletedFileIds(prevIds => [...prevIds, fileId]);
        }
    };

    const submitCar = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        if(!validateForm()){
            return;
        }

        const formData = new FormData();
        
        // 필드 추가
        Object.keys(car).forEach(key => {
            if (key !== 'fileList' && car[key] !== null && car[key] !== undefined) {
                formData.append(key, car[key]);
            }
        });
        
        // 파일 추가
        car.fileList.forEach(file => {
            formData.append('files', file.file);
        });
        
        // 삭제할 파일 ID 추가
        deletedFileIds.forEach(attachmentId => {
            formData.append('delfile', attachmentId);
        });
        
        console.log("URL:", `http://${SERVER_HOST}/car/update/${carId}`);  // URL 확인
    
        axios.put(`http://${SERVER_HOST}/car/update/${carId}`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
            }
        })
        .then(response => {
            if (response.status === 200) {
                console.log('차량 정보 업데이트 성공:', response.data);
                navigate(`/CarDetail/${carId}`);
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
            <Form onSubmit={submitCar} className={styles.productCreateBody}>
                <Form.Group className={styles.productImg} controlId="formBasicImage">
                    <Form.Label>이미지 첨부</Form.Label>
                    <Form.Control type="file" multiple onChange={handleFileChange} />
                    <div className={styles.previewContainer}>
                    {car.fileList.length > 0 && (
                            <div className={styles.previewContainer}>
                                {car.fileList.map((file, index) => (
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
                <Form.Label>차량명</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="차량명"
                        value={car.name}
                        name="name"
                        onChange={handleInputChange}
                    />
                    {isSubmitted && errors.files && <p className={styles.errorText}>{errors.name}</p>}
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
                                {isSubmitted && errors.files && <p className={styles.errorText}>{errors.category1}</p>}
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
                                {isSubmitted && errors.files && <p className={styles.errorText}>{errors.category2}</p>}
                            </div>
                </Form.Group>
    
                <Form.Group className={styles.productPrice} controlId="formBasicPrice">
                            <img src={price} alt='가격 아이콘' />
                            <Form.Control
                                type="number"
                                placeholder="가격 (만원)"
                                value={car.price}
                                name="price"
                                onChange={handleInputChange}
                                className={styles.productInputPrice}
                            />
                             {isSubmitted && errors.files && <p className={styles.errorText}>{errors.price}</p>}
                        </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicModelYear">
                    <Form.Label>연식</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="연식"
                        value={car.modelYear}
                        name="modelYear"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicCarNum">
                <Form.Label>차량 번호</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="차량 번호"
                        value={car.carNum}
                        name="carNum"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicDistance">
                <Form.Label>주행 거리</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="주행 거리"
                        value={car.distance}
                        name="distance"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicDisplacement">
                <Form.Label>배기량</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="배기량"
                        value={car.displacement}
                        name="displacement"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicFuel">
                <Form.Label>연료</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="연료"
                        value={car.fuel}
                        name="fuel"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicTransmission">
                <Form.Label>변속기</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="변속기"
                        value={car.transmission}
                        name="transmission"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicInsuranceVictim">
                <Form.Label>보험 이력 (피해자) 횟수</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="보험 이력 (피해자) 횟수"
                        value={car.insuranceVictim}
                        name="insuranceVictim"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicInsuranceInjurer">
                <Form.Label>보험 이력 (가해자) 횟수</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="보험 이력 (가해자) 횟수"
                        value={car.insuranceInjurer}
                        name="insuranceInjurer"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicOwnerChange">
                <Form.Label>소유자 변경 이력 횟수</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="소유자 변경 이력 횟수"
                        value={car.ownerChange}
                        name="ownerChange"
                        onChange={handleInputChange}
                    />
                </Form.Group>
    
                <Form.Group className={styles.productDetail} controlId="formBasicIntroduce">
                    <Form.Control
                        as="textarea"
                        placeholder="소개글을 입력하세요"
                        value={car.introduce}
                        name="introduce"
                        onChange={handleInputChange}
                        className={styles.productInputIntroduce}
                    />
                     {isSubmitted && errors.files && <p className={styles.errorText}>{errors.introduce}</p>}
                </Form.Group>

                <Form.Group className={styles.productSubmit}>
                    <Button type="submit" className={styles.submitButton}>
                        수정하기
                    </Button>
                </Form.Group>
            </Form>
            <Footer />
        </>
    );
};

export default CarUpdate;
