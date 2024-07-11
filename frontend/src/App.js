import React from 'react';
// import { GameProvider } from './context/GameContext';
// import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import HomePage from './pages/Home/HomePage';
import './App.css';
import {Router} from "react-router-dom";


function App() {
    return (
        // <AuthProvider> {/* Wrap the entire application in AuthProvider */}

                <HomePage/>,


        {/*</AuthProvider>*/}
    );
}

export default App;
