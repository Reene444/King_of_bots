import React, {useRef, useState, useEffect ,useCallback, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import getRandomColor from '../../../../common/utils/randomColor';
import Mouse from '../../../../assets/scripts/Mouse/Mouse';
import Snake from '../../../../assets/scripts/Snake/Snake';
import { set, throttle, uniq } from 'lodash';
import './Game.css';
import Leaderboard from '../Leaderboard/Leaderboard';
import RecordingControl from '../RecordingControl/RecordingControl';
import RecordingList from '../RecordingList/RecordingList';

import {
    setPlayers,
    addPlayer,
    movePlayer,
    removePlayer,
    setCurrentPlayer,
    setRoomOnline,
    addCurrentPlayerOffset,
    setCurrentPlayerOffset
} from '../../../../store/redux/gameReducer';
import SelectModel from '../SelectModel/SelectModel';
import Map from '../../../../assets/scripts/Map/Map'
import {useNavigate} from "react-router-dom";
import {addPlayerToRoom, fetchGameState, removePlayerFromRoom} from "../../../../api/httpRequest";
import {leaveRoom} from "../../../../store/redux/roomReducer";
import {generateInitialSegments} from "../../../../common/utils/generateInitialSegments";


const Game = ({roomId}) => {
    const userAuth=useSelector(state => state.auth.user)
    // const roomId = useSelector(state => state.room.roomId);

    const players = useSelector(state => state.game.players || []);
    const [playerType, setPlayerType] = useState(''); // 初始化为空
    const [modelSelected, setModelSelected] = useState(false); // 记录是否选择了模型
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const [stompClient, setStompClient] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const MAX_SPEED = 17;
    const [init,setInit]=useState(false)
    console.log("roomid:", roomId);
    const playersRef = useRef(players);
    const recordingRef=useRef(false)
    const exsited_player=useSelector(state=>{return state.game.current_player})
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const current_player_offset = useSelector(state => state.game.current_player_offset);
    const [add,setAdd]=useState(0)
    useEffect(() => {
        if (!isAuthenticated) navigate("/auth");
    }, []);
    const [player, setPlayer] = useState({
        id: uuidv4(),
        segments: generateInitialSegments(players), // 使用生成的安全位置
        color: getRandomColor(),
        score: 0,
        username: userAuth.id,
        nickname: userAuth.name,
        type: '' // 初始化为空,

    },);

    const current_player_offsetRef = useRef(current_player_offset);

    useEffect(() => {
        current_player_offsetRef.current = current_player_offset;
    }, [current_player_offset]);

    const load_existed=()=>{
        if(!players.find(p=>p.nickname===player.nickname))dispatch(addPlayer(player))  

        if(exsited_player!==null&&exsited_player.type!==""&&exsited_player.username===player.username&&exsited_player.id!==player.id){
            const existingPlayer = players.find(p => p.nickname === exsited_player.nickname);
            if (existingPlayer) {
                  //  initializeGamePlayers()
                    setPlayer(existingPlayer);
                    dispatch(addPlayer(existingPlayer))                  
                    setModelSelected(true)
                    setPlayerType(existingPlayer.type)
           
            }

        }else{
            dispatch(setCurrentPlayer(player))
        }

    }
    useEffect(()=>{
    load_existed();
    })

    const handleRecordingChange = (recording) => {
        recordingRef.current = recording;
        console.log("recordingref:",recordingRef.current);
    };

    const initializeGamePlayers = async () => {
        try {
            const gameState = await fetchGameState(roomId);
            let tmp=gameState.players.find(p=>p.nickname===player.nickname)
            if(tmp===undefined||tmp===null){
               dispatch(setPlayers(null))
               setPlayers(null) 
                gameState.players.forEach(p=>{
                    dispatch(addPlayer(p))
                })
            }
            else{
                //camera implementation to keep the current player in the centre of the view
                let tmx=player.segments[0].x-tmp.segments[0].x
                let tmy=player.segments[0].y-tmp.segments[0].y
                gameState.players.forEach(p=>{
                  if(p.nickname!==player.nickname) 
                     p.segments.forEach((element) => {
                        element.x -= (tmx-offset.x);
                        element.y -= (tmy-offset.y);
                      })
                    dispatch(addPlayer(p))
                })

            }
            console.log("game.js:get the init gamers:",players);
            setInit(true)
        } catch (error) {
            console.error("Failed to fetch game state:", error);
        }
    
    };
    useEffect(()=>{
        if(roomId !== null&& !init)initializeGamePlayers();
    },[])// the hook will execute when the browser is refreshed
    useEffect(() => {
        const socket = new SockJS('http://localhost:8097/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => { console.log(str); },
            onConnect: () => {
                client.subscribe(`/topic/game.${roomId}.add`, (message) => {
                    let newplayer = JSON.parse(message.body);         
                    if (newplayer.nickname !== player.nickname) {    
                         newplayer.segments.forEach((element) => {
                            /** Camera view(keep the current player in the centre of the window):
                            when the new player is added, the position of the new player the engine get is the abosolute position,
                            whereas we need to use the relative postion here, so we substract the totol movement or drift of the 
                            current player which is the offsetRef.current here, then we get the position of the game word for the
                            new player added in the current player's room.
                            */
                            element.x -=( current_player_offsetRef.current.x);  
                            element.y -=( current_player_offsetRef.current.y);
                          })
                         dispatch(addPlayer(newplayer));// give the payload into the reducer to process the addplayer action.
                    }
                });
                client.subscribe(`/topic/game.${roomId}.move`, (message) => {
                    const movedPlayer = JSON.parse(message.body);
                    if(movedPlayer.id!==player.id) dispatch(movePlayer(movedPlayer));

                });
                client.subscribe(`/topic/game.${roomId}.remove`, (message) => {
                    const removedplayer = JSON.parse(message.body);
                        console.log("this is update for dispatch in adding",message.body,removedplayer.id !== player.id);
                        dispatch(removePlayer(removedplayer.id));

                });
                setStompClient(client);
                          // Implementing Heartbeat Detection
            const heartbeatInterval = setInterval(() => {
                if (client.connected) {
                    client.publish({
                        destination: `/app/heartbeat`,
                        body: JSON.stringify({ message: 'heartbeat' }),
                    });
                } else {
                    console.warn('Connection is unstable or lost.');
                }
            }, 5000); // Heartbeat every 5 seconds

            client.onWebSocketClose = () => {
                clearInterval(heartbeatInterval);
                console.warn('Connection closed. Attempting to reconnect...');
                // Attempt to reconnect
                client.activate();
            };

            },
            onStompError: (frame) => {
                console.error('Error: ', frame);
                setStompClient(null);
            },
        });
        client.activate();
        return () => {
            removePlayerHandler(player);
            client.deactivate();
        };
    }, []);



    useEffect(() => {
        console.log("Current Player Offset after update:"+ JSON.stringify(current_player_offset));
    }, [current_player_offset]);
    

    useEffect(() => {
        const joinRoom = async () => {
            console.log("logs:modelselected:", modelSelected);
            console.log("logs:playerType", playerType, playerType === 'mouse' || playerType === 'snake');
            if (modelSelected && stompClient && stompClient.connected) {
                stompClient.publish({
                    destination: `/app/game.${roomId}.add`,
                    body: JSON.stringify(player),
                });
                dispatch(addPlayer(player));
                dispatch(setCurrentPlayer(player))
                // alert("join_room:"+JSON.stringify(exsited_player))
                //dispatch(addCurrentPlayerOffset({x:-current_player_offset.x,y:-current_player_offset.y})) 
          //      dispatch(setCurrentPlayerOffset({x:0,y:0}))
                try {
                    const addplayerResult = await addPlayerToRoom(roomId, player);

                } catch (e) {
                    console.log("Failed to add to the rooms", e);
                    dispatch(leaveRoom(player))
                    dispatch(setCurrentPlayer(null))
                    navigate("/room")
                }
            }
        };

        joinRoom();
        // 清理函数
        return () => {
            // 这里可以添加需要的清理逻辑
            if(playerType===false)
                {
                    removePlayerHandler(player)
                   dispatch(setCurrentPlayer(null))
                // dispatch(addCurrentPlayerOffset({x:-current_player_offset.x,y:-current_player_offset.y})) 
                }
        };

    }, [playerType,player.type]);


    const handleReturnRoom=()=>{
        removePlayerHandler(player)
        setModelSelected(false)
        setPlayerType(null)
        dispatch(setCurrentPlayer(null))
        navigate("/room")

    }
    useEffect(() => {//这里处理移动的函数
        console.log("logs:moved:"+JSON.stringify({ id: player.id, head: player.segments[0], type: player.type, timestamp: Date.now() }))
        let timestamp = Date.now();
        if (modelSelected && stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/game.${roomId}.move`,
                body: JSON.stringify({ id: player.id, head_drift: offset, type: player.type, timestamp: Date.now() }),
                headers: { timestamp: timestamp }
            });
        }
    }, [player.segments, stompClient, roomId]);

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
            head.x += dx * ratio; head.y += dy * ratio;
            setOffset({ x: dx * ratio, y: dy * ratio });    
            dispatch(addCurrentPlayerOffset({x:dx * ratio,y: dy * ratio}));
           } else { head.x = mouseX; head.y = mouseY; setOffset({ x: mouseX-head.x, y: mouseY-head.y }); }

        const updatedSegments = [head, ...player.segments.slice(0, -1)];
        const updatedPlayer = { ...player, segments: updatedSegments };
        console.log("updated player local:",updatedPlayer);
        if (checkCollision(updatedPlayer)) {
            alert('Game over! Restarting...');
            removePlayerHandler(player);
            resetPlayer();
        }
        else{
            setPlayer(updatedPlayer);
            dispatch(setPlayers(updatedPlayer))
        }
    }, 50);


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
            id: player.id,
            segments: generateInitialSegments(players),
            color: player.color,
            score: 0,
            username: 'user@user.com',
            nickname: player.nickname,
            type: playerType // 保留玩家类型
        };
        setPlayer(newPlayer);
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/app/game/${roomId}/add`,
                body: JSON.stringify(newPlayer),
            });
            dispatch(addPlayer(newPlayer));
            dispatch(setCurrentPlayer(newPlayer))
        }
    };

    const removePlayerHandler = (player) => {
        console.log("remove player:",player);
        if (player && player.id) {
            if (stompClient && stompClient.connected) {
                console.log("remove 2");
                console.log("begin to remove");
                stompClient.publish({
                    destination: `/app/game.${roomId}.removePlayer`,
                    body: JSON.stringify(player),
                });//√
                console.log("end remove from websocket");
            }
            removePlayerFromRoom(roomId, player.id).then(r => {return null});
            console.log("end remove from room");
            dispatch(removePlayer(player.id));
            var tmpox=current_player_offset
            var tmpoy=current_player_offset
           dispatch(setCurrentPlayerOffset({x:0,y:0}))
            // dispatch(setCurrentPlayer(null))
            // setPlayer(null)
            console.log("remove success");
            console.log("remove 3");
        }
    };
    useEffect(() => {
        playersRef.current = players;
    }, [players]);
    useEffect(()=>{
        players.map(p=>{
          p.segments.forEach((element, index, seg) => {
              seg[index].x = element.x - offset.x;
              seg[index].y = element.y - offset.y;
            });
        })
      },[offset])



    const memoizedPlayers = useMemo(() => playersRef.current.map((p) => {
        if (p.type === 'mouse') {
            return <Mouse key={p.id} players={[p]} onMouseMove={handleMouseMove} />;
        } else {
            return <Snake key={p.id} players={[p]} onMouseMove={handleMouseMove} />;
        }
    }), [playersRef.current, handleMouseMove]);
    return (
        <div className="game-container">
            {!modelSelected && (
                <SelectModel
                    playerType={playerType}
                    setType={(type) => {
                    setPlayer((prev) => ({ ...prev, type:type }));
                    setPlayerType('snake'); // 设置玩家类型
                    setModelSelected(true); // 设置选择完成
                }}
                />
            )}
            <Map offset={ offset } />
            {memoizedPlayers}
            <Leaderboard leaderboard={playersRef.current} score={player.score} onReturnRoom={handleReturnRoom}/>
            <RecordingControl players={playersRef.current} onRecordingChange={handleRecordingChange}/>
            <RecordingList recording={recordingRef.current}/>

        </div>
    );
};

export default Game;
