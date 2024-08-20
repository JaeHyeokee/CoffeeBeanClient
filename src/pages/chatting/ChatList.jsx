import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/chatting/ChatList.css';
import { LoginContext } from '../../contexts/LoginContextProvider';

const ChatList = ({ onSelectChatRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [userId, setUserId] = useState(null);

  const { userInfo } = useContext(LoginContext);

useEffect(() => {
    const storedUserId = userInfo.userId;
    setUserId(storedUserId);        
    if (storedUserId) {
        axios.get(`http://localhost:8088/chatRooms/user/${storedUserId}/with-last-message`)
            .then(response => {
                console.log(response.data); // 데이터 구조를 확인
                setChatRooms(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
}, [userInfo.userId]);

  const getChatUserName = (chatRoom) => {
    const names = [];
    if (chatRoom.sellerId && chatRoom.sellerId.userName) {
        names.push(chatRoom.sellerId);
    }
    return names.length > 0 ? names.join(', ') : `비활성화 대화방`;
  };

  const deleteChatList = async (chatRoomId) => {
    const confirmLeave = window.confirm("채팅방을 나가시겠습니까?");
    if (confirmLeave) {
        try {
            await axios.post(`http://localhost:8088/chatRooms/leave/${chatRoomId}/${userId}`);
            setChatRooms(prevRooms => prevRooms.filter(room => room.chatRoomId !== chatRoomId));
            console.log("채팅방 나가기 성공.");
        } catch (error) {
            console.log('채팅방 나가기 실패.', error);
        }
    } else {
        console.log("채팅방 나가기를 취소했습니다.");
    }
  };

  // 첫 번째 상품 이미지를 가져오는 함수
  const firstProductImage = (chatRoom) => {
    if (chatRoom.attachments && chatRoom.attachments.length > 0) {
      return chatRoom.attachments[0].source;
    }
    return null;
  }
  return (
    <div>
      <h2 className='chatName'>채팅방</h2>
      <ul>
          {chatRooms.length === 0 ? (
              <li className='noChatRoom'>참여중인 채팅방이 없습니다.</li>
          ) : (
              chatRooms.map(chatRoom => (
                <li key={chatRoom.chatRoomId} className='chatRoomItem'>
                    <div className='chatRoomContent'>
                        <button className='list' onClick={() => onSelectChatRoom(chatRoom.chatRoomId)}>
                            <div className='profile1'>
                            <div>
                              {firstProductImage(chatRoom) ? (
                                  <img className='profile2'src={firstProductImage(chatRoom)} alt="상품 이미지" />
                              ) : (
                                  <p>상품 정보를 로드하는 중입니다...</p>
                              )}
                            </div>
                            </div>
                            <div className='chatList'>
                              <div className='userNameAndMessage'>
                                <div className='userName'>
                                  <div className='userNames'>{getChatUserName(chatRoom)}</div>&nbsp;&nbsp;&nbsp;<div className='lastSendTime'>{chatRoom.lastSendTime}</div>
                                </div>
                                <br/>
                                <div className='userMessage'>
                                  {chatRoom.lastMessage}
                                </div>
                              </div>
                              <div className='unreadMessage'>
                                  {chatRoom.unreadMessage > 0 && (
                                      <div className='circle'>
                                          {chatRoom.unreadMessage}
                                      </div>
                                  )}
                              </div>
                            </div>
                        </button>
                        <div className='leaveRoom'>
                            <button className='leaveButton' onClick={() => deleteChatList(chatRoom.chatRoomId)}>방 나가기</button>
                        </div>
                    </div>
                </li>
              ))
          )}
      </ul>
    </div>
  );
};

export default ChatList;
