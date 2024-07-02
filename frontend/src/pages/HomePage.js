import React, { useContext, useEffect, useState } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Playground from '../components/Home/Playground';
import LoginDialog from '../components/Login/LoginDialog';
import { AuthContext } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
    // const { state, login } = useContext(AuthContext);
    // const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    //
    // useEffect(() => {
    //     const storedAuthState = localStorage.getItem('authState');
    //     if (storedAuthState) {
    //         const { isAuthenticated, user } = JSON.parse(storedAuthState);
    //         if (isAuthenticated) {
    //             login(user);
    //         } else {
    //             setLoginDialogOpen(true);
    //         }
    //     } else {
    //         setLoginDialogOpen(true);
    //     }
    // }, [login]);
    //
    // const handleLoginClose = () => {
    //     setLoginDialogOpen(false);
    // };

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
            {/*<LoginDialog open={loginDialogOpen} onClose={handleLoginClose} />*/}
        </Box>
    );
};

export default HomePage;
