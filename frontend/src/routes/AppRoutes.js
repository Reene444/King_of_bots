import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import PlaybackPage from '../pages/Playback/PlaybackPage';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playback/:id" element={<PlaybackPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;
