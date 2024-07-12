import React, { useContext, useEffect, useState } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Playground from './components/Playground/Playground';
import LoginDialog from '../../components/Login/LoginDialog';
import { login } from '../../store/redux/authReducer';
import './HomePage.css';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const HomePage = () => {

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const navigate=useNavigate();
    useEffect(() => {
        if(!isAuthenticated)navigate("/auth");
    }, []);


    return (
        <Box sx={{ display: 'flex', height: '110vh' }}>
            <CssBaseline />

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
                className="main-container"
            >
                <Playground />

            </Box>
        </Box>
    );
};

export default HomePage;
