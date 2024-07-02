import React from 'react';
import { GameProvider } from './context/GameContext';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import HomePage from './pages/HomePage';
import './App.css';
import {Router} from "react-router-dom";


function App() {
    return (
        <AuthProvider> {/* Wrap the entire application in AuthProvider */}
            <GameProvider>
                <HomePage/>

            </GameProvider>
        </AuthProvider>
    );
}

export default App;
