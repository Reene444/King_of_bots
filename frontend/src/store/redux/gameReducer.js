import {v4 as uuidv4} from "uuid";
import {generateInitialSegments} from "../../common/utils/generateInitialSegments";
import getRandomColor from "../../common/utils/randomColor";
import {useSelector} from "react-redux";


const SET_PLAYERS = 'SET_PLAYERS';
const ADD_PLAYER = 'ADD_PLAYER';
const MOVE_PLAYER = 'MOVE_PLAYER';
const REMOVE_PLAYER = 'REMOVE_PLAYER';
const SET_CURRENT_PLAYER_ID='SET_CURRENT_PLAYER_ID'

const initialState = {
    current_player_id:null,
    players: [],
};

const gameReducer = (state = initialState, action = {}) => {
    console.log('Action:', action.type, 'Payload:', action.payload);
    switch (action.type) {
        case SET_CURRENT_PLAYER_ID:
            return {
                ...state,
                current_player_id:action.payload
            }

        case SET_PLAYERS:
            return {        ...state,
                players: action.payload!==null?state.players.map(p =>
                    p.id === action.payload.id ? { ...p, ...action.payload } : p
                ):[]

            };
        case ADD_PLAYER:
            return {
                ...state,
                players: Array.isArray(state.players)
                    ? state.players.some(player => player.id === action.payload.id)
                        ? state.players
                        : [...state.players, action.payload]
                    : [action.payload]
            };

        case MOVE_PLAYER:
            if(action.payload.id===state.current_player_id)return{...state}
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

export const setCurrentPlayerId = playerId => ({
    type: SET_CURRENT_PLAYER_ID,
    payload: playerId
});

export default gameReducer;
