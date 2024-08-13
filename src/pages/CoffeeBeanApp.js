import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import MyPage from './my/MyPage';
import MyInformation from './my/MyInformation';
import LogIn from './my/LogIn';
import Register from './my/Register';
import ReviewCreate from './my/ReviewCreate';
import ReviewDetail from './my/ReviewDetail';
import ReviewList from './my/ReviewList';
import UnRegister from './my/UnRegister';
import UserManagement from './admin/UserManagement';
import CarCreate from './car/CarCreate';
import CarDetail from './car/CarDetail';
import CarList from './car/CarList';
import CarUpdate from './car/CarUpdate';
import PostCreate from './post/PostCreate';
import PostDetail from './post/PostDetail';
import PostList from './post/PostList';
import PostUpdate from './post/PostUpdate';
import ProductCreate from './product/ProductCreate';
import ProductDetail from './product/ProductDetail';
import ProductList from './product/ProductList';
import ProductUpdate from './product/ProductUpdate';
import PropertyCreate from './property/PropertyCreate';
import PropertyDetail from './property/PropertyDetail';
import Propertylist from './property/Propertylist';
import PropertyUpdate from './property/PropertyUpdate';


const CoffeeBeanApp = () => {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path = '/' Component = {Home}/>

            <Route path = '/UserManagement' Component={UserManagement}/>

            <Route path = '/CarCreate' Component={CarCreate}/>
            <Route path = '/CarDetail/:id' Component={CarDetail}/>
            <Route path = '/CarLIst/:category' Component={CarList}/>
            <Route path = '/CarLIst/:category/:subcategory' Component={CarList}/>
            <Route path = '/CarUpdate' Component={CarUpdate}/>

            <Route path = '/LogIn' Component={LogIn}/>
            <Route path = '/MyPage' Component={MyPage}/>
            <Route path = '/MyInformation' Component={MyInformation}/>
            <Route path = '/Register' Component={Register}/>
            <Route path = '/ReviewCreate' Component={ReviewCreate}/>
            <Route path = '/ReviewDetail' Component={ReviewDetail}/>
            <Route path = '/ReviewList' Component={ReviewList}/>
            <Route path = '/UnRegister' Component={UnRegister}/>

            <Route path = '/PostCreate/:userId' Component={PostCreate}/>
            <Route path = '/PostDetail/:postId' element={<PostDetail/>}/>
            <Route path = "/PostList" element={<PostList initialContentType="contentType1" />} />
            <Route path = '/PostUpdate/:postId' element={<PostUpdate/>}/>

            <Route path = '/ProductCreate' Component={ProductCreate}/>
            <Route path = '/ProductDetail/:id' Component={ProductDetail}/>
            <Route path = '/ProductList/:category' Component={ProductList}/>
            <Route path = '/ProductList/:category/:subcategory' Component={ProductList}/>
            <Route path = '/ProductList/:category/:subcategory/:subsubcategory' Component={ProductList}/>
            <Route path = '/ProductUpdate' Component={ProductUpdate}/>

            <Route path = '/PropertyCreate' Component={PropertyCreate}/>
            <Route path = '/PropertyDetail' Component={PropertyDetail}/>
            <Route path = '/Propertylist' Component={Propertylist}/>
            <Route path = '/PropertyUpdate' Component={PropertyUpdate}/>
        </Routes>
        </BrowserRouter>
            
        </>
    );
};

export default CoffeeBeanApp;