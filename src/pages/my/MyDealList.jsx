import React, { useState } from 'react';
import MyHome from './MyHome';
import { Button, Card, Tab, Tabs } from 'react-bootstrap';
import Style from '../../css/my/MyDealList.module.css';
import MyCarIcon from '../../image/MyCarIcon.png';

const MyDealList = (props) => {
    const [ key, setKey ] = useState('all');
    const { pageType, isProductOrCar, setIsProductOrCar } = props;

    const handleClick = (e) => {
        if(e.target.value === 'prod' && isProductOrCar === 'car') setIsProductOrCar('prod');
        if(e.target.value === 'car' && isProductOrCar === 'prod') setIsProductOrCar('car');
    }
    return (
        <>
            <MyHome/>
            <section className={Style.sellList}>
                <div className={Style.myListHeader}>
                    <p className={Style.sellTitle}>{pageType === 'sell' ? '판매 내역' : pageType === 'buy' ? '구매 내역' : '찜 목록'}</p>
                    {/* <select className='my-list-filter'>
                        <option value="1" selected>중고 물품</option>
                        <option value="2">중고차</option>
                    </select> */}
                    <div className={Style.categoryFilterButtonFrame}>
                        <Button className={isProductOrCar === 'prod' ? Style.categoryFilterButtonActive : Style.categoryFilterButton} onClick={handleClick} value='prod'>중고 물품</Button>
                        <Button className={isProductOrCar === 'car' ? Style.categoryFilterButtonActive : Style.categoryFilterButton} onClick={handleClick} value='car'>중고차</Button>
                    </div>
                </div>
                <Tabs className={Style.sellStatus} activeKey={key} onSelect={(k) => setKey(k)}>
                    <Tab eventKey='all' title='전체'>
                        <div className={Style.sellListFilterFrame}>
                            <p>총 5개</p>
                            <div className={Style.sellListFilter}>
                                <button onClick={''}>최신순</button>
                                &nbsp;|&nbsp;
                                <button onClick={''}>낮은가격순</button>
                                &nbsp;|&nbsp;
                                <button onClick={''}>높은가격순</button>
                            </div>
                        </div>
                        <div className={Style.sellListInfo}>
                            <Card className={Style.sellInfoCard}>
                                <Card.Img className={Style.sellInfoCardImg} src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                <Card.Body className={Style.sellInfoCardBody}>
                                    <Card.Title className={Style.sellInfoTitle}>쬬꼬렛</Card.Title>
                                    <Card.Text className={Style.sellInfoPrice}>15,000원</Card.Text>
                                    <Card.Text className={Style.sellInfoExtra}>정자동 | 2일 전</Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className={Style.sellInfoCard}>
                                <Card.Img className={Style.sellInfoCardImg} src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                <Card.Body className={Style.sellInfoCardBody}>
                                    <Card.Title className={Style.sellInfoTitle}>쬬꼬렛</Card.Title>
                                    <Card.Text className={Style.sellInfoPrice}>15,000원</Card.Text>
                                    <Card.Text className={Style.sellInfoExtra}>정자동 | 2일 전</Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className={Style.sellInfoCard}>
                                <Card.Img className={Style.sellInfoCardImg} src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                <Card.Body className={Style.sellInfoCardBody}>
                                    <Card.Title className={Style.sellInfoTitle}>쬬꼬렛</Card.Title>
                                    <Card.Text className={Style.sellInfoPrice}>15,000원</Card.Text>
                                    <Card.Text className={Style.sellInfoExtra}>정자동 | 2일 전</Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className={Style.sellInfoCard}>
                                <Card.Img className={Style.sellInfoCardImg} src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                <Card.Body className={Style.sellInfoCardBody}>
                                    <Card.Title className={Style.sellInfoTitle}>쬬꼬렛</Card.Title>
                                    <Card.Text className={Style.sellInfoPrice}>15,000원</Card.Text>
                                    <Card.Text className={Style.sellInfoExtra}>정자동 | 2일 전</Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className={Style.sellInfoCard}>
                                <Card.Img className={Style.sellInfoCardImg} src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                <Card.Body className={Style.sellInfoCardBody}>
                                    <Card.Title className={Style.sellInfoTitle}>쬬꼬렛</Card.Title>
                                    <Card.Text className={Style.sellInfoPrice}>15,000원</Card.Text>
                                    <Card.Text className={Style.sellInfoExtra}>정자동 | 2일 전</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </Tab>
                    <Tab eventKey='onSale' title='판매중'>
                        판매중
                    </Tab>
                    <Tab eventKey='booked' title='예약중'>
                        예약중
                    </Tab>
                    <Tab eventKey='outOfSale' title='판매완료'>
                        판매완료
                    </Tab>
                </Tabs>
            </section>
        </>
    );
};

export default MyDealList;