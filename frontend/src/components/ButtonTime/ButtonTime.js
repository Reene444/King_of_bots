import React from 'react';
import './ButtonTime.css';

const ButtonTime = ({ onClick, children, progress }) => {
    return (
        <div className="button-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <button className="custom-button" onClick={onClick}>
                {children}
            </button>
        </div>
    );
};

export default ButtonTime;
