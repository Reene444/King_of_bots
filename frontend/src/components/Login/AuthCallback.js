// src/components/AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AuthCallback = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuth = async () => {
            // Simulating authentication logic
            const userData = {}; // Replace with actual logic to get user data
            login(userData);
            navigate('/');
        };
        handleAuth();
    }, [login, navigate]);

    return (
        <div>
            Authenticating...
        </div>
    );
};

export default AuthCallback;
