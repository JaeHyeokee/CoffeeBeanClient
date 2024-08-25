import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import '../../css/chatting/Chat.css';
import TextareaAutosize from 'react-textarea-autosize';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { SERVER_HOST } from '../../apis/Api';
import ProductItem from '../components/ProductItem';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatRoomId, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [deleteStatus, setDeleteStatus] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [product, setProduct] = useState(null);
    const [isJoin, setIsJoin] = useState(null);
    const [chatRoomDetail, setChatRoomDetail] = useState({
        chatRoom: null,
        sellerId: null,
        sellerUserName: '',
        buyerUserName: '',
        sellerReliability: null,
        buyerReliability: null,
        unreadMessage: null
    });    
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const { userInfo } = useContext(LoginContext);
    const userId = userInfo ? userInfo.userId : null;

    useEffect(() => {
        const fetchIsJoin = async () => {
            if (userId && chatRoomId) {
                try {
                    const response = await axios.get(`http://${SERVER_HOST}/chatRooms/leave/${chatRoomId}/${userId}`);
                    console.log("isJoin 값 가져오기:", response.data); // isJoin 값을 가져옴
                    setIsJoin(response.data);
                } catch (error) {
                    console.error("isJoin 값을 가져오는 중 오류 발생:", error);
                }
            }
        };

        fetchIsJoin();
    }, [chatRoomId, userId]);

    useEffect(() => {
        if (!chatRoomId || !userId) return;

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://${SERVER_HOST}/api/messages/${chatRoomId}`);
                console.log('메시지 목록 가져오기:', response.data); // 메시지 목록을 가져옴
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

        const socket = new SockJS(`http://${SERVER_HOST}/ws`);
        stompClient.current = Stomp.over(socket);
        
        stompClient.current.connect({}, (frame) => {
            console.log('STOMP 연결됨: ' + frame);
            setIsConnected(true);

            stompClient.current.subscribe(`/topic/public/${chatRoomId}`, (message) => {
                // 구독경로 --> /topic/public/${chatRoomId}
                const receivedMessage = JSON.parse(message.body);
                console.log('실시간 message: ', receivedMessage);  // 메세지가 올 때 마다 console
                showMessage(receivedMessage);  // 받은 메세지 화면에 표시

                // 상대방의 메시지일 경우 읽음 상태 업데이트
                if (receivedMessage.sender.userId !== userId) {
                    markMessageAsRead(receivedMessage.messageId); // 특정 메시지의 읽음 상태만 업데이트
                }
            });
        }, (error) => {
            console.error('STOMP 오류: ' + error);
            setIsConnected(false);
        });
        
        return () => {
            if (stompClient.current !== null) {
                stompClient.current.disconnect(() => {
                    console.log('STOMP 연결 해제됨');
                    setIsConnected(false);
                });
            }
        };
    }, [chatRoomId, userId]);

    const showMessage = (message) => {
        if (message) {
            console.log('받은 메시지:', message); // STOMP를 통해 받은 메시지
            setMessages(prevMessages => [...prevMessages, message]);
        } else {
            console.error('유효하지 않은 메시지:', message);
        }
    };

    const markMessageAsRead = async (messageId) => {
        if (userId && chatRoomId) {
            try {
                await axios.post(`http://${SERVER_HOST}/api/messages/read/${chatRoomId}/${userId}`, { messageId });
                // 메시지 읽음 상태 업데이트
                setMessages(prevMessages => prevMessages.map(msg => 
                    msg.messageId === messageId ? { ...msg, isRead: true } : msg
                ));
            } catch (error) {
                console.error('메시지를 읽음으로 표시하는 중 오류 발생:', error);
            }
        }
    };

    const sendMessage = async () => {
        if (isConnected && messageInput.trim() !== '' && userId) {
            const chatMessage = {
                sender: { userId: parseInt(userId, 10) },
                chatRoomId: chatRoomId,
                messageText: messageInput
            };
            console.log('보내는 메시지:', chatMessage); // 사용자가 전송하는 메시지

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
    
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleDelete = async (messageId, sendTime) => {
        if (!window.confirm("정말로 이 메시지를 삭제하시겠습니까?")) {
            return; // 사용자가 삭제를 취소한 경우
        }
    
        try {
            // Ensure sendTime is in ISO format
            const formattedSendTime = new Date(sendTime).toISOString();
    
            // Send delete request to the server
            await axios.delete(`http://${SERVER_HOST}/api/${messageId}`, {
                params: { sendTime: formattedSendTime }
            });
    
            // Update the messages state to remove the deleted message
            setMessages(prevMessages => 
                prevMessages.filter(message => message.messageId !== messageId)
            );
    
            // Update status message for successful deletion
            alert('메시지가 성공적으로 삭제되었습니다.');
        } catch (error) {
            // Alert for failed deletion
            alert('메시지 작성 5분이 경과하였습니다.');
            console.error('메시지를 삭제하는 중 오류 발생:', error.response ? error.response.data : error.message);
        }
    };

    const formatTime = (dateTime) => {
        const date = new Date(dateTime);
        const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // 한국 시간으로 변환
        const hours = localDate.getHours();
        const minutes = localDate.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${ampm} ${formattedHours}:${formattedMinutes}`;
    };
    
    useEffect(() => {
        const fetchProduct = async () => {
            if (chatRoomId) {
                try {
                    console.log(`채팅방 ID로 상품 정보 가져오기: ${chatRoomId}`);
                    const response = await axios.get(`http://${SERVER_HOST}/chatRooms/chatRoom/${chatRoomId}/product`);
                    const product = response.data;
                    console.log('받은 상품 정보:', product); // 채팅방 ID로 가져온 상품 정보
                    if (product) {
                        setProduct(product);
                    } else {
                        console.warn('상품을 찾을 수 없습니다. 채팅방 ID:', chatRoomId);
                    }
                } catch (error) {
                    console.error("상품 정보를 가져오는 중 오류 발생:", error.response ? error.response.data : error.message);
                }
            } else {
                console.error("유효하지 않은 채팅방 ID:", chatRoomId);
            }
        };
    
        fetchProduct();
    }, [chatRoomId, userId]);
    
    const proStatus = async (status) => {
        try {
            console.log(`상품 상태 업데이트: ${status}`); // 상품 상태 업데이트 로그
            const response = await axios.put(`http://${SERVER_HOST}/product/update/status/${product.productId}`, null, {
                params: {
                    dealingStatus: status
                }
            });
            console.log('업데이트된 상품 상태:', response.data); // 업데이트된 상품 상태
            setProduct(prevProduct => ({ ...prevProduct, dealingStatus: status }));
        } catch (error) {
            console.error("상품 상태를 업데이트하는 중 오류 발생:", error.response ? error.response.data : error.message);
        }
    }

    useEffect(() => {
        if (chatRoomId) {
            const response = axios.get(`http://${SERVER_HOST}/chatRooms/${chatRoomId}`)
                .then(response => {
                    const { chatRoom, sellerId, buyerId, sellerUserName, buyerUserName, sellerReliability, buyerReliability, unreadMessage } = response.data;
                    setChatRoomDetail({
                        chatRoom: chatRoom,
                        sellerId: sellerId,
                        buyerId: buyerId,
                        sellerUserName: sellerUserName,
                        buyerUserName: buyerUserName,
                        sellerReliability: sellerReliability,
                        buyerReliability: buyerReliability,
                        unreadMessage: unreadMessage
                    });
                    console.log('채팅방 정보: ', response.data);
                })
                .catch(error => {
                    console.error("Error fetching chat room details:", error);
                });
        }
    }, [chatRoomId]);

    const firstProductImage = product && product.fileList && product.fileList.length > 0 ? product.fileList[0].source : null;

    if (userId === null) {
        return <div>사용자 정보가 없습니다.</div>;
    }

    let chatUserName = "";
    if (userInfo.userId === chatRoomDetail.sellerId) {
        chatUserName = chatRoomDetail.buyerUserName;
    } else if (userInfo.userId === chatRoomDetail.buyerId) {
        chatUserName = chatRoomDetail.sellerUserName;
    }

    const isProductSold = product && product.dealingStatus === '판매완료';
    
    return (
        <div className={`chat-container ${isProductSold ? 'sold-out' : ''}`}>
            <h3 className='chatHeader'>
                <button className="backBtn" onClick={onBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                        <path stroke="#141313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12.5 19.5-8.075-7.125a.5.5 0 0 1 0-.75L12.5 4.5" />
                    </svg>
                </button>
                <div className='header'>
                    <div>{chatUserName}</div> &nbsp;
                    <div className='reliability'>{chatRoomDetail.sellerReliability}점</div>
                </div>
            </h3>
            <div className="productPicture">
                <div className="productPicture2">
                    {product ? (
                        <img className="productImage" src={firstProductImage || ''} alt="상품 이미지" />
                    ) : (
                        <p>상품 정보를 로드하는 중입니다...</p>
                    )}
                </div>
                <div className='productInfo'>
                    <div className='AA'>
                        {product ? (product.price ? product.price.toLocaleString() : '상품 금액을 불러오지 못했습니다.') : '상품 금액을 불러오지 못했습니다.'}원
                    </div>
                    <div className='AA'>
                        {product ? product.name : '상품명을 불러오지 못했습니다.'}
                    </div>
                </div>
                <div className='status'>
                    <div className='status1'>
                        {userId === chatRoomDetail.sellerId && (
                        <select onChange={(e) => proStatus(e.target.value)} defaultValue=""
                        value={product ? product.dealingStatus : ''}
                        disabled={product && product.dealingStatus === "판매완료"}>
                            <option value="" disabled>상태 선택</option>
                            <option value="판매중">판매중</option>
                            <option value="예약중">예약중</option>
                            <option value="판매완료">판매완료</option>
                        </select>
                        )}
                    </div>
                    <div className='status2'>
                        <span style={{ color: product && product.dealingStatus === '판매완료' ? 'red' : 'inherit' }}>
                            {product ? (product.dealingStatus === '판매중' ? '판매중' :
                                product.dealingStatus === '예약중' ? '예약중' : '판매완료') : '상품 상태를 로드하는 중'}
                        </span>
                    </div>
                </div>
            </div>
            <div className={`messages ${isProductSold ? 'sold-out' : ''}`}>
            {messages.map((message, index) => {
                const isOwnMessage = userId !== null && message.sender && message.sender.userId === parseInt(userId, 10);

                return (
                    <div key={index} className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
                        <div className='messageText'>{message.messageText}</div>
                        <div className='messageDetails'>
                            <div className={`isRead${isOwnMessage ? '1' : '2'}`}>{message.isRead ? '' : '안읽음'}</div>
                            <div className={`sendTime${isOwnMessage ? '1' : '2'}`}>{formatTime(message.sendTime)}</div>
                        </div>
                        {isOwnMessage && (
                            <button className='messageDelete' onClick={() => handleDelete(message.messageId, message.sendTime)}>x</button>
                        )}
                    </div>
                );
            })}

                <div ref={messagesEndRef} />
                <div className='joinDiv'>
                    {isJoin === 1 && (
                        <div className="joinMessage1">
                            상대방이 채팅방을 나갔습니다<div className='joinMessage2'>(채팅방이 비활성화됩니다)</div>
                        </div>
                    )}
                </div>
                <div className='joinDiv'>
                {isProductSold && (
                    <div className="joinMessage1">
                        판매완료된 상품입니다.
                    </div>
                )}
                </div>
            </div>
            
            <div>
                <TextareaAutosize
                    className='textarea'
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요"
                    minRows={1}
                    maxRows={5}
                    disabled={isJoin === 1}
                />
                <button className='sendBtn' onClick={sendMessage} disabled={isJoin === 1}>전송</button>
            </div>
        </div>
    );
};

export default Chat;
