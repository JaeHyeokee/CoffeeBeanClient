import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import '../../css/post/PostDetail.css'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import { SERVER_HOST } from '../../apis/Api';
import { LoginContext } from '../../contexts/LoginContextProvider';

const PostDetail = () => {

  const navigate = useNavigate();
  const { postId } = useParams();
  const { roles } = useContext(LoginContext);

  const [post, setPost] = useState({
    postId: "",
    type: "",
    title: "",
    content: "",
    regDate: "",
    fileList: []
  });

  const userId = 1;       // Token 가능하면 수정

  const encodedFileName = encodeURIComponent(post.fileList.filename);
const imageUrl = `/upload/${encodedFileName}`;

  useEffect(() => {
    axios({
      method: "get",
      url: `http://${SERVER_HOST}/post/detail/` + postId
    })
      .then(response => {
        const { data, status } = response;
        if (status == 200) {
          setPost(data);
        } else {
          window.alert('로드 실패');
        }
      })
  }, [postId]);

  const deletePost = () => {
    if (!window.confirm('삭제하시겠습니까?')) return;

    axios({
      method: "delete",
      url: `http://${SERVER_HOST}/post/delete/${postId}`,
    })
      .then(response => {
        const { data, status, statusText } = response;
        if (data === 1) {
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

  // const post = posts.find(post => postId === parseInt(postId));

  return (
    <>
      <Header />
      <div className="container mt-3 mb-3">
        <div className="mb-3">
          <h3>{post.type}</h3>
          <h4><strong>{post.title}</strong></h4>
          <p><strong>등록일:</strong> {new Date(post.regDate).toLocaleDateString()}</p>
          <div>
            <h5>내용:</h5>
            <p>{post.content}</p>
          </div>
          <div className="container mt-3 mb-3 border rounded">
            <div className="mb-3 mt-3">
              <label>첨부파일:</label>
              {/* 첨부파일 이름 및 이미지 미리보기 */}
              <ul className="list-group mb-1">
                {post.fileList && post.fileList.length > 0 ? (
                  post.fileList.map(file => (
                    <li className="list-group-item" key={file.attachmentId}>
                      <a href={file.source} target="_blank" rel="noopener noreferrer">
                        {file.source}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">첨부파일이 없습니다.</li>
                )}
              </ul>
              {post.fileList && post.fileList.map(file => (
                  <img src={file.source}>
                  </img>
              ))}
            </div>
          </div>
          {roles?.isAdmin && (
            <>
            <button className="btn btn-danger" onClick={deletePost}>삭제</button>
            <button className="btn btn-secondary ms-2" onClick={() => navigate(`/PostUpdate/${postId}`)}>수정</button>
            </>
          )}
          <button className="btn btn-secondary ms-2" onClick={() => navigate('/PostList')}>목록으로 돌아가기</button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PostDetail;