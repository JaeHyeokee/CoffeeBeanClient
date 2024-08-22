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
    const [isConnected, setIsConnected] = useState(false);
    const [product, setProduct] = useState(null);
    const [isJoin, setIsJoin] = useState(null);
    const [chatRoomDetail, setChatRoomDetail] = useState({
        chatRoom: null,
        sellerId: null,
        sellerUserName: '',
        sellerReliability: null
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
                console.log('실시간 message: ', JSON.parse(message.body));  // 메세지가 올 때 마다 console
                showMessage(JSON.parse(message.body));  // 받은 메세지 화면에 표시
            });
        }, (error) => {
            console.error('STOMP 오류: ' + error);
            setIsConnected(false);
        });

        const markMessagesAsRead = async () => {
            if (userId && chatRoomId) {
                try {
                    const response = await axios.post(`http://${SERVER_HOST}/api/messages/read/${chatRoomId}/${userId}`);
                    console.log('메시지를 읽음으로 표시:', response.data); // 메시지를 읽음으로 표시
                } catch (error) {
                    console.error('메시지를 읽음으로 표시하는 중 오류 발생:', error);
                }
            }
        };
        markMessagesAsRead();

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
            console.log('보낸 사람 ID:', message.sender ? message.sender.userId : 'No Sender ID');
            setMessages(prevMessages => [...prevMessages, message]);
        } else {
            console.error('유효하지 않은 메시지:', message);
        }
    };

    const sendMessage = () => {
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleDelete = async (messageId, sendTime) => {
        const currentTime = new Date().getTime();
        const messageTime = new Date(sendTime).getTime();

        const isConfirmed = window.confirm('삭제하시겠습니까?');
        
        if (!isConfirmed) {
            return;
        }
        
        if ((currentTime - messageTime) <= 60000) {
            try {
                const response = await axios.delete(`http://${SERVER_HOST}/api/messages/${messageId}`);
                console.log('삭제된 메시지 ID:', messageId); // 삭제된 메시지의 ID
                if (response.status === 200) {
                    setMessages(prevMessages => prevMessages.filter(message => message.messageId !== messageId));
                    window.alert("메시지가 삭제되었습니다.");
                }
            } catch (error) {
                console.error('메시지 삭제 중 오류 발생:', error);
            }
        } else {
            window.alert('메시지를 작성한 지 1분 이상 경과하였습니다.');
        }
    };

    const formatTime = (dateTime) => {
        const date = new Date(dateTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${ampm} ${formattedHours}:${formattedMinutes}`;
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

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
    }, [chatRoomId]);
    
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
            axios.get(`http://${SERVER_HOST}/chatRooms/${chatRoomId}`)
                .then(response => {
                    const { chatRoom, sellerId, sellerUserName, sellerReliability } = response.data;
                    setChatRoomDetail({
                        chatRoom: chatRoom,
                        sellerId: sellerId,
                        sellerUserName: sellerUserName,
                        sellerReliability: sellerReliability
                    });
                    console.log('채팅방 정보: ', response.data);

                    // console.log('Buyer ID:', sellerId);
                    // console.log('Seller ID:', sellerId);
                })
                .catch(error => {
                    console.error("Error fetching chat room details:", error);
                });
        }
    }, [chatRoomId]);

    // const handleImageClick = () => {
    //     navigate(`/ProductDetail/${product.productId}`, null);
    // };

    // console.log('유저유저 :', userInfo.userId);

    const firstProductImage = product && product.fileList && product.fileList.length > 0 ? product.fileList[0].source : null;

    if (userId === null) {
        return <div>사용자 정보가 없습니다.</div>;
    }

    return (
        <div className="chat-container">
            <h3 className='chatHeader'>
                <button className="backBtn" onClick={onBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                        <path stroke="#141313" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12.5 19.5-8.075-7.125a.5.5 0 0 1 0-.75L12.5 4.5" />
                    </svg>
                </button>
                <div className='header'>
                    <div>{chatRoomDetail.sellerUserName}</div> &nbsp;
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
                        {userId == chatRoomDetail.sellerId && (
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
            <div>{chatRoomId.sellerId}</div>
            <div className={`messages ${isJoin === 1 ? 'gray-background' : ''}`}>
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
                    disabled={isJoin === 1}
                />
                <button className='sendBtn' onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
};

export default Chat;