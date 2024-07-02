import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Playback from '../pages/Playback';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playback/:id" element={<Playback />} />
        </Routes>
    </Router>
);

export default AppRoutes;
