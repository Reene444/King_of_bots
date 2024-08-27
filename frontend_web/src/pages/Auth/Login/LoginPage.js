// LoginPage.js
import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Button, TextField, Typography } from '@mui/material';
import Background from '../../../components/Background/Background';
import { login } from '../../../store/redux/authReducer';
import './LoginPage.css';
import { jwtDecode } from "jwt-decode";

const generateRandomUsername = () => `guest${Math.random().toString(36).substring(7)}`;

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const isAuthenticated=useSelector(state => state.auth.isAuthenticated)
    const handleGoogleLogin = (response) => {
        if (response && response.credential) {
            const decoded = jwtDecode(response.credential);
            console.log(decoded);
            const { sub: googleId, name, email } = decoded;
            // 处理登录逻辑，例如更新状态或发送请求到后端
            console.log('Google ID:', googleId);
            console.log('Name:', name);
            console.log('Email:', email);
            const user={
                id:email,
                name:name,
            }
            dispatch(login(user));
            navigate("/room")
        } else {
            console.log('Google 登录响应没有包含期望的属性');
        }


    };

    const handleGuestLogin = () => {
        const user = {
            id: generateRandomUsername(),
            name: nickname || generateRandomUsername(),
        };
        dispatch(login(user));

        navigate('/room');
    };



    return (
        <div className="login-page">
            <Background/>
            <Box className="login-box">
                <Typography variant="h5" component="div" gutterBottom>
                    Login
                </Typography>
                <Box className="google-login">
                    <GoogleLogin onSuccess={handleGoogleLogin} onFailure={() => console.log('Login Failed')} locale="en" />
                </Box>
                <Box className="nickname-input">
                    <TextField
                        name="nickname"
                        label="Enter a nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box className="guest-login">
                    <Button name="guest_login_button" onClick={handleGuestLogin} variant="contained" color="primary" fullWidth>
                        Guest Login
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default LoginPage;
