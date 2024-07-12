import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import PlaybackPage from '../pages/Playback/PlaybackPage';
import LoginPage from "../pages/Auth/Login/LoginPage";

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/playback/:id" element={<PlaybackPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;
