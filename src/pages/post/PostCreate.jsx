import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { Form, Button, Col, Row } from 'react-bootstrap';
import Footer from '../components/Footer';
import styles from '../../css/post/PostCreate.module.css';
import { FaPlus } from 'react-icons/fa';
import { SERVER_HOST } from '../../apis/Api';

const PostCreate = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [post, setPost] = useState({
        type: "",
        title: "",
        content: "",
        files: [],
    });

    const changeValue = (e) => {
        setPost({
            ...post,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file: file,
            name: file.name,
            id: URL.createObjectURL(file)
        }));

        setPost(prevPost => ({
            ...prevPost,
            files: [...prevPost.files, ...newFiles]
        }));
    };

    const handleFileRemove = (fileId) => {
        setPost(prevPost => ({
            ...prevPost,
            files: prevPost.files.filter(file => file.id !== fileId)
        }));
    };

    const validate = () => {
        if (!post.type) {
            window.alert('게시물 유형을 선택해 주세요.');
            return false;
        } else if (!post.title) {
            window.alert('제목은 필수입니다.');
            return false;
        }
        // } else if (!post.content) {
        //     window.alert('내용은 한 글자 이상 작성해 주세요.');
        //     return false;
        // }
        return true;
    };

    const submitPost = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const formData = new FormData();
        formData.append('type', post.type);
        formData.append('title', post.title);
        formData.append('content', post.content);

        if (post.files.length > 0) {
            post.files.forEach((file) => {
                formData.append('files', file.file);
            });
        } else {
            formData.append('files', new Blob([]));
        }

        axios({
            method: 'post',
            url: `http://${SERVER_HOST}/post/write/${userId}`,
            headers: {
                "Content-Type": 'multipart/form-data',
            },
            data: formData
        })
            .then(response => {
                const { data, status } = response;
                if (status === 201) {
                    window.alert('등록 완료');
                    navigate(`/PostDetail/${data}`);
                } else {
                    window.alert('등록 실패');
                }
            })
            .catch(error => {
                console.error('Failed to submit post', error);
                window.alert('최소 한 장의 첨부파일은 필수입니다.');
            });
    };

    return (
        <>
            <Header />
            <div className={styles.postCreateBody}>
                <h1 className={styles.postCreateTitle}>콘텐츠</h1>
                <hr className={styles.divider} />
                <div className={styles.postList}>
                    <Link to='/PostList?contentType=contentType1'>커피빈 소식</Link>
                    <Link to='/PostList?contentType=contentType2'>중고거래 팁</Link>
                    <Link to='/PostList?contentType=contentType3'>사기예방</Link>
                </div>
                <hr className={styles.divider} />
                <br/><br/>
                <div className={styles.mainContainer}>
                    <div className={styles.categoryContainer}>
                        <h3>Category</h3>
                        <ul className={styles.categoryList}>
                            <li className={post.type === '커피빈 소식' ? styles.activeCategory : ''} onClick={() => setPost({ ...post, type: '커피빈 소식' })}>
                                소식
                            </li>
                            <li className={post.type === '중고거래 팁' ? styles.activeCategory : ''} onClick={() => setPost({ ...post, type: '중고거래 팁' })}>
                                중고거래 팁
                            </li>
                            <li className={post.type === '사기예방' ? styles.activeCategory : ''} onClick={() => setPost({ ...post, type: '사기예방' })}>
                                사기 예방
                            </li>
                        </ul>
                    </div>
                    <div className={styles.formContainer}>
                        <Form onSubmit={submitPost}>
                            <Form.Group className={styles.inputGroup}>
                                <Form.Control
                                    type="text"
                                    placeholder="제목을 입력해주세요."
                                    name="title"
                                    value={post.title}
                                    onChange={changeValue}
                                    className={styles.inputTitle}
                                />
                            </Form.Group>
                            <Form.Group className={styles.inputGroup}>
                                <Form.Control
                                    as="textarea"
                                    rows={8}
                                    placeholder="내용을 입력해주세요."
                                    name="content"
                                    value={post.content}
                                    onChange={changeValue}
                                    className={styles.inputContent}
                                />
                            </Form.Group>
                            <div className={styles.fileUploadContainer}>
                                <label htmlFor="file-upload" className={styles.fileUploadLabel}>
                                    <FaPlus className={styles.plusIcon} />
                                </label>
                                <Form.Control
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <div className={styles.imagePreviewContainer}>
                                    {post.files && post.files.length > 0 && post.files.map(file => (
                                        <div key={file.id} className={styles.imageWrapper}>
                                            <img src={file.id} alt={file.name} className={styles.imagePreview} />
                                            <Button onClick={() => handleFileRemove(file.id)} className={styles.removeButton}>
                                                삭제
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" className={styles.submitButton}>등록</Button>
                        </Form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PostCreate;
