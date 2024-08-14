import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Style from '../../css/my/MyDealListSub.module.css';
import { Card } from 'react-bootstrap';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';

const MyDealListSub = (props) => {
    const { activatedKey, isProductOrCar, pageType } = props;
    const { userInfo } = useContext(LoginContext);
    var [ products, setProducts ] = useState([]);
    const [ sortedType, setSortedType ] = useState('1');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || !userInfo.userId) return;
        axios({
            method: "get",
            url: `http://localhost:8088/${isProductOrCar}/sortedlist/${userInfo.userId}/${sortedType}`,
        })
        .then(response => {
            if(Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.log('데이터 로드 실패');
            }
        });

        if(!activatedKey) return;
        filterDealingStatus();
    }, [userInfo, sortedType, activatedKey]);

    const filterDealingStatus = () => {
        console.log("활성화 키 : " + activatedKey);
        console.log(activatedKey === 'onSale');
        if(activatedKey === 'onSale') {
            setProducts(products.filter(product => product.dealingStatus === '판매중'));
        } else if(activatedKey === 'booked') {
            setProducts(products.filter(product => product.dealingStatus === '예약중'));
        } else if(activatedKey === 'outOfSale') {
            setProducts(products.filter(product => product.dealingStatus === '판매완료'));
        }
        console.log(products);
    };

    const goDetailPage = (id) => {
        navigate('/ProductDetail/' + id);
    };

    const handleFilter = (e) => {
        if(e.target.value === '1' && sortedType !== '1') setSortedType('1');
        if(e.target.value === '2' && sortedType !== '2') setSortedType('2');
        if(e.target.value === '3' && sortedType !== '3') setSortedType('3');
    };

    return (
        <>
            <div className={Style.sellListFilterFrame}>
                <p>총 {products.length}개</p>
                <div className={Style.sellListFilter}>
                    <button className={sortedType === '1' ? Style.sellFilterButtonActive : Style.sellFilterButton} onClick={handleFilter} value='1'>최신순</button>
                    &nbsp;|&nbsp;
                    <button className={sortedType === '2' ? Style.sellFilterButtonActive : Style.sellFilterButton} onClick={handleFilter} value='2'>낮은가격순</button>
                    &nbsp;|&nbsp;
                    <button className={sortedType === '3' ? Style.sellFilterButtonActive : Style.sellFilterButton} onClick={handleFilter} value='3'>높은가격순</button>
                </div>
            </div>
            <div className={Style.sellListInfo}>
                {products.map(product => (
                    <Card className={Style.sellInfoCard} onClick={() => goDetailPage(product.productId)}>
                        <Card.Img className={Style.sellInfoCardImg} src={product.fileList[0].source}/>
                        <Card.Body className={Style.sellInfoCardBody}>
                            <Card.Title className={Style.sellInfoTitle}>{product.name}</Card.Title>
                            <Card.Text className={Style.sellInfoPrice}>{product.price.toLocaleString()}원</Card.Text>
                            <Card.Text className={Style.sellInfoExtra}>{product.desiredArea} | {Math.floor((new Date() - new Date(product.regDate)) / (1000 * 60 * 60 * 24)) === 0 ? '오늘' : Math.floor((new Date() - new Date(product.regDate)) / (1000 * 60 * 60 * 24)) + '일 전'}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default MyDealListSub;