import React, { createContext, useReducer, useContext } from 'react';

// Action types
const START_RECORDING = 'START_RECORDING';
const STOP_RECORDING = 'STOP_RECORDING';
const UPDATE_STATUS = 'UPDATE_STATUS';

// 创建 Context
const RecordingContext = createContext();

// Reducer function
const recordingReducer = (state, action) => {
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

// Initial state
const initialState = {
    isRecording: false,
};

// Context Provider Component
const RecordingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(recordingReducer, initialState);

    return (
        <RecordingContext.Provider value={{ state, dispatch }}>
            {children}
        </RecordingContext.Provider>
    );
};

// Hook to use recording context
const useRecording = () => useContext(RecordingContext);

export { RecordingProvider, useRecording, START_RECORDING, STOP_RECORDING, UPDATE_STATUS };
