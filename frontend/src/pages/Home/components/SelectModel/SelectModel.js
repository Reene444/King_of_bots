import React from 'react';
import './SelectModel.css';
import {Button} from "@mui/material";
import AnimationIcon from '@mui/icons-material/Animation';


const SelectModel = ({ playerType, setType }) => {
    return (
        <div className="select-model-overlay">
            <div className="select-model-container">
                <h2>Select Your Model<AnimationIcon /></h2>
                <Button variant="contained" onClick={() => {setType('mouse')}} disabled={playerType === 'mouse'}>Mouse</Button>
                <Button variant="contained" onClick={() => {setType('snake')}} disabled={playerType === 'snake'}>Snake</Button>
            </div>
        </div>
    );
};

export default SelectModel;
