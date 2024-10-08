import React, { useContext, useEffect, useState } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText } from '@mui/material';
import './HomePage.css';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {joinRoom} from "../../store/redux/roomReducer";
import Game from "./components/Game/Game";

const HomePage = () => {

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate=useNavigate();
    useEffect(() => {
        if(!isAuthenticated)navigate("/auth");
    }, []);


    const location = useLocation();
    const { room } = location;
    const dispatch = useDispatch();

    const { roomid } = useParams();

    return (
        <Box sx={{ display: 'flex', height: '105vh' }}>
            <CssBaseline />
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
                className="main-container"
            >
                <Game roomId={roomid} />

            </Box>
        </Box>
    );
};

export default HomePage;
