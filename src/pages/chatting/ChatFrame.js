import React from 'react';
import '../../css/chatting/ChatFrame.css'
import ChatList from './ChatList';

const ChatFrame = () => {
    return (
        <>
            <p className='chatting'>채팅</p>
            <ChatList/>
        </>
    );
};

export default ChatFrame;