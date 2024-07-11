import React from 'react';
import './SelectModel.css';

const SelectModel = ({ playerType, setType }) => {
    return (
        <div className="select-model-overlay">
            <div className="select-model-container">
                <h2>Select Your Model</h2>
                <button onClick={() => setType('mouse')} disabled={playerType === 'mouse'}>Mouse</button>
                <button onClick={() => setType('snake')} disabled={playerType === 'snake'}>Snake</button>
            </div>
        </div>
    );
};

export default SelectModel;
