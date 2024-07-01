import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function Chat({ username }) {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messageAreaRef = useRef(null);
    const connectingElement = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8097/ws'); // 指向后端端点
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                client.subscribe('/topic/public', (payload) => {
                    const message = JSON.parse(payload.body);
                    setMessages((prevMessages) => [...prevMessages, message]);
                });

                client.publish({
                    destination: "/app/chat.addUser",
                    body: JSON.stringify({ sender: username, type: 'JOIN' }),
                });
                connectingElement.current.classList.add('hidden');
                setStompClient(client);
            },
            onStompError: (frame) => {
                connectingElement.current.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
                connectingElement.current.style.color = 'red';
                setStompClient(null);
            },
        });

        client.activate();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [username]);

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (message.trim() && stompClient && stompClient.connected) {
            const chatMessage = {
                sender: username,
                content: message,
                type: 'CHAT'
            };
            stompClient.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
            });
            setMessage('');
        }
    };

    const getAvatarColor = (messageSender) => {
        let hash = 0;
        for (let i = 0; i < messageSender.length; i++) {
            hash = 31 * hash + messageSender.charCodeAt(i);
        }
        const index = Math.abs(hash % colors.length);
        return colors[index];
    };

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div id="chat-page">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>Spring WebSocket Chat Demo - By Alibou</h2>
                </div>
                <div className="connecting" ref={connectingElement}>Connecting...</div>
                <ul id="messageArea" ref={messageAreaRef}>
                    {messages.map((message, index) => (
                        <li key={index} className={message.type === 'CHAT' ? 'chat-message' : 'event-message'}>
                            {message.type === 'CHAT' ? (
                                <>
                                    <i style={{ backgroundColor: getAvatarColor(message.sender) }}>
                                        {message.sender[0]}
                                    </i>
                                    <span>{message.sender}</span>
                                    <p>{message.content}</p>
                                </>
                            ) : (
                                <p>{message.sender} {message.type === 'JOIN' ? 'joined!' : 'left!'}</p>
                            )}
                        </li>
                    ))}
                </ul>
                <form id="messageForm" onSubmit={handleSendMessage}>
                    <div className="form-group">
                        <div className="input-group clearfix">
                            <input
                                type="text"
                                id="message"
                                placeholder="Type a message..."
                                autoComplete="off"
                                className="form-control"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="submit" className="primary">Send</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Chat;
