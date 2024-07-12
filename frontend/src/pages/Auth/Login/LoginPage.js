// LoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Button, TextField, Typography } from '@mui/material';
import Background from '../../../components/Background/Background';
import { login } from '../../../store/redux/authReducer';

const generateRandomUsername = () => `guest_${Math.random().toString(36).substring(7)}`;

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');

    const handleGoogleLogin = (response) => {
        // Handle Google login response
        const user = {
            id: response.profileObj.googleId,
            name: response.profileObj.name,
            email: response.profileObj.email,
        };
        dispatch(login(user));
        navigate('/home');
    };

    const handleGuestLogin = () => {
        const user = {
            id: generateRandomUsername(),
            name: nickname || generateRandomUsername(),
        };
        dispatch(login(user));
        navigate('/home');
    };

    return (
        <div className="login-page">
            <Background/>
            <Box className="login-box">
                <Typography variant="h5" component="div" gutterBottom>
                    Login
                </Typography>
                <Box className="google-login">
                    <GoogleLogin onSuccess={handleGoogleLogin} onFailure={() => console.log('Login Failed')}/>
                </Box>
                <Box className="nickname-input">
                    <TextField
                        label="Enter a nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box className="guest-login">
                    <Button onClick={handleGuestLogin} variant="contained" color="primary" fullWidth>
                        Guest Login
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default LoginPage;
