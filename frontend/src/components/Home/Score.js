import React from 'react';
import './Score.css';

const Score = ({ score, elapsedTime }) => {


    return (
        <div className="score-container">
            <div>Score: {score}</div>
        </div>
    );
};

export default Score;
