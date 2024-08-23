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
  const [profileImage, setProfileImage] = useState({});

  const { userInfo } = useContext(LoginContext);

  useEffect(() => {
    const fetchProfileImage = async (sellerId) => {
      try {
        const response = await axios.get(`http://${SERVER_HOST}/user/profile/${sellerId}`);
        const imageUrl = response.data;
        setProfileImage(prevState => ({
          ...prevState,
          [sellerId]: imageUrl
        }));
      } catch (error) {
        console.error('이미지 불러오기 실패: ', error);
      }
    };

    const storedUserId = userInfo.userId;
    setUserId(storedUserId);
    if (storedUserId) {
      axios.get(`http://${SERVER_HOST}/chatRooms/user/${storedUserId}/with-last-message`)
        .then(response => {
          const { data, status } = response;
          setChatRooms(response.data);
          console.log('콘솔!: ', response.data); // 데이터 구조를 확인
          data.forEach(chatRoom => {
            fetchProfileImage(chatRoom.sellerId);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [userInfo.userId]);

const getChatUserName = (chatRoom) => {
  let getChatUserName = null;
  if (userInfo.userId == chatRoom.sellerId) {
    getChatUserName = chatRoom.buyerUserName;
  } else if (userInfo.userId == chatRoom.buyerId) {
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

useEffect(() => {
  const fetchProfileImages = async () => {
    const updatedProfileImage = {};

    for (const chatRoom of chatRooms) {
      if (chatRoom.userId && !profileImage[chatRoom.userId]) {
        try {
          const response = await axios.get(`http://${SERVER_HOST}/user/profile/${chatRoom.userId}`);
          updatedProfileImage[chatRoom.userId] = response.data;
        } catch (error) {
          console.error('Failed to fetch profile image:', error);
        }
      }
    }

    setProfileImage(prevImage => ({ ...prevImage, ...updatedProfileImage }));
  };

  if (chatRooms.length > 0) {
    fetchProfileImages();
  }
}, [chatRooms]);

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
      {chatRooms.length === 0 ? (
        <li className='noChatRoom'>참여중인 채팅방이 없습니다.</li>
      ) : (
        chatRooms.map(chatRoom => (
          <li key={chatRoom.chatRoomId} className='chatRoomItem'>
            <div className='chatRoomContent'>
              <button className='list' onClick={() => onSelectChatRoom(chatRoom.chatRoomId)}>
                <div className='profile1'>
                  {profileImage[chatRoom.sellerId] ? (
                    <img className='profile2' src={profileImage[chatRoom.sellerId] || 'https://img2.joongna.com/common/Profile/Default/profile_f.png'} alt="프로필 이미지" />
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
                    <img className='productPicture1'src={firstProductImage(chatRoom)} alt="상품 이미지" />
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
  );
};

export default ChatList;
