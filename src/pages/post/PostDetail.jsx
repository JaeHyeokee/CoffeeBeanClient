import React, { useState } from 'react';
import Header from '../components/Header';
import '../../css/post/PostDetail.css'
import { Link, useLocation, useParams } from 'react-router-dom';

const PostDetail = ({ initialContentType }) => {

    const { id } = useParams();

    const location = useLocation(); //현재 URL 정보
    const queryParams = new URLSearchParams(location.search); //쿼리 문자열을 URLSearchParams 객체로 변환
    const contentType = queryParams.get('contentType') || initialContentType; //contentType 파라미터 가져오거나 initialContentType 사용하기
                        
    const [selectedContentType, setSelectedContentType] = useState(contentType); //선택한 콘텐츠 상태

    const posts = [
        {id:1, title: '중고나라 카페 채팅방 이용시 주의사항', content:'안녕하세요, 중고나라입니다.카페 채팅방은 중고거래 및 중고나라 서비스에 대해 자유롭게 이야기를 나눌 수 있는 공간입니다.회원분들이 안전하고 쾌적한 채팅 이용을 할 수 있도록 주의 사항을 안내드립니다.■ 주의사항- 자신 또는 타인의 영리 활동을 목적으로하는 내용을 게시하는 행위- 동일하거나 유사한 내용의 정보를 반복적으로 게시하는 도배 행위- 욕설 및 비방 등 다른 이용자에게 불쾌감을 줄 수 있는 행위- URL 등을 통해 채팅 참여자를 중고나라 외 공간으로 유도하는 행위이를 위반한 경우 채팅방 참여에 제한이 있을 수 있으니 참고 부탁드리겠습니다.중고나라는 회원분들의 원활한 중고나라 카페 이용을 위해 최선을 다하겠습니다.감사합니다.'},
        {id:2, title: '회원등급 개편안내', content:'상세내용~~~'},
        {id:3, title: '중고나라 시세 알아보기', content:'상세내용~~~'},
        {id:4, title: '무료나눔 이용가이드', content:'상세내용~~~'},
        {id:5, title: '사기꾼 예방하는 7가지 방법', content:'상세내용~~~'}
    ];

    const post = posts.find(post => post.id === parseInt(id));

    return (
        <>
          <Header/> 
          <div className='postdetail-body'>
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
          <div className='postdetail-body'>
            <div className='postdetail-title'>{post.title}</div>
            <div className='postdetail-content'>{post.content}</div>
          </div>
          </div>

        </>
    );
};

export default PostDetail;