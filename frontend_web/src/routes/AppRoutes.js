import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import PlaybackPage from '../pages/Playback/PlaybackPage';
import LoginPage from "../pages/Auth/Login/LoginPage";
import RoomManagerPage from "../pages/RoomManager/RoomManagerPage";
import {Switch} from "@mui/material";
import PaymentPage from '../pages/Payment/PaymentPage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('YOUR_PUBLIC_STRIPE_KEY'); // 替换为你的 Stripe 公钥

const AppRoutes = () => (
    <Router>
        <Elements stripe={stripePromise}>
        <Routes >
            <Route path="/" element={<RoomManagerPage />} />
            <Route path="/room" element={<RoomManagerPage />} />
            <Route path="/home/:roomid" element={<HomePage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/playback/:recordingId" element={<PlaybackPage />} />
            <Route path="/payment" element={<PaymentPage />} />
        </Routes>
        </Elements>
    </Router>
);

export default AppRoutes;
