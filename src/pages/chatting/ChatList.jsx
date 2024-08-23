import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/chatting/ChatList.css';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { SERVER_HOST } from '../../apis/Api';
import MyIcon from '../../image/MyIcon.svg';
import chatRoomOut from '../../image/chatRoomOut.png';

const ChatList = ({ onSelectChatRoom }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [userId, setUserId] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const { userInfo } = useContext(LoginContext);

useEffect(() => {
  const fetchChatRooms = async () => {
    const storedUserId = userInfo.userId;
    setUserId(storedUserId);

    if (storedUserId) {
      try {
        const response = await axios.get(`http://${SERVER_HOST}/chatRooms/user/${storedUserId}/with-last-message`);
        const chatRoomsData = response.data;
        console.log('콘솔!: ', chatRoomsData); // 데이터 구조 확인
        setChatRooms(chatRoomsData);
        
        // 프로필 이미지 요청
        const profileImageRequests = chatRoomsData.map(chatRoom => {
          return axios.get(`http://${SERVER_HOST}/user/profile/${chatRoom.sellerId}`)
            .then(response => ({
              sellerId: chatRoom.sellerId,
              image: response.data
            }))
            .catch(error => {
              console.error('이미지 불러오기 실패: ', error);
              return { sellerId: chatRoom.sellerId, image: null }; // 실패 시 null 반환
            });
        });

        // 모든 프로필 이미지 요청의 결과를 처리
        const profileImagesResults = await Promise.all(profileImageRequests);
        const newProfileImages = {};
        profileImagesResults.forEach(({ sellerId, image }) => {
          newProfileImages[sellerId] = image;
        });
        setProfileImages(newProfileImages); // 한 번에 상태 업데이트
      } catch (error) {
        console.error('채팅방 데이터 불러오기 실패: ', error);
      }
    }
  };

  fetchChatRooms();
}, [userInfo.userId]);


  const getChatUserName = (chatRoom) => {
    let getChatUserName = null;
    if (userInfo.userId === chatRoom.sellerId) {
      getChatUserName = chatRoom.buyerUserName;
    } else if (userInfo.userId === chatRoom.buyerId) {
      getChatUserName = chatRoom.sellerUserName;
    }
    return getChatUserName || '비활성화 대화방';
  };

  const deleteChatList = async (chatRoomId) => {
    const confirmLeave = window.confirm("채팅방을 나가시겠습니까?");
    if (confirmLeave) {
      try {
        await axios.post(`http://${SERVER_HOST}/chatRooms/leave/${chatRoomId}/${userId}`);
        setChatRooms(prevRooms => prevRooms.filter(room => room.chatRoomId !== chatRoomId));
        console.log("채팅방 나가기 성공.");
      } catch (error) {
        console.log('채팅방 나가기 실패.', error);
      }
    } else {
      console.log("채팅방 나가기를 취소했습니다.");
    }
  };

  const firstProductImage = (chatRoom) => {
    if (chatRoom.attachments && chatRoom.attachments.length > 0) {
      return chatRoom.attachments[0].source;
    }
    return null;
  };

  const MyComponent = () => {
    return (
      <div>
        <img src={MyIcon} alt="My Icon" />
      </div>
    );
  };

  const ChatRoomOutIcon = () => {
    return (
      <div className="chatRoomIcon">
        <img src={chatRoomOut} alt="방 나가기" style={{ width: '35%', height: '25%' }} />
      </div>
    );
  };

  return (
    <div className='chatRoom'>
      <h2 className='chatName'>채팅방</h2>
      <div className='chatRoomList'>
      {chatRooms.length === 0 ? (
        <li className='noChatRoom'>참여중인 채팅방이 없습니다.</li>
      ) : (
        chatRooms.map(chatRoom => (
          <li key={chatRoom.chatRoomId} className='chatRoomItem'>
            <div className='chatRoomContent'>
              <button className='list' onClick={() => onSelectChatRoom(chatRoom.chatRoomId)}>
                <div className='profile1'>
                  {profileImages[chatRoom.sellerId] ? (
                    <img className='profile2' src={profileImages[chatRoom.sellerId]} alt="프로필 이미지" />
                  ) : (
                    <div className='profile3'><MyComponent /></div>
                  )}
                </div>
                <div className='chatList'>
                  <div className='userNameAndMessage'>
                    <div className='userName'>
                      <div className='userNames'>{getChatUserName(chatRoom)}</div>&nbsp;&nbsp;&nbsp;<div className='lastSendTime'>{chatRoom.lastSendTime}</div>
                      <div className='unreadMessage'>
                        {chatRoom.unreadMessage > 0 && (
                          <div className='circle'>
                            {chatRoom.unreadMessage}
                          </div>
                        )}
                      </div>
                    </div>
                    <br />
                    <div className='userMessage'>
                      {chatRoom.lastMessage}
                    </div>
                  </div>
                  <img className='productPicture1' src={firstProductImage(chatRoom)} alt="상품 이미지" />
                </div>
              </button>
              <div className='leaveRoom'>
                <button className='leaveButton' onClick={() => deleteChatList(chatRoom.chatRoomId)}>
                  <ChatRoomOutIcon />
                </button>
              </div>
            </div>
          </li>
        ))
      )}
      </div>
    </div>
  );
};

export default ChatList;
