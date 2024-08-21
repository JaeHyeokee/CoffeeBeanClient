import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import '../../css/post/PostList.css'
import { Link, useLocation } from 'react-router-dom';
import PostItem from '../components/PostItem';
import axios from 'axios';
import Footer from '../components/Footer';
import { SERVER_HOST } from '../../apis/Api';
import { LoginContext } from '../../contexts/LoginContextProvider';

const PostList = ({ initialContentType }) => {
    const location = useLocation(); //현재 URL 정보
    const queryParams = new URLSearchParams(location.search); //쿼리 문자열을 URLSearchParams 객체로 변환
    const contentType = queryParams.get('contentType') || initialContentType; //contentType 파라미터 가져오거나 initialContentType 사용하기

    const [selectedContentType, setSelectedContentType] = useState(contentType); //선택한 콘텐츠 상태

    const [posts, setPosts] = useState([]);

    const userId = 1;       // Token 가능하면 수정

    const { roles } = useContext(LoginContext);

    const contentTypeMapping = {
        contentType1: '커피빈 소식',
        contentType2: '중고거래 팁',
        contentType3: '사기예방'
    };

    useEffect(() => {
        axios({
            method: "get",
            url: `http://${SERVER_HOST}/post/list`
        })
            .then(response => {
                const { data, status, statusText } = response;
                console.log(data);
                setPosts(data.filter(post => post.type === contentTypeMapping[selectedContentType]));
            })
    }, [selectedContentType]);

    // const posts = contentList[selectedContentType] || [];   //해당 콘텐츠 

    return (
        <>
            <Header />
            <div className='postlist-body'>
                <h1>콘텐츠</h1>
                <hr />
                <div className='post-list'>
                    <Link to='/PostList?contentType=contentType1' className={selectedContentType === 'contentType1' ? 'active-link' : ''}
                        onClick={() => setSelectedContentType('contentType1')} >커피빈 소식</Link>
                    <Link to='/PostList?contentType=contentType2' className={selectedContentType === 'contentType2' ? 'active-link' : ''}
                        onClick={() => setSelectedContentType('contentType2')}>중고거래 팁</Link>
                    <Link to='/PostList?contentType=contentType3' className={selectedContentType === 'contentType3' ? 'active-link' : ''}
                        onClick={() => setSelectedContentType('contentType3')}>사기예방</Link>
                </div>
                <div className='post-title'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <p key={post.postId}>
                                <Link to={`/PostDetail/${post.postId}`} >
                                    {post.title}
                                    <hr />
                                </Link>
                            </p>
                        ))
                    ) : (
                        <p>해당 카테고리에 대한 게시물이 없습니다.</p>
                    )}
                </div>
                {roles?.isAdmin && (
                    <>
                    <Link to={`/PostCreate/${userId}`}>게시물 작성하기</Link>                    
                    </>
                )}
               
            </div>
            <Footer />
        </>
    );
};

export default PostList;
