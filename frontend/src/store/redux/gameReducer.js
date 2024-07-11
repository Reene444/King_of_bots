// Action Types
const SET_PLAYERS = 'SET_PLAYERS';
const ADD_PLAYER = 'ADD_PLAYER';
const MOVE_PLAYER = 'MOVE_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';

// Initial State
const initialState = {
    players: [],
};

// Reducer
const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLAYERS:
            return { ...state, players: action.payload };
        case ADD_PLAYER:
            return { ...state, players: [...state.players, action.payload] };
        case MOVE_PLAYER:
            return {
                ...state,
                players: state.players.map(player =>
                    player.id === action.payload.id ? action.payload : player
                ),
            };
        case REMOVE_PLAYER:
            return {
                ...state,
                players: state.players.filter(player => player.id !== action.payload.id),
            };
        default:
            return state;
    }
};

// Action Creators
export const setPlayers = players => ({
    type: SET_PLAYERS,
    payload: players
});

export const addPlayer = player => ({
    type: ADD_PLAYER,
    payload: player
});

export const movePlayer = player => ({
    type: MOVE_PLAYER,
    payload: player
});

export const removePlayer = playerId => ({
    type: REMOVE_PLAYER,
    payload: { id: playerId

    }
});

export default gameReducer;
