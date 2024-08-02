import React from 'react';
import '../../css/chatting/ChatFrame.css'
import ChatList from './ChatList';

const ChatFrame = () => {
    return (
        <>
            <h3>채팅</h3>
            <ChatList/>
        </>
    );
};

export default ChatFrame;