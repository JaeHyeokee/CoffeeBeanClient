import React, { useEffect, useState } from 'react';
import '../../css/components/Header.css';
import chat from '../../image/ChatIcon.svg';
import my from '../../image/MyIcon.svg';
import sale from '../../image/SaleIcon.svg';
import x from '../../image/x.svg';
import { Link } from 'react-router-dom';
import ChatDiv from '../chatting/ChatFrame';

const Header = () => {

    //상태관리
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [isSaleMenuOpen, setIsSaleMenuOpen] = useState(false);
    const [isMyMenuOpen, setIsMyMenuOpen] = useState(false);

    // 사이드바 스크롤관리 (채팅하기 눌렀을때)
    useEffect(() => {
        if (isChatSidebarOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => document.body.classList.remove('no-scroll');
    }, [isChatSidebarOpen]);

    //메뉴 열고 닫는 토글
    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);

        if(isSaleMenuOpen) setIsMyMenuOpen(false);
        if(isMyMenuOpen) setIsMyMenuOpen(false);
    }

    const toggleSaleMenu = () => {
        setIsSaleMenuOpen(!isSaleMenuOpen);

        if(isSaleMenuOpen) setIsMyMenuOpen(false);
        if(isChatSidebarOpen) setIsChatSidebarOpen(false);
    };

    const toggleMyMenu = () => {
        setIsMyMenuOpen(!isMyMenuOpen);

        if(isMyMenuOpen) setIsSaleMenuOpen(false);
        if(isChatSidebarOpen) setIsChatSidebarOpen(false);
    }


    return (
        <>
            <header>
                <div className='header-top'>
                    <Link to='/'>
                    <img src='https://via.placeholder.com/200x80' className='logo' alt='로고'/>
                    </Link>
                    <input type='text' className='search' placeholder='어떤 상품을 찾으시나요?'/>
                    <nav className="nav">
                        <div>
                            <button className="nav-item" onClick={toggleChatSidebar}>
                                <img src={chat} className="nav-icon" alt="아이콘"/>
                                채팅하기
                            </button>
                        </div>

                        <div>
                            <button className="nav-item" onClick={toggleSaleMenu}>
                                <img src={sale} className="nav-icon" alt="아이콘"/>
                                판매하기
                            </button>

                            {isSaleMenuOpen && (
                                <div className='dropdown-menu'>
                                    <Link to="/ProductCreate" className="nav-link">
                                        <button className='dropdown-button'>중고물품</button>
                                    </Link>
                                    <Link to="/PropertyCreate" className="nav-link">
                                        <button className='dropdown-button'>부동산</button>
                                    </Link>
                                    <Link to="/CarCreate" className="nav-link">
                                        <button className='dropdown-button'>중고차</button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div>
                            <button className="nav-item" onClick={toggleMyMenu}>
                                <img src={my} className="nav-icon" alt="아이콘"/>
                                마이
                            </button>

                            {isMyMenuOpen && (
                                <div className='dropdown-menu'>
                                    <Link to="/MyHome" className="nav-link">
                                        <button className='dropdown-button'>마이페이지</button>
                                    </Link>
                                    <button className='dropdown-button'>로그아웃</button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

            <div className='category'>
                <div className='category-menu'>
                    <button className='category-button'>카테고리</button>
                        <div className='dropdown-content'>
                            <div className='dropdown-section'>
                                <h4>카테고리1</h4>
                                <ul>
                                    <li>패션의류</li>
                                    <li>모바일/태블릿</li>
                                    <li>가구/인테리어</li>
                                    <li>반려동물/취미</li>
                                    <li>티켓/쿠폰</li>
                                </ul>
                            </div>
                            <div className='dropdown-section'>
                                <h4>카테고리2</h4>
                                <ul>
                                    <li>여성의류</li>
                                    <li>남성의류</li>
                                    <li>스마트폰</li>
                                    <li>태블릿PC</li>
                                    <li>케이스/거치대/보호필름</li>
                                    <li>배터리/충전기/케이블</li>
                                    <li>침실가구</li>
                                    <li>거실가구</li>
                                    <li>주방가구</li>
                                    <li>기타가구</li>
                                    <li>반려동물</li>
                                    <li>키덜트</li>
                                    <li>핸드메이드/DIY</li>
                                    <li>악기</li>
                                    <li>티켓</li>
                                    <li>상품권/쿠폰</li>
                                </ul>
                            </div>
                        </div>
                </div>
                    <Link to='/Propertylist'>
                        <button className='property-button'>부동산</button>
                    </Link>
                    <Link to='/PostList'>
                        <button className='post-button'>게시판</button>
                    </Link>
            </div>

                            {/* 사이드바 */}
                            {isChatSidebarOpen && (
                                <>
                                    <div className={`overlay ${isChatSidebarOpen ? 'active' : ''}`} onClick={toggleChatSidebar} /> {/* 채팅 사이드바 나왔을때 뒷 배경 반투명하게 */}
                                    <div className={`chat-sidebar ${isChatSidebarOpen ? 'open' : ''}`}>
                                        <button className='close-button' onClick={toggleChatSidebar}><img src={x} alt='x' height={25} width={25}/></button> {/* 사이드바 닫기 버튼 */}
                                        <ChatDiv />
                                    </div>
                                </>
                            )}
            </header>
        </>
    );
};

export default Header;