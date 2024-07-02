import React, { useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import getRandomColor from '../../utils/randomColor';
import Snake from '../..//scripts/Snake';
import { throttle } from 'lodash';
import { GameContext } from '../../context/GameContext';
import './Game.css';
import Score from './Score';
import Leaderboard from './Leaderboard';
import RecordingControl from "./RecordingControl";

const Game = () => {
    const { state, dispatch } = useContext(GameContext);
    const [players, setPlayers] = useState(state.players);
    const [leaderboard, setLeaderboard] = useState([]);

    const generateInitialSegments = () => {
        let segments;
        let isSafe;
        do {
            const startX = Math.floor(Math.random() * window.innerWidth);
            const startY = Math.floor(Math.random() * window.innerHeight);
            segments = Array.from({ length: 15 }, (_, index) => ({ x: startX - index * 10, y: startY }));
            isSafe = state.players.every(player =>
                !player.segments.some(segment =>
                    segments.some(s => Math.abs(segment.x - s.x) < 20 && Math.abs(segment.y - s.y) < 20)
                )
            );
        } while (!isSafe);
        return segments;
    };

    const [player, setPlayer] = useState({
        id: uuidv4(),
        segments: Array.from({ length: 15 }, (_, index) => ({ x: 50 - index * 10, y: 50 })), // 初始化蛇的身体为15节
        color: getRandomColor(),
        score: 0,
        username:'user@user.com',
        nickname:'user'
    });

    const [stompClient, setStompClient] = useState(null);
    const MAX_SPEED = 6; // 设置蛇头的最大速度

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
                    dispatch({ type: 'SET_PLAYERS', payload: gameState.players });
                    setPlayers(gameState.players);
                });
                client.publish({
                    destination: '/app/game.movePlayer',
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

        return () => {
            if (client) client.deactivate();
        };
    }, [dispatch]); // 依赖项中去掉 player

    useEffect(() => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/game.movePlayer',
                body: JSON.stringify(player),
            });
        }
    }, [player, stompClient]);

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

        // 碰撞检测
        if (checkCollision(updatedPlayer)) {
            alert('Game over! restart...');
            removePlayer(player);
            resetPlayer();
            return;
        }

        setPlayer(updatedPlayer);
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/game.movePlayer',
                body: JSON.stringify(updatedPlayer),
            });
            dispatch({ type: 'MOVE_PLAYER', payload: updatedPlayer });
            updateLeaderboard(updatedPlayer);
        }
    }, 20); // 每20毫秒发送一次数据

    const checkCollision = (player) => {
        const head = player.segments[0];

        // 检测与其他玩家的碰撞
        for (let i = 0; i < players.length; i++) {
            const otherPlayer = players[i];
            if (otherPlayer.id !== player.id) {
                for (let j = 0; j < otherPlayer.segments.length; j++) {
                    if (Math.abs(head.x - otherPlayer.segments[j].x) < 10 &&
                        Math.abs(head.y - otherPlayer.segments[j].y) < 10) {
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
            segments: generateInitialSegments(), // 初始化蛇的身体
            color: getRandomColor(),
            score: 0,
            username:'user@user.com',
            nickname:'user'
        };
        setPlayer(newPlayer);
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/game.addPlayer',
                body: JSON.stringify(newPlayer),
            });
            dispatch({ type: 'ADD_PLAYER', payload: newPlayer });
        }
    };

    const removePlayer = (player) => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: '/app/game.removePlayer',
                body: JSON.stringify(player),
            });
            dispatch({ type: 'REMOVE_PLAYER', payload: player });
        }
    };

    const updateLeaderboard = (updatedPlayer) => {
        setLeaderboard((prevLeaderboard) => {
            const existingPlayer = prevLeaderboard.find(p => p.id === updatedPlayer.id);
            if (existingPlayer) {
                if (updatedPlayer.score > existingPlayer.score) {
                    return prevLeaderboard.map(p => p.id === updatedPlayer.id ? updatedPlayer : p);
                }
                return prevLeaderboard;
            }
            return [...prevLeaderboard, updatedPlayer];
        });
    };

    return (
        <div className="game-container">
            <RecordingControl stompClient={stompClient} player={player} />
            <Snake players={players} onMouseMove={handleMouseMove} />
            <Score score={player.score} />
            <Leaderboard leaderboard={leaderboard} />
        </div>
    );
};

export default Game;
