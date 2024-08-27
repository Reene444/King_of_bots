import { combineReducers } from 'redux';
import gameReducer from './gameReducer';
import authReducer from "./authReducer";
import recordingReducer from "./recordingReducer";
import roomReducer from "./roomReducer";
// import recordingReducer from '../pages/game/store/recordingReducer';

const rootReducer = combineReducers({
    game: gameReducer,
    auth: authReducer,
    recording: recordingReducer,
    room:roomReducer
});

export default rootReducer;
