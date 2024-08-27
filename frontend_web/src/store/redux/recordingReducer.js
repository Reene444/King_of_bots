// Action Types
const START_RECORDING = 'START_RECORDING';
const STOP_RECORDING = 'STOP_RECORDING';
const UPDATE_STATUS = 'UPDATE_STATUS';

// Initial State
const initialState = {
    isRecording: false,
};

// Reducer
const recordingReducer = (state = initialState, action= {}) => {
    switch (action.type) {
        case START_RECORDING:
            return { ...state, isRecording: true };
        case STOP_RECORDING:
            return { ...state, isRecording: false };
        case UPDATE_STATUS:
            return { ...state, isRecording: action.payload };
        default:
            return state;
    }
};

// Action Creators
export const startRecording = () => ({
    type: START_RECORDING,
});

export const stopRecording = () => ({
    type: STOP_RECORDING,
});

export const updateStatus = status => ({
    type: UPDATE_STATUS,
    payload: status,
});

export default recordingReducer;
