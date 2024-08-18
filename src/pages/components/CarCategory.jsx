import React, { useState } from 'react';
import '../../css/components/CarCategory.css';
import { Link } from 'react-router-dom';

const CarCategory = () => {
    const [active, setActive] = useState(false); // Corrected state name
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const carcategories = {
        "국산차": ["현대", "제네시스", "기아", "쉐보레", "르노코리아(삼성)", "KG모빌리티(쌍용)"],
        "외제차": ["벤츠", "포르쉐", "BMW", "페라리", "롤스로이스", "벤틀리", "람보르기니", "테슬라", "랜드로버"]
    };

    const handleMouseEnter = () => setActive(true);
    const handleMouseLeave = () => setActive(false);

    const handleSubcategoryMouseEnter = (subcategory) => setSelectedSubCategory(subcategory);
    const handleSubcategoryMouseLeave = () => setSelectedSubCategory(null);

    return (
        <div className='car-category' onMouseLeave={handleMouseLeave}>
            <div
                className='car-category-button'
                onMouseEnter={handleMouseEnter}
            >
                중고차
            </div>

            {active && (
                <div className='drop-content'>
                    {Object.keys(carcategories).map((category) => (
                        <div className='drop-section' key={category}>
                            {/* 카테고리1 */}
                            <h4 className='drop-title'>
                                <Link to={`/CarList/${encodeURIComponent(category)}`}>
                                <div>
                                    {category}
                                </div>
                                </Link>
                            </h4>
                            {/* 카테고리2 */}
                            <div className='dropdown-submenu-car'>
                                <ul>
                                    {carcategories[category].map((subcategory) => (
                                        <li
                                            key={subcategory}
                                            onMouseEnter={() => handleSubcategoryMouseEnter(subcategory)}
                                            onMouseLeave={handleSubcategoryMouseLeave}
                                        >
                                            <Link to={`/CarList/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`}>
                                                <div>
                                                {subcategory}
                                                </div>
                                            </Link>
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

export default CarCategory;
