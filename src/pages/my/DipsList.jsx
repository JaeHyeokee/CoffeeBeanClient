import React, { useState } from 'react';
import MyHome from './MyHome';
import { Card, Tab, Tabs } from 'react-bootstrap';
import '../../css/my/MyDealList.css';

const DipsList = () => {
    const [key, setKey] = useState('all');

    return (
        <>
            <MyHome/>
            <section className='sell-list'>
                <p className='sell-title'>찜 목록</p>
                    <Tabs id='sell-status' activeKey={key} onSelect={(k) => setKey(k)}>
                        <Tab eventKey='all' title='전체'>
                            <div className='sell-list-filter-frame'>
                                <p>총 5개</p>
                                <div className='sell-list-filter'>
                                    <button onClick={''}>최신순</button>
                                    &nbsp;|&nbsp;
                                    <button onClick={''}>낮은가격순</button>
                                    &nbsp;|&nbsp;
                                    <button onClick={''}>높은가격순</button>
                                </div>
                            </div>
                            <div className='sell-list-info'>
                                <Card id='sell-info-card'>
                                    <Card.Img id='sell-info-card-img' src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                    <Card.Body id='sell-info-card-body'>
                                        <Card.Title id='sell-info-title'>쬬꼬렛</Card.Title>
                                        <Card.Text id='sell-info-price'>15,000원</Card.Text>
                                        <Card.Text id='sell-info-extra'>정자동 | 2일 전</Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card id='sell-info-card'>
                                    <Card.Img id='sell-info-card-img' src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                    <Card.Body id='sell-info-card-body'>
                                        <Card.Title id='sell-info-title'>쬬꼬렛</Card.Title>
                                        <Card.Text id='sell-info-price'>15,000원</Card.Text>
                                        <Card.Text id='sell-info-extra'>정자동 | 2일 전</Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card id='sell-info-card'>
                                    <Card.Img id='sell-info-card-img' src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                    <Card.Body id='sell-info-card-body'>
                                        <Card.Title id='sell-info-title'>쬬꼬렛</Card.Title>
                                        <Card.Text id='sell-info-price'>15,000원</Card.Text>
                                        <Card.Text id='sell-info-extra'>정자동 | 2일 전</Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card id='sell-info-card'>
                                    <Card.Img id='sell-info-card-img' src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                    <Card.Body id='sell-info-card-body'>
                                        <Card.Title id='sell-info-title'>쬬꼬렛</Card.Title>
                                        <Card.Text id='sell-info-price'>15,000원</Card.Text>
                                        <Card.Text id='sell-info-extra'>정자동 | 2일 전</Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card id='sell-info-card'>
                                    <Card.Img id='sell-info-card-img' src='https://img2.joongna.com/media/original/2024/08/03/1722684220548T4v_S4eys.jpg?impolicy=thumb&amp;size=50'/>
                                    <Card.Body id='sell-info-card-body'>
                                        <Card.Title id='sell-info-title'>쬬꼬렛</Card.Title>
                                        <Card.Text id='sell-info-price'>15,000원</Card.Text>
                                        <Card.Text id='sell-info-extra'>정자동 | 2일 전</Card.Text>
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
                        <div>총 0개</div>
                    </Tabs>
                </section>
            </>
    );
};

export default DipsList;