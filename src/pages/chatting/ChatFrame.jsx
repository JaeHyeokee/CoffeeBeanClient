import React from 'react';
import '../../css/chatting/ChatFrame.css'
import ChatList from './ChatList';
import Chat from './Chat';

const ChatFrame = ({ productId }) => {
    return (
        <div className='chat-frame'>
            <p className='chatting'>채팅</p>
            {productId ? (
                <Chat productId={productId} /> // productId가 있을 때
            ) : (
                <ChatList /> // productId가 없을 때
            )}
        </div>
    );
};

export default ChatFrame;
