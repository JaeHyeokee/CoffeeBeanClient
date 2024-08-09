import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import '../../css/chatting/Chat.css';
import TextareaAutosize from 'react-textarea-autosize';

const Chat = ({ chatRoomId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isJoin, setIsJoin] = useState(null); // 상태를 추가하여 isJoin 값을 저장
    const stompClient = useRef(null);
    const userId = localStorage.getItem('userId');

    // Fetch isJoin value from server
    useEffect(() => {
        const fetchIsJoin = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/api/leave/${chatRoomId}`);
                setIsJoin(response.data);
            } catch (error) {
                console.error("Error fetching isJoin value:", error);
            }
        };

        if (chatRoomId) {
            fetchIsJoin();
        }
    }, [chatRoomId]);

    // Debugging: log isJoin value
    // useEffect(() => {
    //     console.log('isJoin value:', isJoin);
    //     if (isJoin === 1) {
    //         showMessage({
    //             sender: { userId: null },
    //             messageText: "상대방이 채팅방을 나갔습니다.",
    //             sendTime: new Date().toISOString(),
    //             isRead: true,
    //             messageId: null
    //         });
    //     }
    // }, [isJoin]);

    // Fetch messages and set up WebSocket connection
    useEffect(() => {
        if (!chatRoomId || !userId) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8088/api/messages/${chatRoomId}`);
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                } else {
                    console.error("Expected array but received:", response.data);
                }
            } catch (error) {
                console.error("There was an error fetching the messages!", error);
                setMessages([]);
            }
        };

        fetchMessages();

        // WebSocket connection
        const socket = new SockJS('http://localhost:8088/ws');
        stompClient.current = Stomp.over(socket);

        stompClient.current.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            setIsConnected(true);
            stompClient.current.subscribe(`/topic/public/${chatRoomId}`, (message) => {
                showMessage(JSON.parse(message.body));
            });
        }, (error) => {
            console.error('STOMP Error: ' + error);
            setIsConnected(false);
        });

        // Mark messages as read
        const markMessagesAsRead = async () => {
            try {
                await axios.post(`http://localhost:8088/api/messages/read/${chatRoomId}/${userId}`);
                console.log('Messages marked as read');
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        };
        markMessagesAsRead();

        return () => {
            if (stompClient.current !== null) {
                stompClient.current.disconnect(() => {
                    console.log('Disconnected');
                    setIsConnected(false);
                });
            }
        };
    }, [chatRoomId, userId]);

    // Display new messages
    const showMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    // Send a new message
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
            console.error('Cannot send message, STOMP client is not connected.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Delete a message
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
                window.alert("메세지가 삭제되었습니다.");
            }
        } else {
            window.alert('메세지를 작성한지 1분 이상 경과하였습니다.');
        }
    };

    // Format message time
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
            <div className="messages">
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
                <div>    
                    {isJoin === 1 && (
                    <div className="joinMessage">상대방이 채팅방을 나갔습니다.</div>
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
                  placeholder="할 말 적으렴"
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
