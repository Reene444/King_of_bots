import React from 'react';
import { GameProvider } from './context/GameContext';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
    return (
        <GameProvider>
            <HomePage />
        </GameProvider>
    );
}

export default App;
