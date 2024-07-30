const SET_PLAYERS = 'SET_PLAYERS';
const ADD_PLAYER = 'ADD_PLAYER';
const MOVE_PLAYER = 'MOVE_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';

const initialState = {
    players: [],
};

const gameReducer = (state = initialState, action = {}) => {
    console.log('Action:', action.type, 'Payload:', action.payload);
    switch (action.type) {
        case SET_PLAYERS:
            return { ...state, players: Array.isArray(action.payload) ? action.payload : [] };
        case ADD_PLAYER:
            return { ...state, players: Array.isArray(state.players) ? [...state.players, action.payload] : [action.payload] };
        case MOVE_PLAYER:
            return {
                ...state,
                players: Array.isArray(state.players) ? state.players.map(player =>
                    player.id === action.payload.id
                        ? { ...player,
                            segments: [
                                { x: action.payload.head.x, y: action.payload.head.y },
                                ...player.segments.slice(0, -1)
                            ] }
                        : player
                ) : [],
            };
        case REMOVE_PLAYER:
            return {
                ...state,
                players: Array.isArray(state.players) ? state.players.filter(player => player.id !== action.payload.id) : [],
            };
        default:
            return state;
    }
};

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
    payload: { id: playerId }
});

export default gameReducer;
