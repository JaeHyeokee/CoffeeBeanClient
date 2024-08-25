import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import DealList from './DealList';
import Style from '../../css/my/DealListTab.module.css';

const DealListTab = (props) => {
    const { activatedKey, setActivatedKey, pageType, isProductOrCar } = props;

    return (
        <Tabs className={Style.sellStatus} activeKey={activatedKey} onSelect={(k) => setActivatedKey(k)}>
            <Tab eventKey='전체' title='전체'>
                <DealList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
            </Tab>
            {pageType !== 'buy' ? 
                <Tab eventKey='판매중' title='판매중'>
                    <DealList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
                </Tab>
                : null
            }
            {pageType !== 'buy' ?
                <Tab eventKey='예약중' title='예약중'>
                    <DealList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
                </Tab>
                : null
            }
            {pageType !== 'buy' ?
                <Tab eventKey='판매완료' title='판매완료'>
                    <DealList activatedKey={activatedKey} isProductOrCar={isProductOrCar} pageType={pageType}/>
                </Tab>
                : null
            }
        </Tabs>
    );
};

export default DealListTab;