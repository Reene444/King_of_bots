import React, { useState, useEffect, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import getRandomColor from '../utils/randomColor';
import Snake from '../scripts/Snake';
import { throttle } from 'lodash';
import { GameContext } from '../context/GameContext';
import './Game.css';
import Score from './Score';
import Leaderboard from './Leaderboard';

const Game = () => {
    const { state, dispatch } = useContext(GameContext);

    const generateInitialSegments = () => {
        let segments;
        let isSafe;
        do {
            const startX = Math.floor(Math.random() * window.innerWidth);
            const startY = Math.floor(Math.random() * window.innerHeight);
            segments = Array.from({ length: 5 }, (_, index) => ({ x: startX - index * 10, y: startY }));
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
       segments: Array.from({ length: 5 }, (_, index) => ({ x: 50 - index * 10, y: 50 })), // 初始化蛇的身体为5节, // Initialize snake body
        color: getRandomColor(),
        score: 0,
        username:'user@user.com',
        nickname:'user'

    });

    const [stompClient, setStompClient] = useState(null);
    const MAX_SPEED = 5; // Set maximum speed for snake head

    useEffect(() => {
        //'http://localhost:8082/ws'
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

        return () => {
            if (client) client.deactivate();
        };
    }, [player, dispatch]);

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

        // Collision detection
        if (checkCollision(updatedPlayer)) {
            alert('You have collided with another player! Starting over...');
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
        }
    }, 20); // Send data every 20 milliseconds

    const checkCollision = (player) => {
        const head = player.segments[0];

        // Detect collision with other players
        for (let i = 0; i < state.players.length; i++) {
            const otherPlayer = state.players[i];
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
            segments: generateInitialSegments(), // Initialize snake body
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

    return (
        <div className="game-container">
            <Snake players={state.players} onMouseMove={handleMouseMove} />
            <Score score={player.score} />
            <Leaderboard players={state.players} />
        </div>
    );
};

export default Game;
