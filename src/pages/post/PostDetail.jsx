import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import styles from '../../css/post/PostDetail.module.css';
import { FaSave, FaTimes } from 'react-icons/fa';

const PostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [post, setPost] = useState({
    postId: "",
    type: "",
    title: "",
    content: "",
    regDate: "",
    fileList: []
  });

  const [posts, setPosts] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [showFileList, setShowFileList] = useState(false);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:8088/post/detail/${postId}`
    })
      .then(response => {
        const { data } = response;
        setPost(data);

        axios({
          method: "get",
          url: "http://localhost:8088/post/list"
        })
          .then(res => {
            const allPosts = res.data;
            setPosts(allPosts);

            const currentIndex = allPosts.findIndex(post => post.postId.toString() === postId);

            if (currentIndex > 0) {
              setPrevPost(allPosts[currentIndex - 1]);
            } else {
              setPrevPost(null);
            }

            if (currentIndex < allPosts.length - 1) {
              setNextPost(allPosts[currentIndex + 1]);
            } else {
              setNextPost(null);
            }
          })
          .catch(error => {
            console.error('Error fetching post list:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching post details:', error);
        window.alert('로드 실패');
      });
  }, [postId]);

  const deletePost = () => {
    if (!window.confirm('삭제하시겠습니까?')) return;

    axios({
      method: "delete",
      url: `http://localhost:8088/post/delete/${postId}`,
    })
      .then(response => {
        if (response.data === 1) {
          navigate('/PostList');
        } else {
          window.alert("삭제 실패");
        }
      })
      .catch(error => {
        console.error('에러: ', error);
        window.alert("네트워크 에러 또는 서버 문제 발생");
      });
  };

  return (
    <>
      <Header />

      <div className={styles.postdetailBody}>
        <h1 className={styles.postdetailTitle}>콘텐츠</h1>
        <hr />
        <div className={styles.postList}>
          <Link to='/PostList?contentType=contentType1'>커피빈 소식</Link>
          <Link to='/PostList?contentType=contentType2'>중고거래 팁</Link>
          <Link to='/PostList?contentType=contentType3'>사기예방</Link>
        </div>
        <hr />
      </div>

      <div className={styles.postContainer}>
        <div className={styles.postHeader}>
          <div>
            <p className={styles.postType}><Link
              to={`/PostList?contentType=${post.type === '커피빈 소식'
                  ? 'contentType1'
                  : post.type === '중고거래 팁'
                    ? 'contentType2'
                    : post.type === '사기예방'
                      ? 'contentType3'
                      : ''
                }`}
                className={styles.typeLink}>{post.type}</Link></p>
            <h2 className={styles.postTitle}><strong>{post.title}</strong></h2>
          </div>
          <p className={styles.postDate}>{new Date(post.regDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className={styles.postContent}>{post.content}</p>
        </div>
        <div className={styles.imageContainer}>
          {post.fileList && post.fileList.length > 0 && post.fileList.map(file => (
            <img key={file.attachmentId} src={file.source} alt={file.filename} className={styles.imagePreview} />
          ))}
          <FaSave
            className={styles.saveIcon}
            onClick={() => setShowFileList(!showFileList)}
            title="첨부파일 보기"
          />
          {showFileList && (
            <div className={styles.fileListPopup}>
              <div className={styles.fileListHeader}>
                <span>사진 다운로드</span>
                <FaTimes
                  className={styles.closeIcon}
                  onClick={() => setShowFileList(false)}
                />
              </div>
              <ul className="list-group mb-1">
                {post.fileList && post.fileList.length > 0 ? (
                  post.fileList.map(file => (
                    <li className="list-group-item" key={file.attachmentId}>
                      <a href={file.source} target="_blank" rel="noopener noreferrer">
                        {file.filename}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">첨부파일이 없습니다.</li>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className={styles.navigationButtons}>
          <button className={styles.deleteButton} onClick={deletePost}>삭제</button>
          <button className={styles.editButton} onClick={() => navigate(`/PostUpdate/${postId}`)}>수정</button>
          <button className={styles.backButton} onClick={() => navigate('/PostList')}>목록으로 돌아가기</button>
        </div>
        <div className={styles.bottomNavButtons}>
          {prevPost ? (
            <Link to={`/PostDetail/${prevPost.postId}`} className={styles.navButton}>이전 글</Link>
          ) : (
            <button className={styles.disabledNavButton} disabled>이전 글</button>
          )}
          {nextPost ? (
            <Link to={`/PostDetail/${nextPost.postId}`} className={styles.navButton}>다음 글</Link>
          ) : (
            <button className={styles.disabledNavButton} disabled>다음 글</button>
          )}
        </div>
      </div>
      <br /><br />
      <Footer />
    </>
  );
};

export default PostDetail;
