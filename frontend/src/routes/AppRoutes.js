import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import PlaybackPage from '../pages/Playback/PlaybackPage';
import LoginPage from "../pages/Auth/Login/LoginPage";
import RoomManagerPage from "../pages/RoomManager/RoomManagerPage";
const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<RoomManagerPage />} />
            <Route path="/room" element={<RoomManagerPage />} />
            <Route path="/home/:roomid" element={<HomePage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/playback/:recordingId" element={<PlaybackPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;
