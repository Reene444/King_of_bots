    import {v4 as uuidv4} from "uuid";
    import {generateInitialSegments} from "../../common/utils/generateInitialSegments";
    import getRandomColor from "../../common/utils/randomColor";
    import {useSelector} from "react-redux";
    import { curry } from "lodash";


    const SET_PLAYERS = 'SET_PLAYERS';
    const ADD_PLAYER = 'ADD_PLAYER';
    const MOVE_PLAYER = 'MOVE_PLAYER';
    const REMOVE_PLAYER = 'REMOVE_PLAYER';
    const SET_CURRENT_PLAYER='SET_CURRENT_PLAYER'
    const ADD_CURRENT_PLAYER_OFFSET=' ADD_CURRENT_PLAYER_OFFSET'
    const SET_CURRENT_PLAYER_OFFSET=' SET_CURRENT_PLAYER_OFFSET'
    const initialState = {
        current_player:null,
        current_player_offset:{x:0,y:0},
        players: [],
    };

    const gameReducer = (state = initialState, action = {}) => {
        console.log('Action:', action.type, 'Payload:', action.payload);
        switch (action.type) {
            case SET_CURRENT_PLAYER:
                return {
                    ...state,
                    current_player:action.payload===null?null:action.payload
                }
                case  ADD_CURRENT_PLAYER_OFFSET:
                    console.log("Current offset:", state.current_player_offset);
                    console.log("Payload offset:", action.payload);
                    const newOffset = {
                        x: state.current_player_offset.x + action.payload.x,
                        y: state.current_player_offset.y + action.payload.y
                    };
                    console.log("New offset:", newOffset);
                    return {
                        ...state,
                        current_player_offset: newOffset
                    };
                    case  SET_CURRENT_PLAYER_OFFSET:
                        console.log("Current offset:", state.current_player_offset);
                        console.log("Payload offset:", action.payload);
                        const newOffset2 = {
                            x: action.payload.x,
                            y: action.payload.y
                        };
                        console.log("New offset:", newOffset2);
                        return {
                            ...state,
                            current_player_offset: newOffset2
                        };
            case SET_PLAYERS:
                return {       
                    ...state,
                    players:action.payload===null?null:
                    state.players.map(p =>
                        p.id === action.payload.id ? { ...p, ...action.payload } : p
                    )

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
                if(action.payload.id===state.current_player.id)return{...state}
                return {
                    ...state,
                    players: Array.isArray(state.players) ? state.players.map(player =>
                        player.id === action.payload.id
                            ? { ...player,
                                segments: [
                                    { x: action.payload.head_drift.x+player.segments[0].x, y: action.payload.head_drift.y+player.segments[0].y },
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

    export const setCurrentPlayer = player => ({
        type: SET_CURRENT_PLAYER,
        payload: player
    });
    export const addCurrentPlayerOffset = offset => ({
        type:   ADD_CURRENT_PLAYER_OFFSET,
        payload: offset
    });
    export const setCurrentPlayerOffset = offset => ({
        type:   SET_CURRENT_PLAYER_OFFSET,
        payload: offset
    });
    export default gameReducer;
