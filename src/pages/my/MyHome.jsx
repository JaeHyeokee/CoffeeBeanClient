import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import '../../css/my/MyHome.css';

const MyHome = () => {
    return (
        <section className='myhome-info'>
            <img className='myhome-profile-img' src='https://img2.joongna.com/common/Profile/Default/profile_f.png' alt='프로필'/>
            <div className='myhome-profile-content'>
                <div>
                    <span className='nickname-print'>HelloKitty</span>
                    <p className='oneline-intro'>안녕하세요! 키티에요~</p>
                </div>
                <div>
                    <div className='trust-index-info'>
                        <div className='my-trust-index'>
                            <p className='my-trust-index-label'>신뢰지수</p>
                            <p className='my-trust-index-figure'>550</p>
                        </div>
                        <p className='max-trust-index'>1,000</p>
                    </div>
                    <ProgressBar className='trust-index-bar' now={55.5}/>
                </div>
            </div>
        </section>
    );
};

export default MyHome;