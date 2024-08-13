import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { Form, Button } from 'react-bootstrap';


const PostCreate = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [post, setPost] = useState({
        type: "",
        title: "",
        content: "",
        files: []
    });

    const changeValue = (e) => {
        setPost({
            ...post,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setPost({ ...post, files: Array.from(e.target.files) });
    };

    const submitPost = async (e) => {
        e.preventDefault();      

        if (!validate()) return;

        const formData = new FormData();
        formData.append('type', post.type);
        formData.append('title', post.title);
        formData.append('content', post.content);
        post.files.forEach(file => formData.append('files', file));

        axios({
            method: 'post',
            url: 'http://localhost:8088/post/write/' + userId,
            headers: {
                "Content-Type": 'application/form-data',
            },
            data: formData
        })
            .then(response => {
                const { data, status, statusText } = response;
                if (status === 200) {
                    window.alert('등록 완료');
                    navigate('/PostList');
                } else {
                    window.alert('실패');
                }
            });

    };

    const validate = () => {
        if(!post.type){
            window.alert('게시물 유형을 선택해 주세요.')
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

    return (
        <>
            <Header />
            <Form onSubmit={submitPost}>
                <Form.Group className="mb-3">
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
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="제목을 입력하세요"
                        name="title"
                        value={post.title}
                        onChange={changeValue}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="내용을 입력하세요"
                        name="content"
                        value={post.content}
                        onChange={changeValue}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>첨부파일:</Form.Label>
                    <Form.Control
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </Form.Group>
                <div className="d-flex mb-3">
                    <Button variant="primary" type="submit" className="me-2">
                        작성완료
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/PostList')}>
                        목록
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default PostCreate;
