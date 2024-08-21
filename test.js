const SockJS = require('sockjs-client');
const { Client } = require('@stomp/stompjs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const numberOfUsers = 1000; // 并发用户数
const roomId = "1";
const serverUrl = 'http://localhost:8097/ws';
const apiClientRuningService = axios.create({
    baseURL: 'http://localhost:8097', // 根据你的API服务URL调整
});
const axiosRetry = require('axios-retry');
const connections = [];
const moveInterval = 600000; // 移动消息发送间隔

function createClient(userId, index) {
    const socket = new SockJS(serverUrl);
    const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log("__bgin_connect:"+str),
        onConnect: async () => {
            console.log(`User ${index + 1} (${userId}) connected`);

            const player = {
                id: userId,
                segments: [{ x: Math.random() * 500, y: Math.random() * 500 }],
                color: '#FF0000',
                score: 0,
                username: `user${index + 1}`,
                nickname: `User_${index + 1}`,
                type: 'snake'
            };

            try {
                const response = await apiClientRuningService.post(`/api/rooms/${roomId}/players`, player);
                console.log(`Player ${userId} added to room ${roomId} via API.`);

                if (client.connected) {
                    client.publish({
                        destination: `/app/game/${roomId}/add`,
                        body: JSON.stringify(player)
                    });
                } else {
                    console.error(`STOMP client not connected for user ${userId}`);
                }
            } catch (error) {
                console.error(`Failed to add player ${player} to room ${roomId}:`, error);
                throw error;
            }

            setInterval(() => {
                if (client.connected) {
                    client.publish({
                        destination: `/app/game/${roomId}/move`,
                        body: JSON.stringify({
                            id: userId,
                            head: {
                                x: Math.random() * 500,
                                y: Math.random() * 500
                            },
                            type: 'snake',
                            timestamp: Date.now()
                        })
                    });
                } else {
                    console.error(`STOMP client not connected for user ${userId}`);
                }
            }, moveInterval);
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame);
        },
        onDisconnect: () => {
            console.log(`User ${index + 1} (${userId}) disconnected`);
        }
    });

    client.activate();
    return client;
}


const loopStartTime = Date.now();

for (let i = 0; i < numberOfUsers; i++) {
    const userId = uuidv4();
    // const client = createClient(userId, i);

    const player = {
        id: userId,
        segments: [{ x: Math.random() * 500, y: Math.random() * 500 }],
        color: '#FF0000',
        score: 0,
        username: `user${i+ 1}`,
        nickname: `User_${i + 1}`,
        type: 'snake'
    };

        const response = apiClientRuningService.post(`/api/rooms/${roomId}/players`, player)
        .then(response => {
            // console.log(`callback Player ${userId} added to room ${roomId}.`);
            const loopEndTime = Date.now();
const loopDurationSeconds = (loopEndTime - loopStartTime) / 1000;

// 打印循环总时间
console.log(`Total execution time for the loop: ${loopDurationSeconds.toFixed(3)} seconds ,${JSON.stringify(response.body)}`);
        })
        .catch(error => {
            console.error('callback Failed to add player:', error);
        });
        console.log(`Player ${userId} added to room ${roomId} via API.${i}` );
    // connections.push(client);
}

// // 捕获终止信号并清理连接
// process.on('SIGINT', () => {
//     console.log('Terminating test');
//     connections.forEach(client => client.deactivate());
//     process.exit();
// });
