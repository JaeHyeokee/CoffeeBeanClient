import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/chatting/ChatList.css';

const ChatList = ({ onSelectChatRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
      if (storedUserId) {
        axios.get(`http://localhost:8088/chatRooms/user/${storedUserId}/with-last-message`)
          .then(response => {
            console.log(response.data); // 데이터 구조를 콘솔에 출력
            setChatRooms(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the chat rooms!', error);
          });
        }
  }, []);

  const getChatUserName = (chatRoom) => {
    const names = [];
    if (chatRoom.sellerId && chatRoom.sellerId.userName) {
        names.push(chatRoom.sellerId.userName);
    }
    return names.length > 0 ? names.join(', ') : `비활성화 대화방`;
  };

  const deleteChatList = async (chatRoomId) => {
    try {
      await axios.post(`http://localhost:8088/chatRooms/leave/${chatRoomId}/${userId}`)
      setChatRooms(prevRooms => prevRooms.filter(room => room.chatRoomId !== chatRoomId));
      window.confirm("채팅방을 나가시겠습니까?")
      console.log("채팅방 나가기 성공.");
    } catch (error) {
      console.log('채팅방 나가기 실패.', error);
    }
  };
  

  return (
    <div>
      <h2 className='chatName'>채팅방</h2>
      <ul>
          {chatRooms.length === 0 ? (
              <li>참여중인 채팅방이 없습니다.</li>
          ) : (
              chatRooms.map(chatRoom => (
                <li key={chatRoom.chatRoomId} className='chatRoomItem'>
                    <div className='chatRoomContent'>
                        <button className='list' onClick={() => onSelectChatRoom(chatRoom.chatRoomId)}>
                            <div className='profile1'>
                              <h5>프로필 사진</h5>
                            </div>
                            <div>{chatRoom.isJoin}</div>
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