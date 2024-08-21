import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useDispatch } from 'react-redux';
import { addPlayer, movePlayer, removePlayer, scoreUpdate } from '../../store/redux/gameReducer'; // Replace with your actual action creators
import { v4 as uuidv4 } from 'uuid';
import {generateInitialSegments} from "../../common/utils/generateInitialSegments";
import getRandomColor from '../../common/utils/randomColor';
const WebSocketTest = ({ roomId }) => {
    const [numClients, setNumClients] = useState(1);
    const [connections, setConnections] = useState([]);
    const dispatch = useDispatch();
    const messageCount = useRef(0);
    
    // useEffect(() => {
    //     return () => {
    //         connections.forEach(client => client.deactivate());
    //     };
    // }, [connections]);
    const players=[]
    const [player, setPlayer] = useState({
        id: uuidv4(),
        segments: generateInitialSegments(players), // 使用生成的安全位置
        color: getRandomColor(),
        score: 0,
        username: 'test2341',
        nickname: "testnickname",
        type: '' // 初始化为空,

    },);
    const createClients = () => {
        const clients = [];
        roomId=1;//测试单个房间
        for (let i = 0; i < numClients; i++) {
            const socket = new SockJS('http://localhost:8097/ws');
            setPlayer(pre=>({...pre,id:uuidv4()}))
            const client = new Client({
                webSocketFactory: () => socket,
                debug: (str) => { console.log(`Client ${i}: ${str}`); },
                onConnect: () => {
                    console.log(`Client ${i} connected`);
                    client.subscribe(`/topic/game/${roomId}/add`, (message) => {
                        const newplayer = JSON.parse(message.body);
                        if (newplayer.id !== player.id) {
                            // dispatch(addPlayer(newplayer));          
                                          }
                       
                        messageCount.current += 1;
                    });

                    client.subscribe(`/topic/game/${roomId}/move`, (message) => {
                        const movedPlayer = JSON.parse(message.body);
                        // if (movedPlayer.id !== player.id) dispatch(movePlayer(movedPlayer));
                        messageCount.current += 1;
                    });

                    client.subscribe(`/topic/game/${roomId}/remove`, (message) => {
                        const removedplayer = JSON.parse(message.body);
                        // dispatch(removePlayer(removedplayer.id));
                        messageCount.current += 1;
                    });

                    client.subscribe(`/topic/game/${roomId}/scoreUpdate`, (message) => {
                        const updatedScoreplayer = JSON.parse(message.body);
                        // dispatch(scoreUpdate(updatedScoreplayer));
                        messageCount.current += 1;
                    });

                    client.publish({
                        destination: `/app/game/${roomId}/add`,
                        body: JSON.stringify(player),
                    });
                 
                    client.publish({
                        destination: `/app/game/${roomId}/move`,
                        body: JSON.stringify({ id: player.id, head: player.segments[0], type: player.type, timestamp: Date.now() }),
                        headers: { timestamp: Date.now() }
                    });
                },
                onStompError: (frame) => {
                    console.error(`Client ${i} Error: `, frame);
                },
            });
            client.activate();
            clients.push(client);
        }
        setConnections(clients);
    };

    const handleStartTest = () => {
        messageCount.current = 0;
        setConnections([]);
        createClients();
    };

    const handleStopTest = () => {
        connections.forEach(client => client.deactivate());
        setConnections([]);
    };

    return (
        <div>
            <h1>WebSocket Load Test</h1>
            <div>
                <label>Number of Clients: </label>
                <input 
                    type="number" 
                    value={numClients} 
                    onChange={(e) => setNumClients(Number(e.target.value))} 
                />
            </div>
            <div>
                <button onClick={handleStartTest}>Start Test</button>
                <button onClick={handleStopTest}>Stop Test</button>
            </div>
            <div>
                <p>Total Messages Received: {messageCount.current}</p>
            </div>
            <div>
                <p>Active Connections: {connections.length}</p>
            </div>
        </div>
    );
};

export default WebSocketTest;
