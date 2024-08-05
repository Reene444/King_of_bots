import React, { useState, useEffect } from 'react';
import './RoomManagerPage.css';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonTime from "../../components/ButtonTime/ButtonTime";
import {joinRoom} from "../../store/redux/roomReducer";

import {fetchRooms} from "../../api/httpRequest";


const RoomManagerPage = ({ }) => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();

    const dispatch=useDispatch()


    useEffect(() => {
        if (!isAuthenticated) navigate("/auth");
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const testRooms = [
            { id: 1, players: 5, maxPlayers: 10, timeLeft: 120 },
            { id: 2, players: 3, maxPlayers: 10, timeLeft: 300 },
            { id: 3, players: 8, maxPlayers: 10, timeLeft: 60 },
            { id: 4, players: 5, maxPlayers: 10, timeLeft: 120 },
            { id: 5, players: 3, maxPlayers: 10, timeLeft: 300 },
            { id: 6 , players:8, maxPlayers: 10, timeLeft: 60 },
        ];
        // setRooms(testRooms);
    }, []);

    // 使用useEffect来获取房间数据
    useEffect(() => {
        const loadRooms = async () => {
            try {
                const roomsData = await fetchRooms();
                setRooms(roomsData);
            } catch (error) {
                console.error("Failed to load rooms:", error);
            }
        };

        loadRooms();
    }, []);

    const handleRoomClick = (roomId) => {
        setSelectedRoom(roomId);
        dispatch(joinRoom(roomId));
        console.log("roomId:",roomId);
        navigate('/home');
    };

    return (
        <div className="room-manager">
            <h1>Select a Room</h1>
            <ul className="room-list">
                {rooms.map(room => (
                    <li key={room.id}>
                        <ButtonTime
                            name={`room${room.id}`}  // 添加这个属性
                            onClick={() => handleRoomClick(room.id)}
                            progress={(room.timeLeft / 300) * 100}
                        >
                            Room {room.id} - Players: {room.playersCount}/{room.maxPlayers} - Time Left: {room.timeLeft}s
                        </ButtonTime>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomManagerPage;
