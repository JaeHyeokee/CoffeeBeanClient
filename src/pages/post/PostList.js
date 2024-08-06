import React, { useState } from 'react';
import Header from '../components/Header';
import '../../css/post/PostList.css'
import { Link, useLocation } from 'react-router-dom';

const PostList = ({ initialContentType }) => {
    const location = useLocation(); //현재 URL 정보
    const queryParams = new URLSearchParams(location.search); //쿼리 문자열을 URLSearchParams 객체로 변환
    const contentType = queryParams.get('contentType') || initialContentType; //contentType 파라미터 가져오거나 initialContentType 사용하기
                        
    const [selectedContentType, setSelectedContentType] = useState(contentType); //선택한 콘텐츠 상태

    const contentList = {
        contentType1: [
            { id: 1, title: '중고나라 카페 채팅방 이용시 주의사항' },
            { id: 2, title: '회원등급 개편안내' }
        ],
        contentType2: [
            { id: 3, title: '중고나라 시세 알아보기' },
            { id: 4, title: '무료나눔 이용가이드' }
        ],
        contentType3: [
            { id: 5, title: '사기꾼 예방하는 7가지 방법' }
        ]
    };

    const posts = contentList[selectedContentType] || [];   //해당 콘텐츠 

    return (
        <>
        <Header/>
        <div className='postlist-body'>
            <h1>콘텐츠</h1>
            <hr/>
            <div className='post-list'>
                <Link to='/PostList?contentType=contentType1'className={selectedContentType === 'contentType1' ? 'active-link' : ''}
                    onClick={() => setSelectedContentType('contentType1')} >ㅇㅇ 소식</Link>
                <Link to='/PostList?contentType=contentType2'className={selectedContentType === 'contentType2' ? 'active-link' : ''}
                    onClick={() => setSelectedContentType('contentType2')}>중고거래 팁</Link>
                <Link to='/PostList?contentType=contentType3'className={selectedContentType === 'contentType3' ? 'active-link' : ''}
                    onClick={() => setSelectedContentType('contentType3')}>사기예방</Link>
            </div>
            <div className='post-title'>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <p key={post.id}>
                            <Link to={`/PostDetail/${post.id}`} > 
                            {post.title}
                            </Link>
                            </p>
                            
                    ))
                ) : (
                    <p>해당 카테고리에 대한 게시물이 없습니다.</p>
                )}
            </div>
        </div>
        </>
    );
};

export default PostList;
