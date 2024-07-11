import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import getRandomColor from '../../../../common/utils/randomColor';
import Mouse from '../../../../assets/scripts/Mouse/Mouse';
import Snake from '../../../../assets/scripts/Snake/Snake';
import { throttle } from 'lodash';
import './Game.css';
import Score from '../Score/Score';
import Leaderboard from '../Leaderboard/Leaderboard';
import RecordingControl from '../RecordingControl/RecordingControl';
import RecordingList from '../RecordingList/RecordingList';
import { setPlayers, addPlayer, movePlayer, removePlayer } from '../../../../store/redux/gameReducer';
import SelectModel from '../SelectModel/SelectModel';
import Map from '../../../../assets/scripts/Map/Map'
const Game = () => {
    const players = useSelector(state => state.game.players);
    const isRecording = useSelector(state => state.recording.isRecording);
    const dispatch = useDispatch();
    const [stompClient, setStompClient] = useState(null);
    const [playerType, setPlayerType] = useState(''); // 初始化为空
    const [modelSelected, setModelSelected] = useState(false); // 记录是否选择了模型

    const MAX_SPEED = 6;

    const generateInitialSegments = () => {
        let segments;
        let isSafe;
        do {
            const startX = Math.floor(Math.random() * window.innerWidth);
            const startY = Math.floor(Math.random() * window.innerHeight);
            segments = Array.from({ length: 15 }, (_, index) => ({ x: startX - index * 10, y: startY }));
            isSafe = players.every(player =>
                !player.segments.some(segment =>
                    segments.some(s => Math.abs(segment.x - s.x) < 20 && Math.abs(segment.y - s.y) < 20)
                )
            );
        } while (!isSafe);
        return segments;
    };

    const [player, setPlayer] = useState({
        id: uuidv4(),
        segments: generateInitialSegments(), // 使用生成的安全位置
        color: getRandomColor(),
        score: 0,
        username: 'user@user.com',
        nickname: 'user_' + uuidv4().slice(0, 1),
        type: '' // 初始化为空
    });

    useEffect(() => {
        const socket = new SockJS('http://localhost:8097/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                client.subscribe('/topic/game', (message) => {
                    const gameState = JSON.parse(message.body);
                    dispatch(setPlayers(gameState.players));
                    const foundPlayer = gameState.players.find(p => p.id === player.id);
                    if (foundPlayer) {
                        setPlayer(prevPlayer => ({
                            ...prevPlayer,
                            score: foundPlayer.score,
                            type: foundPlayer.type
                        }));
                    }
                });
                client.publish({
                    destination: '/app/game.addPlayer',
                    body: JSON.stringify(player),
                });
                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error('Error: ', frame);
                setStompClient(null);
            },
        });
        client.activate();
    }, [dispatch]);

    useEffect(() => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/game.movePlayer',
                body: JSON.stringify(player),
            });
        }
    }, [player.segments, stompClient]);

    const handleMouseMove = throttle((event) => {
        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const head = { ...player.segments[0] };
        const dx = mouseX - head.x;
        const dy = mouseY - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > MAX_SPEED) {
            const ratio = MAX_SPEED / distance;
            head.x += dx * ratio;
            head.y += dy * ratio;
        } else {
            head.x = mouseX;
            head.y = mouseY;
        }

        const updatedSegments = [head, ...player.segments.slice(0, -1)];
        const updatedPlayer = { ...player, segments: updatedSegments };

        if (checkCollision(updatedPlayer)) {
            alert('Game over! restart...');
            removePlayerHandler(player);
            resetPlayer();
            return;
        }

        setPlayer(updatedPlayer);
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/game.movePlayer',
                body: JSON.stringify(updatedPlayer),
            });
            dispatch(movePlayer(updatedPlayer));
        }
    }, 20);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            removePlayerHandler(player);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [player]);

    const checkCollision = (player) => {
        const head = player.segments[0];

        for (let i = 0; i < players.length; i++) {
            let otherPlayer = players[i];
            if (otherPlayer.id !== player.id) {
                for (let j = 0; j < otherPlayer.segments.length; j++) {
                    if (Math.abs(head.x - otherPlayer.segments[j].x) < 10 &&
                        Math.abs(head.y - otherPlayer.segments[j].y) < 10) {
                        otherPlayer.score += 1;
                        if (stompClient && stompClient.connected) {
                            stompClient.publish({
                                destination: '/app/game.movePlayer',
                                body: JSON.stringify(otherPlayer),
                            });
                        }
                        dispatch(setPlayers(players.map((p) => { if (p.id === otherPlayer.id) { return { ...p, score: p.score + 1 } } return p; })));

                        if (otherPlayer.id === player.id) {
                            setPlayer(prevPlayer => ({
                                ...prevPlayer,
                                score: otherPlayer.score
                            }));
                        }
                        return true;
                    }
                }
            }
        }

        return false;
    };

    const resetPlayer = () => {
        const newPlayer = {
            id: uuidv4(),
            segments: generateInitialSegments(),
            color: getRandomColor(),
            score: 0,
            username: 'user@user.com',
            nickname: 'user_' + uuidv4().slice(0, 1),
            type: playerType // 保留玩家类型
        };
        setPlayer(newPlayer);
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/game.addPlayer',
                body: JSON.stringify(newPlayer),
            });

            dispatch(addPlayer(newPlayer));
        }
    };

    const removePlayerHandler = (player) => {
        dispatch(removePlayer(player.id));
        if (player && player.id) {
            if (stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: '/app/game.removePlayer',
                    body: JSON.stringify(player),
                });
                dispatch(removePlayer(player.id));
            }
        }
    };

    return (
        <div className="game-container">
            <Map />
            {!modelSelected && (
                <SelectModel playerType={playerType} setType={(type) => {
                    setPlayer(prev => ({...prev, type}));
                    setPlayerType(type); // 设置玩家类型
                    setModelSelected(true); // 设置选择完成
                }}/>
            )}

            <RecordingControl stompClient={stompClient} player={player}/>
            {players.map((p) => (
                p.type === 'mouse' ? (
                    <Mouse key={p.id} players={[p]} onMouseMove={ handleMouseMove }/>
                ) : (
                    <Snake key={p.id} players={[p]} onMouseMove={ handleMouseMove }/>
                )
            ))}
            <Score score={player.score}/>
            <Leaderboard leaderboard={players}/>
            <RecordingList/>
        </div>
    );
};

export default Game;
