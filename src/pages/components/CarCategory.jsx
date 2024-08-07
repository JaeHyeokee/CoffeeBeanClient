import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/components/CarCategory.css';

const CarCategory = () => {
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const carcategories = {
        "국산차": ["제네시스", "현대", "기아", "쉐보레", "르노코리아"],
        "수입차": ["벤츠", "BMW", "아우디", "테슬라", "포르쉐"]
    };

    const handleMainCategoryClick = (category) => {
        setSelectedMainCategory(category === selectedMainCategory ? null : category);
        setSelectedSubCategory(null); // 서브카테고리 초기화
    };

    const handleSubCategoryClick = (subCategory) => {
        setSelectedSubCategory(subCategory === selectedSubCategory ? null : subCategory);
    };

    return (
        <div className='car-category'>
            <button
                className='car-category-button'
                onClick={() => handleMainCategoryClick('중고차')}
            >
                중고차
            </button>

            {selectedMainCategory && (
                <div className='drop-content'>
                    {Object.keys(carcategories).map((category) => (
                        <div className='drop-section' key={category}>
                            <h4
                                className={`drop-title ${selectedMainCategory === category ? 'active' : ''}`}
                                onClick={() => handleMainCategoryClick(category)}
                            >
                                {category}
                            </h4>
                            {selectedMainCategory === category && (
                                <div className='drop-items'>
                                    {carcategories[category].map((subCategory) => (
                                        <Link
                                            key={subCategory}
                                            to={`/CarList/${encodeURIComponent(category)}/${encodeURIComponent(subCategory)}`}
                                            className={`drop-item ${selectedSubCategory === subCategory ? 'active' : ''}`}
                                            onClick={() => handleSubCategoryClick(subCategory)}
                                        >
                                            {subCategory}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default CarCategory;
