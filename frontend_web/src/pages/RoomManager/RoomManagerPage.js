import React, { useState, useEffect } from 'react';
import './RoomManagerPage.css';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonTime from "../../components/ButtonTime/ButtonTime";
import {joinRoom} from "../../store/redux/roomReducer";

import {fetchRooms} from "../../api/httpRequest";
import RoomModal from "./components/RoomModal/RoomModal";
import VideogameAssetTwoToneIcon from '@mui/icons-material/VideogameAssetTwoTone';
import Typography from '@mui/material/Typography';
import SpotlightSearch from './components/SpotlightSearch/SpotlightSearch';
const RoomManagerPage = ({ }) => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate = useNavigate();

    const dispatch=useDispatch()


    useEffect(() => {
        if (!isAuthenticated) navigate("/auth");
    }, [isAuthenticated, navigate]);



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
        setOpenModal(true); // Open the modal when a room is clicked
    };

   useEffect(()=>{
    setSelectedRoom(1);
    setOpenModal(true);
   },[])
   
    const handleCloseModal = () => {
        setSelectedRoom(null);
        setOpenModal(false); // Close the modal
    };

    const handleJoinRoom=()=>{
        dispatch(joinRoom(selectedRoom));
        navigate(`/home/${selectedRoom}`);
        setSelectedRoom(null);
        console.log("roomId:",selectedRoom);
    }
    return (
        <div className="room-manager">
            <SpotlightSearch /> 
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Typography
                    variant="h1"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        color: '#333',
                        fontSize: '2rem', // 设置字体大小
                        letterSpacing: '0.5px', // 设置字母间距
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)' // 添加文本阴影
                    }}
                >
                    <VideogameAssetTwoToneIcon style={{ fontSize: 'inherit', marginRight: '8px' }}/>Select a Room</Typography>
            </div>
            <div style={{borderTop: '1px solid #ccc', paddingTop: '8px', marginBottom: '8px'}}>
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
            {/* Render the RoomModal */}
            <RoomModal dal open={openModal} handleClose={handleCloseModal} handleJoin={handleJoinRoom} roomId={selectedRoom}/>
        </div>
    );
};

export default RoomManagerPage;
