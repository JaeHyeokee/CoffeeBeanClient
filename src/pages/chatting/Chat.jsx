import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import '../../css/chatting/Chat.css';
import TextareaAutosize from 'react-textarea-autosize';
import { LoginContext } from '../../contexts/LoginContextProvider';

const Chat = ({ chatRoomId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isJoin, setIsJoin] = useState(null); // 상태를 추가하여 isJoin 값을 저장
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    const { userInfo } = useContext(LoginContext);
    const userId = userInfo.userId;

    // 서버에서 isJoin 값을 가져옴
    useEffect(() => {
        const fetchIsJoin = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/api/leave/${chatRoomId}`);
                setIsJoin(response.data);
            } catch (error) {
                console.error("isJoin 값을 가져오는 중 오류 발생:", error);
            }
        };

        if (chatRoomId) {
            fetchIsJoin();
        }
    }, [chatRoomId]);

    useEffect(() => {
        if (!chatRoomId || !userId) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/api/messages/${chatRoomId}`);
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                } else {
                    console.error("배열을 예상했지만 다음을 받음:", response.data);
                }
            } catch (error) {
                console.error("메시지를 가져오는 중 오류 발생!", error);
                setMessages([]);
            }
        };

        fetchMessages();

        // WebSocket 연결
        const socket = new SockJS('http://localhost:8088/ws');
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect({}, (frame) => {
            console.log('연결됨: ' + frame);
            setIsConnected(true);
            stompClient.current.subscribe(`/topic/public/${chatRoomId}`, (message) => {
                showMessage(JSON.parse(message.body));
            });
        }, (error) => {
            console.error('STOMP 오류: ' + error);
            setIsConnected(false);
        });

        // 메시지를 읽음으로 표시
        const markMessagesAsRead = async () => {
            try {
                await axios.post(`http://localhost:8088/api/messages/read/${chatRoomId}/${userId}`);
                console.log('메시지가 읽음으로 표시되었습니다');
            } catch (error) {
                console.error('메시지를 읽음으로 표시하는 중 오류 발생:', error);
            }
        };
        markMessagesAsRead();

        return () => {
            if (stompClient.current !== null) {
                stompClient.current.disconnect(() => {
                    console.log('연결 해제됨');
                    setIsConnected(false);
                });
            }
        };
    }, [chatRoomId, userId]);

    // 새로운 메시지 표시
    const showMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    // 새로운 메시지 전송
    const sendMessage = () => {
        if (isConnected && messageInput.trim() !== '') {
            const chatMessage = {
                sender: { userId: parseInt(userId, 10) },
                chatRoomId: chatRoomId,
                messageText: messageInput
            };
            stompClient.current.send(
                `/app/sendMessage/${chatRoomId}`,
                {},
                JSON.stringify(chatMessage)
            );
            setMessageInput('');
        } else {
            console.error('메시지를 전송할 수 없음, STOMP 클라이언트가 연결되지 않았습니다.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 메시지 삭제
    const handleDelete = async (messageId, sendTime) => {
        const currentTime = new Date().getTime();
        const messageTime = new Date(sendTime).getTime();
    
        const isConfirmed = window.confirm('삭제하시겠습니까?');
        
        if (!isConfirmed) {
            return;
        }
        
        if ((currentTime - messageTime) <= 60000) {
            const response = await axios.delete(`http://localhost:8088/api/messages/${messageId}`);
            if (response.status === 200) {
                setMessages(prevMessages => prevMessages.filter(message => message.messageId !== messageId));
                window.alert("메시지가 삭제되었습니다.");
            }
        } else {
            window.alert('메시지를 작성한 지 1분 이상 경과하였습니다.');
        }
    };

    // 메시지 시간 포맷팅
    const formatTime = (dateTime) => {
        const date = new Date(dateTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${ampm} ${formattedHours}:${formattedMinutes}`;
    };

    const joinMessage = (isJoin) => {
        if ({isJoin} == 1) {
            return "상대방이 채팅방을 나갔습니다.";
        }
        return null;
    }

    // 채팅이 업데이트되거나 처음 렌더링될 때 가장 최근 채팅으로 스크롤
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <h3 className='chatHeader'>
                <button className="backBtn" onClick={onBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                        <path stroke="#141313" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m12.5 19.5-8.075-7.125a.5.5 0 0 1 0-.75L12.5 4.5"></path>
                    </svg>
                </button>
                채팅방 {chatRoomId} / 유저id: {userId} / Join: {isJoin}
            </h3>
            <div className='productPicture'>
                상품 사진 및 금액(정보)
            </div>
            <div className={`messages ${isJoin === 1 ? 'gray-background' : ''}`}>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender.userId === parseInt(userId, 10) ? 'own-message1' : 'own-message2'}`}>
                        {message.sender.userId === parseInt(userId, 10) ? (
                            <>
                                <div className='me'>
                                    <div className='isRead1'>{message.isRead ? '' : '안읽음'}</div>
                                    <div className='sendTime1'>{formatTime(message.sendTime)}</div>
                                </div>
                                <div className='messageText'>{message.messageText}</div>
                                <button className='messageDelete' onClick={() => handleDelete(message.messageId, message.sendTime)}>x</button>
                            </>
                        ) : (
                            <>
                                <div className='messageText'>{message.messageText}</div>
                                <div className='me'>
                                    <div className='isRead2'>{message.isRead ? '' : '안읽음'}</div>
                                    <div className='sendTime2'>{formatTime(message.sendTime)}</div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
                <div className='joinDiv'>    
                    {isJoin === 1 && (
                        <div className="joinMessage1">상대방이 채팅방을 나갔습니다
                            <div className='joinMessage2'>(채팅방이 비활성화됩니다)</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="message-input">
                <TextareaAutosize
                    className='textarea'
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요"
                    minRows={1}
                    maxRows={5}
                    disabled={isJoin === 1} // isJoin이 1이면 textarea 비활성화
                />
                <button className='sendBtn' onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
};

export default Chat;
