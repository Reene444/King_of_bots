import React, {useRef, useState, useEffect ,useCallback, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import getRandomColor from '../../../../common/utils/randomColor';
import Mouse from '../../../../assets/scripts/Mouse/Mouse';
import Snake from '../../../../assets/scripts/Snake/Snake';
import { throttle } from 'lodash';
import './Game.css';
import Leaderboard from '../Leaderboard/Leaderboard';
import RecordingControl from '../RecordingControl/RecordingControl';
import RecordingList from '../RecordingList/RecordingList';
import { setPlayers, addPlayer, movePlayer, removePlayer } from '../../../../store/redux/gameReducer';
import SelectModel from '../SelectModel/SelectModel';
import Map from '../../../../assets/scripts/Map/Map'
import {useNavigate} from "react-router-dom";
import {addPlayerToRoom, fetchGameState} from "../../../../api/httpRequest";
import {leaveRoom} from "../../../../store/redux/roomReducer";


const Game = ({roomId}) => {
    const userAuth=useSelector(state => state.auth.user)

    // const roomId = useSelector(state => state.room.roomId);
    const players = useSelector(state => state.game.players || []);
    const [playerType, setPlayerType] = useState(''); // 初始化为空
    const [modelSelected, setModelSelected] = useState(false); // 记录是否选择了模型
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const isRecording = useSelector(state => state.recording.isRecording);
    const [stompClient, setStompClient] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const MAX_SPEED = 7;
    const [init,setInit]=useState(false)
    console.log("roomid:", roomId);
    const playersRef = useRef(players);
    const recordingRef=useRef(false)

    useEffect(() => {
        if (!isAuthenticated) navigate("/auth");
    }, []);
    const generateInitialSegments = () => {
        let segments;
        let isSafe;
        do {
            const startX = Math.floor(Math.random() * window.innerWidth);
            const startY = Math.floor(Math.random() * window.innerHeight);
            segments = Array.from({ length: 15 }, (_, index) => ({ x: startX - index * 10, y: startY }));
            isSafe = players && players.every(player =>
                    player && Array.isArray(player.segments) && player.segments.every(segment =>
                        segments.every(s => segment && Math.abs(segment.x - s.x) >= 20 && Math.abs(segment.y - s.y) >= 20)
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
        username: userAuth.id,
        nickname: userAuth.name,
        type: '' // 初始化为空
    });

    useEffect(() => {
        playersRef.current = players;
    }, [players]);
    const handleRecordingChange = (recording) => {
        recordingRef.current = recording;
        console.log("recordingref:",recordingRef.current);
    };

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            removePlayerHandler(player);
            navigate("/room");
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [player]);

    useEffect(()=>{

        const initializeGamePlayers = async () => {
            try {
                const gameState = await fetchGameState(roomId);
                gameState.players.forEach(p=>{
                    dispatch(addPlayer(p))
                })
                console.log("game.js:get the init gamers:",players);
                setInit(true)
                // alert("get init player"+`${JSON.stringify(gameState.players)}`)
            } catch (error) {
                console.error("Failed to fetch game state:", error);
            }
        };


        if(roomId !== null&& !init)initializeGamePlayers();


    },[])

    useEffect(() => {

        const socket = new SockJS('http://localhost:8097/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => { console.log(str); },
            onConnect: () => {
                client.subscribe(`/topic/game/${roomId}/add`, (message) => {
                    const newplayer = JSON.parse(message.body);
                    if (newplayer.id !== player.id) {
                        console.log("this is update for dispatch in adding",message.body,newplayer.id !== player.id);
                        dispatch(addPlayer(newplayer));
                        // dispatch(setPlayers(gameState.player));
                    }
                });
                client.subscribe(`/topic/game/${roomId}/move`, (message) => {
                    const movedPlayer = JSON.parse(message.body);
                    console.log("sbscribe_move:" + message.body + "id:"+movedPlayer.id+"current_player:" + player.id,(movedPlayer.id !== player.id));
                    if(movedPlayer.id!==player.id) dispatch(movePlayer(movedPlayer));
                });
                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error('Error: ', frame);
                setStompClient(null);
            },
        });
        client.activate();
        return () => { client.deactivate(); };
    }, []);

    useEffect(() => {
        const joinRoom = async () => {
            console.log("logs:modelselected:", modelSelected);
            console.log("logs:playerType", playerType, playerType === 'mouse' || playerType === 'snake');
            if (modelSelected && stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: `/app/game/${roomId}/add`,
                    body: JSON.stringify(player),
                });
                dispatch(addPlayer(player));
                try {
                    const addplayerResult = await addPlayerToRoom(roomId, player);

                } catch (e) {
                    console.log("Failed to add to the rooms", e);
                    dispatch(leaveRoom(player))
                    navigate("/room")
                }
            }
        };

        joinRoom();

        // 清理函数
        return () => {
            // 这里可以添加需要的清理逻辑

        };


    }, [playerType]);


    useEffect(() => {
        console.log("logs:moved:"+JSON.stringify({ id: player.id, head: player.segments[0], type: player.type, timestamp: Date.now() }))
        let timestamp = Date.now();
        if (modelSelected && stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/game/${roomId}/move`,
                body: JSON.stringify({ id: player.id, head: player.segments[0], type: player.type, timestamp: Date.now() }),
                headers: { timestamp: timestamp }
            });
        }
    }, [player.segments, stompClient, roomId]);

    const handleMouseMove = throttle((event) => {
        console.log("Mouse moved"); // 添加日志以确认事件触发
        const rect = event.target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const head = { ...player.segments[0] };
        const dx = mouseX - head.x;
        const dy = mouseY - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > MAX_SPEED) {
            const ratio = MAX_SPEED / distance;
            head.x += dx * ratio; head.y += dy * ratio;
        } else { head.x = mouseX; head.y = mouseY; }

        const updatedSegments = [head, ...player.segments.slice(0, -1)];
        const updatedPlayer = { ...player, segments: updatedSegments };
        console.log("updated player local:",updatedPlayer);
        if (checkCollision(updatedPlayer)) {
            alert('Game over! Restarting...');
            removePlayerHandler(player);
            resetPlayer();
            return;
        }
        setPlayer(updatedPlayer);
        dispatch(setPlayers(updatedPlayer))

    }, 200);


    const checkCollision = (player) => {
        const head = player.segments[0];
        for (let i = 0; i < players.length; i++) {
            let otherPlayer = players[i];
            if (otherPlayer.id !== player.id) {
                for (let j = 0; j < otherPlayer.segments.length; j++) {
                    if (Math.abs(head.x - otherPlayer.segments[j].x) < 10 &&
                        Math.abs(head.y - otherPlayer.segments[j].y) < 10) {
                        otherPlayer.score += 1;
                        if (otherPlayer.id === player.id) {
                            setPlayer(prevPlayer => ({ ...prevPlayer, score: otherPlayer.score }));
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
                destination: `/app/game/${roomId}/add`,
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
                    destination: `/app/game/${roomId}/removePlayer`,
                    body: JSON.stringify(player),
                });
                dispatch(removePlayer(player.id));
            }
        }
    };

    const memoizedPlayers = useMemo(() => playersRef.current.map((p) => {
        if (p.type === 'mouse') {
            return <Mouse key={p.id} players={[p]} onMouseMove={handleMouseMove} />;
        } else {
            return <Snake key={p.id} players={[p]} onMouseMove={handleMouseMove} />;
        }
    }), [playersRef.current, handleMouseMove]);
    return (
        <div className="game-container">
            <Map players={{ players }} />
            {!modelSelected && (
                <SelectModel
                    playerType={playerType}
                    setType={(type) => {
                    setPlayer((prev) => ({ ...prev, type }));
                    // let typetemp=type
                    setPlayerType('snake'); // 设置玩家类型
                    // console.log("playerType:", playerType,",", type,",",player);
                    setModelSelected(true); // 设置选择完成
                }}
                />
            )}

            <RecordingControl players={players} onRecordingChange={handleRecordingChange}/>
            {memoizedPlayers}
            <Leaderboard leaderboard={players} score={player.score}/>
            <RecordingList recording={recordingRef.current}/>

        </div>
    );
};

export default Game;
