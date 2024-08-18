import React, { useContext, useEffect, useState } from 'react';
import Style from '../../css/components/Header.module.css';
import SearchIcon from '../../image/SearchIcon.svg';
import chat from '../../image/ChatIcon.svg';
import my from '../../image/MyIcon.svg';
import sale from '../../image/SaleIcon.svg';
import x from '../../image/x.svg';
import { Link } from 'react-router-dom';
import ChatList from '../chatting/ChatList';
import Chat from '../chatting/Chat';
import Category from './Category';
import CarCategory from './CarCategory';
import { Form, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { LoginContext } from '../../contexts/LoginContextProvider';

const Header = () => {

    //상태관리
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [isSaleMenuOpen, setIsSaleMenuOpen] = useState(false);
    const [isMyMenuOpen, setIsMyMenuOpen] = useState(false);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null); // 선택된 채팅방 상태

    const {isLogin, logout, userInfo } = useContext(LoginContext);
    const userId = userInfo ? userInfo.userId : null;

    // 사이드바 스크롤관리 (채팅하기 눌렀을때)
    /* useEffect(() => {
        if (isChatSidebarOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isChatSidebarOpen]); */

    //메뉴 열고 닫는 토글
    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
        if (isSaleMenuOpen) setIsMyMenuOpen(false);
        if (isMyMenuOpen) setIsMyMenuOpen(false);
    }

    // 채팅방 선택 함수
    const handleSelectChatRoom = (chatRoomId) => {
        setSelectedChatRoomId(chatRoomId);
    };

    // 뒤로가기 함수
    const handleBackToChatList = () => {
        setSelectedChatRoomId(null);
    };

    return (
        <>
            <header>
                <div className={Style.headerTop}>
                    <Link to='/'>
                        <img src='https://via.placeholder.com/200x50' className={Style.logo} alt='로고' />
                    </Link>
                    <Form type='text' className={Style.search}>
                        <img className={Style.searchIcon} src={SearchIcon} alt=''/>
                        <input className={Style.searchInput} placeholder='어떤 상품을 찾으시나요? 키워드를 검색하세요!'/>
                        <Form.Select className={Style.searchSelect}>
                            <option value='product'>중고물품</option>
                            <option value='car'>중고차</option>
                        </Form.Select>
                    </Form>
                    <nav className={Style.nav}>
                        {/* 채팅하기 */}
                        <div className={Style.navBarTop}>
                            <button className={Style.navItem} onClick={toggleChatSidebar}>
                                <img src={chat} alt="아이콘" />&nbsp;채팅하기
                            </button>
                        </div>

                        {/* 판매하기 */}
                        <Navbar className={Style.navBarTop}>
                            <img src={sale} alt="아이콘" />
                            <NavDropdown title="&nbsp;판매하기" id="basic-nav-dropdown" className={Style.dropdownMenu}>
                                <NavDropdown.Item className={Style.dropdownMenuTab} as={Link} to={`/ProductCreate/${userId}`}>중고물품</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item className={Style.dropdownMenuTab} href={`/CarCreate/${userId}`}>중고차</NavDropdown.Item>
                            </NavDropdown>
                        </Navbar>
                        
                        { !isLogin ?
                            // 로그인
                            <div className={Style.navBarTop}>
                                <a className={Style.navItem} href="/Login">
                                    <img src={my} alt="아이콘" />&nbsp;로그인
                                </a>
                            </div>
                            :
                            // 마이
                            <Navbar className={Style.navBarTop}>
                                <img src={my} alt="아이콘" />
                                <NavDropdown title={'\u00A0' + userInfo.userName} id="basic-nav-dropdown" className={Style.dropdownMenu}>
                                    <NavDropdown.Item className={Style.dropdownMenuTab} href="/MyPage">마이페이지</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item className={Style.dropdownMenuTab} onClick={ () => logout() }>로그아웃
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Navbar>
                        }
                    </nav>
                </div>


                <div className={Style.navBarBottom}>
                    <Category />
                    <CarCategory />
                    <Link className={Style.navBarBottomLink} to='/PostList'>게시판</Link>
                </div>

                {isChatSidebarOpen && (
                    <>
                        <div className={`${Style.overlay} ${isChatSidebarOpen ? Style.overlayActive : ''}`} onClick={toggleChatSidebar}/>
                        <div className={`${Style.chatSidebar} ${isChatSidebarOpen ? Style.chatSidebarOpen : ''}`}>
                            <button className={Style.closeButton} onClick={toggleChatSidebar}> <img src={x} alt='x' height={25} width={25} /> </button>
                            {!selectedChatRoomId ? (
                                <ChatList onSelectChatRoom={handleSelectChatRoom} />
                            ) : (
                                <Chat chatRoomId={selectedChatRoomId} onBack={handleBackToChatList} />
                            )}
                        </div>
                    </>
                )}
            </header>
        </>
    );
};
export default Header;