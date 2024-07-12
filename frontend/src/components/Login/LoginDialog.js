import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, updateUser } from '../../store/redux/authReducer';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

const LoginDialog = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const handleLogin = () => {
        const user = { username: 'test', name: 'Test User' };
        dispatch(login(user));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                {isAuthenticated ? (
                    <div>
                        <p>Welcome, {user.name}</p>
                        <Button onClick={handleLogout}>Logout</Button>
                    </div>
                ) : (
                    <Button onClick={handleLogin}>Login</Button>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginDialog;