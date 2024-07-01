import React, { createContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
    players: [],
};

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PLAYERS':
            return { ...state, players: action.payload };
        case 'ADD_PLAYER':
            return { ...state, players: [...state.players, action.payload] };
        case 'MOVE_PLAYER':
            return {
                ...state,
                players: state.players.map(player =>
                    player.id === action.payload.id ? action.payload : player
                ),
            };
        case 'REMOVE_PLAYER':
            return {
                ...state,
                players: state.players.filter(player => player.id !== action.payload.id),
            };
        default:
            return state;
    }
};

const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export { GameContext, GameProvider };
