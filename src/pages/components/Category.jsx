import React, { useState } from 'react';
import '../../css/components/Category.css';
import { Link } from 'react-router-dom';

const Category = () => {
    const [active, setActive] = useState(false); // 카테고리 전체 상태
    const [activeSubcategory, setActiveSubcategory] = useState(null); // 현재 활성화된 서브카테고리


    const categories = {
        "패션의류": ["여성의류", "남성의류"],
        "모바일/태블릿": ["스마트폰", "태블릿PC", "케이스/거치대/보호필름", "배터리/충전기/케이블"],
        "가구/인테리어": ["침실가구", "거실가구", "주방가구", "기타가구"],
        "반려동물/취미": ["반려동물", "키덜트", "핸드메이드/DIY", "악기"],
        "티켓/쿠폰": ["티켓", "상품권/쿠폰"]
    };

    const subcategories = {
        "여성의류": ["티셔츠/캐주얼의류", "니트/스웨터/가디건", "정장/원피스", "블라우스/셔츠/남방", "조끼/베스트", "바지/팬츠/청바지", "스커트/치마", "자켓/코트", "패딩/야상/점퍼", "트레이닝복", "언더웨어/잠옷", "파티복/드레스/기타"],
        "남성의류": ["티셔츠/캐주얼의류", "니트/스웨터/가디건", "정장", "조끼/베스트", "셔츠/남방", "바지/팬츠/청바지", "자켓/코트", "패딩/야상/점퍼", "트레이닝복", "언더웨어/잠옷", "테마의상/기타"],
        "스마트폰": ["삼성", "애플", "LG", "기타 제조사"],
        "태블릿PC": ["삼성", "애플", "기타 제조사"],
        "케이스/거치대/보호필름": [],
        "배터리/충전기/케이블": [],
        "침실가구": ["침대/매트리스", "서랍장/옷장", "화장대/협탁/거울"],
        "거실가구": ["소파", "거실테이블/의자", "거실장/장식장"],
        "주방가구": ["식탁/식탁의자", "렌지대/수납장", "기타 주방가구"],
        "기타가구": [],
        "반려동물": ["강아지용품", "고양이용품", "관상어용품", "기타반려동물 용품"],
        "키덜트": ["피규어/브릭", "프라모델", "레고/조립/블록", "무선조종/드론/헬리캠"],
        "핸드메이드/DIY": ["자수/뜨개질", "뷰티/아로마/캔들", "아트북/스크랩북", "DIY/공예"],
        "악기": ["건반악기", "현악기", "관악기/타악기"],
        "티켓": ["콘서트", "스포츠", "뮤지컬/연극/클래식"],
        "상품권/쿠폰": ["백화점/마트/편의점", "영화/문화/게임", "외식/주유"]
    };

    const handleMouseEnter = () => setActive(true);
    const handleMouseLeave = () => setActive(false);

    const handleSubcategoryMouseEnter = (subcategory) => setActiveSubcategory(subcategory);
    const handleSubcategoryMouseLeave = () => setActiveSubcategory(null);

    return (
        <div className='category' onMouseLeave={handleMouseLeave}>
            <div
                className='category-button'
                onMouseEnter={handleMouseEnter}
            >
                중고물품
            </div>
            {active && (
                <div className='dropdown-content' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {Object.keys(categories).map((category) => (
                        <div className='dropdown-section' key={category}>
                            {/* 카테고리1 */}
                            <h4 className='dropdown-title'>
                                <Link to={`/ProductList/${encodeURIComponent(category)}`}>{category}</Link>
                            </h4>
                            {/* 카테고리2 */}
                            <div className='dropdown-submenu'>
                                <ul>
                                    {categories[category].map((subcategory) => (
                                        <li
                                            key={subcategory}
                                            onMouseEnter={() => handleSubcategoryMouseEnter(subcategory)}
                                            onMouseLeave={handleSubcategoryMouseLeave}
                                        >
                                            <Link to={`/ProductList/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`}>
                                                {subcategory}
                                            </Link>
                                            {/* 카태고리3 */}
                                            {activeSubcategory === subcategory && subcategories[subcategory] && subcategories[subcategory].length > 0 && (
                                                <div className='dropdown-submenu-3'>
                                                    <ul>
                                                        {subcategories[subcategory].map((subsubcategory) => (
                                                            <li key={subsubcategory}>
                                                                <Link to={`/ProductList/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}/${encodeURIComponent(subsubcategory)}`}>
                                                                    {subsubcategory}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Category;
