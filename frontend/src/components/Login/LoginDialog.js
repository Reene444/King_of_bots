import React, { useContext, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { GoogleLogin } from 'react-google-login';
import { AuthContext } from '../../context/AuthContext';

const LoginDialog = ({ open, onClose }) => {
    const { login } = useContext(AuthContext);
    const [nickname, setNickname] = useState('');
    const clientId = "YOUR_GOOGLE_CLIENT_ID";

    const handleGoogleLoginSuccess = (response) => {
        login(response.profileObj);
        localStorage.setItem('authState', JSON.stringify({
            isAuthenticated: true,
            user: response.profileObj
        }));
        onClose();
        window.location.href = '/'; // Navigate back to home page after login
    };

    const handleGoogleLoginFailure = (response) => {
        console.error('Google login failed', response);
    };

    const handleGuestLogin = () => {
        if (nickname.trim()) {
            const guestUser = { nickname };
            login(guestUser);
            localStorage.setItem('authState', JSON.stringify({
                isAuthenticated: true,
                user: guestUser
            }));
            onClose();
            window.location.href = '/'; // Navigate back to home page after login
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Login</DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6">Login with Google</Typography>
                    <GoogleLogin
                        clientId={clientId}
                        buttonText="Login with Google"
                        onSuccess={handleGoogleLoginSuccess}
                        onFailure={handleGoogleLoginFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                    <Typography variant="h6">Or login as a guest</Typography>
                    <TextField
                        label="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleGuestLogin}>
                        Login as Guest
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginDialog;
