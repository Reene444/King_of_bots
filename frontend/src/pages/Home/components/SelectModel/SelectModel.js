import React from 'react';
import './SelectModel.css';
import Button from "../../../../components/Button/Button";

const SelectModel = ({ playerType, setType }) => {
    return (
        <div className="select-model-overlay">
            <div className="select-model-container">
                <h2>Select Your Model</h2>
                <Button onClick={() => setType('mouse')} disabled={playerType === 'mouse'}>Mouse</Button>
                <Button onClick={() => setType('snake')} disabled={playerType === 'snake'}>Snake</Button>
            </div>
        </div>
    );
};

export default SelectModel;
