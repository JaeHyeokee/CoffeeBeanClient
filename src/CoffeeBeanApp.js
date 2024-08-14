import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MyPage from './pages/my/MyPage';
import MyInformation from './pages/my/MyInformation';
import Join from './pages/my/Join';
import LogIn from './pages/my/LogIn';
import Register from './pages/my/Register';
import ReviewCreate from './pages/my/ReviewCreate';
import ReviewDetail from './pages/my/ReviewDetail';
import ReviewList from './pages/my/ReviewList';
import UnRegister from './pages/my/UnRegister';
import UserManagement from './pages/admin/UserManagement';
import CarCreate from './pages/car/CarCreate';
import CarDetail from './pages/car/CarDetail';
import CarList from './pages/car/CarList';
import CarUpdate from './pages/car/CarUpdate';
import PostCreate from './pages/post/PostCreate';
import PostDetail from './pages/post/PostDetail';
import PostList from './pages/post/PostList';
import PostUpdate from './pages/post/PostUpdate';
import ProductCreate from './pages/product/ProductCreate';
import ProductDetail from './pages/product/ProductDetail';
import ProductList from './pages/product/ProductList';
import ProductUpdate from './pages/product/ProductUpdate';
import PropertyCreate from './pages/property/PropertyCreate';
import PropertyDetail from './pages/property/PropertyDetail';
import Propertylist from './pages/property/Propertylist';
import PropertyUpdate from './pages/property/PropertyUpdate';
import LoginContextProvider from './contexts/LoginContextProvider';
import MyDealList from './pages/my/MyDealList';
import ChatList from './pages/chatting/ChatList';
import Chat from './pages/chatting/Chat';

import 'bootstrap/dist/css/bootstrap.min.css';
import './CoffeeBeanApp.css';

const CoffeeBeanApp = () => {
    return (
        <>
        <BrowserRouter>
            <LoginContextProvider>
                <Routes>
                    <Route path = '/' Component = {Home}/>

                    <Route path = '/UserManagement' Component={UserManagement}/>
                    <Route path = '/UserManagement' Component={UserManagement}/>

                    <Route path='/Chat' Component={Chat} />
                    <Route path='/ChatList' Component={ChatList} />

                    <Route path = '/CarCreate' Component={CarCreate}/>
                    <Route path = '/CarDetail/:id' Component={CarDetail}/>
                    <Route path = '/CarLIst/:category' Component={CarList}/>
                    <Route path = '/CarLIst/:category/:subcategory' Component={CarList}/>
                    <Route path = '/CarUpdate' Component={CarUpdate}/>

                    <Route path = '/Login' Component={LogIn}/>
                    <Route path = '/MyPage' Component={MyPage}/>
                    <Route path = '/MyInformation' Component={MyInformation}/>
                    <Route path = '/Register' Component={Register}/>
                    <Route path = '/ReviewCreate' Component={ReviewCreate}/>
                    <Route path = '/ReviewDetail' Component={ReviewDetail}/>
                    <Route path = '/ReviewList' Component={ReviewList}/>
                    <Route path = '/MyDealList' Component={MyDealList}/>
                    <Route path = '/UnRegister' Component={UnRegister}/>

                    <Route path = '/PostCreate' Component={PostCreate}/>
                    <Route path = '/PostDetail/:id' Component={PostDetail}/>
                    <Route path = '/PostList' Component={PostList}/>
                    <Route path = '/PostUpdate' Component={PostUpdate}/>

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

                    <Route path = '/Join' Component={Join}/>
                </Routes>
            </LoginContextProvider>
        </BrowserRouter>
            
        </>
    );
};

export default CoffeeBeanApp;