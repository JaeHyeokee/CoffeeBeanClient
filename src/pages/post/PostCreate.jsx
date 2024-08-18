import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { Form, Button, ListGroup, Col, Row } from 'react-bootstrap';
import Footer from '../components/Footer';

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
        } else if (!post.content) {
            window.alert('내용은 한 글자 이상 작성해 주세요.');
            return false;
        }
        return true;
    };

    const submitPost = async (e) => {
        e.preventDefault();
    
        if (!validate()) return;
    
        const formData = new FormData();
        formData.append('type', post.type);
        formData.append('title', post.title);
        formData.append('content', post.content);
    
        post.files.forEach((file) => {
            formData.append('files', file.file);
        });
    
        axios({
            method: 'post',
            url: `http://localhost:8088/post/write/${userId}`,
            headers: {
                "Content-Type": 'multipart/form-data',
            },
            data: formData
        })
        .then(response => {
            const { data, status, statusText } = response;
            if (status === 201) {
                window.alert('등록 완료');
                navigate(`/PostList`);
            } else {
                window.alert('등록 실패');
            }
        })
        .catch(error => {
            console.error('Failed to submit post', error);
            window.alert('실패');
        });
    };

    return (
        <>
            <Header />
            <div className="container mt-3 mb-3">
                <Form onSubmit={submitPost}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>Type:</Form.Label>
                        <Col sm={10}>
                            <Form.Select
                                name="type"
                                value={post.type}
                                onChange={changeValue}
                            >
                                <option value="">-- 게시물 유형을 선택해 주세요 --</option>
                                <option value="커피빈 소식">커피빈 소식</option>
                                <option value="중고거래 팁">중고거래 팁</option>
                                <option value="사기예방">사기예방</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>Title:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                type="text"
                                name="title"
                                value={post.title}
                                onChange={changeValue}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>Content:</Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                name="content"
                                value={post.content}
                                onChange={changeValue}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Attach files:</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <ListGroup>
                            {post.files.map(file => (
                                <ListGroup.Item key={file.id}>
                                    <Row>
                                        <Col>
                                            <span>{file.name}</span>
                                        </Col>
                                        <Col className="text-end">
                                            <Button
                                                variant="danger"
                                                onClick={() => handleFileRemove(file.id)}
                                            >
                                                삭제
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                    <Button variant="primary" type="submit" className="me-2">작성완료</Button>
                    <Button variant="secondary" onClick={() => navigate('/PostList')}>목록으로 돌아가기</Button>
                </Form>
            </div>
            <Footer/>
        </>
    );
};

export default PostCreate;
