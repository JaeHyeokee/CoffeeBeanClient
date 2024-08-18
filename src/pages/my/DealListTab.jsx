import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import SellList from './SellList';
import Style from '../../css/my/DealListTab.module.css';

const DealListTab = (props) => {
    const { activatedKey, setActivatedKey, pageType, isProductOrCar } = props;

    return (
        <Tabs className={Style.sellStatus} activeKey={activatedKey} onSelect={(k) => setActivatedKey(k)}>
            <Tab eventKey='전체' title='전체'>
                <SellList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
            <Tab eventKey='판매중' title='판매중'>
                <SellList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
            <Tab eventKey='예약중' title='예약중'>
                <SellList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
            <Tab eventKey='판매완료' title='판매완료'>
                <SellList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
        </Tabs>
    );
};

export default DealListTab;