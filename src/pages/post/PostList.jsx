import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import styles from '../../css/post/PostList.module.css';

const PostList = ({ initialContentType }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const contentType = queryParams.get('contentType') || initialContentType;
    const [selectedContentType, setSelectedContentType] = useState(contentType); //선택한 콘텐츠 상태
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const [pageRange, setPageRange] = useState([1, 10]);

    const userId = 1;

    const contentTypeMapping = {
        contentType1: '커피빈 소식',
        contentType2: '중고거래 팁',
        contentType3: '사기예방'
    };

    useEffect(() => {
        axios({
            method: "get",
            url: "http://localhost:8088/post/list"
        })
        .then(response => {
            const { data } = response;
            setPosts(data.filter(post => post.type === contentTypeMapping[selectedContentType]));
        });
    }, [selectedContentType]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);

        if (pageNumber > pageRange[1]) {
            setPageRange([pageRange[0] + 10, pageRange[1] + 10]);
        } else if (pageNumber < pageRange[0]) {
            setPageRange([pageRange[0] - 10, pageRange[1] - 10]);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const startPage = pageRange[0];
    const endPage = Math.min(pageRange[1], totalPages);

    return (
        <>
        <Header/>
        <div className={styles.postlistBody}>
        <h1 className={styles.postListTitle}>콘텐츠</h1>
            <hr/>
            <div className={styles.postList}>
                <Link 
                    to='/PostList?contentType=contentType1' 
                    className={selectedContentType === 'contentType1' ? styles.activeLink : ''}
                    onClick={() => setSelectedContentType('contentType1')} >
                        커피빈 소식
                </Link>
                <Link 
                    to='/PostList?contentType=contentType2' 
                    className={selectedContentType === 'contentType2' ? styles.activeLink : ''}
                    onClick={() => setSelectedContentType('contentType2')}>
                        중고거래 팁
                </Link>
                <Link 
                    to='/PostList?contentType=contentType3' 
                    className={selectedContentType === 'contentType3' ? styles.activeLink : ''}
                    onClick={() => setSelectedContentType('contentType3')}>
                        사기예방
                </Link>
            </div>
            <hr/>
            <div className={styles.postTitle}>
                {currentPosts.length > 0 ? (
                    currentPosts.map((post) => (
                        <p key={post.postId}>
                            <Link to={`/PostDetail/${post.postId}`}>
                                {post.title}
                            <hr/>
                            </Link>
                        </p>
                    ))
                ) : (
                    <p>해당 카테고리에 대한 게시물이 없습니다.</p>
                )}
            </div>

            <div className={styles.pagination}>
                {startPage > 1 && (
                    <button
                        onClick={() => handlePageChange(startPage - 1)}
                        className={styles.pageButton}
                    >
                        이전
                    </button>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                    <button
                        key={startPage + index}
                        onClick={() => handlePageChange(startPage + index)}
                        className={startPage + index === currentPage ? styles.activePage : styles.pageButton}
                    >
                        {startPage + index}
                    </button>
                ))}
                {endPage < totalPages && (
                    <button
                        onClick={() => handlePageChange(endPage + 1)}
                        className={styles.pageButton}
                    >
                        다음
                    </button>
                )}
            </div>

            <Link to={`/PostCreate/${userId}`} className={styles.createPostButton}>게시물 작성하기</Link>
        </div>
        <Footer/>
        </>
    );
};

export default PostList;
