import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Style from '../../css/my/DealList.module.css';
import { Card } from 'react-bootstrap';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import { SERVER_HOST } from '../../apis/Api';
import moment from 'moment';

const DealList = (props) => {
    const { activatedKey, isProductOrCar, pageType } = props;
    const { userInfo } = useContext(LoginContext);
    const [ listArr, setListArr ] = useState([]);
    const [ sortedType, setSortedType ] = useState('1');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || !userInfo.userId) return;
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/${pageType}/${isProductOrCar}/sortedlist/${userInfo.userId}/${sortedType}/${activatedKey}`,
        })
        .then(response => {
            if(Array.isArray(response.data)) {
                setListArr(response.data);
            } else {
                console.log('데이터 로드 실패');
            }
        });

    }, [userInfo, sortedType, activatedKey]);

    const goDetailPage = (elem) => {
        if(isProductOrCar === 'product') navigate('/ProductDetail/' + elem.productId);
        else navigate('/CarDetail/' + elem.carId);
    };

    const handleFilter = (e) => {
        if(e.target.value === '1' && sortedType !== '1') setSortedType('1');
        if(e.target.value === '2' && sortedType !== '2') setSortedType('2');
        if(e.target.value === '3' && sortedType !== '3') setSortedType('3');
    };

    const formatRegDate = (regDate) => {
        const now = moment();
        const date = moment(regDate);

        const diffSeconds = now.diff(date, 'seconds');
        const diffMinutes = now.diff(date, 'minutes');
        const diffHours = now.diff(date, 'hours');
        const diffDays = now.diff(date, 'days');

        if (diffSeconds < 60) {
            return `${diffSeconds}초전`;
        } else if (diffMinutes < 60) {
            return `${diffMinutes}분전`;
        } else if (diffHours < 24) {
            return `${diffHours}시간전`;
        } else if (diffDays < 30) {
            return `${diffDays}일전`;
        } else {
            return date.format('YYYY-MM-DD');
        }
    };

    return (
        <>
            <div className={Style.sellListFilterFrame}>
                <p>총 {listArr.length}개</p>
                <div className={Style.sellListFilter}>
                    <button className={sortedType === '1' ? Style.sellFilterButtonActive : Style.sellFilterButton} onClick={handleFilter} value='1'>최신순</button>
                    &nbsp;|&nbsp;
                    <button className={sortedType === '2' ? Style.sellFilterButtonActive : Style.sellFilterButton} onClick={handleFilter} value='2'>낮은가격순</button>
                    &nbsp;|&nbsp;
                    <button className={sortedType === '3' ? Style.sellFilterButtonActive : Style.sellFilterButton} onClick={handleFilter} value='3'>높은가격순</button>
                </div>
            </div>
            {listArr.length !== 0 ? 
                <div className={Style.sellListInfo}>
                {listArr.map(elem => (
                    <Card className={Style.sellInfoCard} onClick={() => goDetailPage(elem)}>
                        <div className={Style.sellInfoCardImgContainer}>
                            <Card.Img className={Style.sellInfoCardImg} src={elem.fileList[0].source}/>
                        </div>
                        <Card.Body className={Style.sellInfoCardBody}>
                            <Card.Title className={Style.sellInfoTitle}>{elem.name}</Card.Title>
                            <Card.Text className={Style.sellInfoPrice}>
                                {
                                    elem.price === 0 ?
                                        isProductOrCar === 'product' ?
                                            '무료 나눔'
                                        :
                                            '가격 협의'
                                    :
                                        elem.price.toLocaleString() + (isProductOrCar === 'product' ? '원' : '만원')
                                }
                            </Card.Text>
                            <Card.Text className={Style.sellInfoExtra}>{isProductOrCar === 'product' && elem.desiredArea !== '' ? elem.desiredArea + ' | ' : ''}{formatRegDate(elem.regDate)}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
                </div>:
                <div className={Style.noSellListInfo}>선택된 조건에 해당하는 상품이 없습니다.</div>
            }
        </>
    );
};

export default DealList;