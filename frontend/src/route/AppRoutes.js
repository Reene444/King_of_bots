// src/route/Routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AuthCallback from '../components/Login/AuthCallback';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
};

export default AppRoutes;
