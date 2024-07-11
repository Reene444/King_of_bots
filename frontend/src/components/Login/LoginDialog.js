import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, updateUser } from '../../store/redux/authReducer';

const LoginDialog = () => {
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
        <div>
            {isAuthenticated ? (
                <div>
                    <p>Welcome, {user.name}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
};

export default LoginDialog;