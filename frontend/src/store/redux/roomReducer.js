

// Action Types
const JOIN_ROOM = 'JOIN_ROOM';
const LEAVE_ROOM = 'LEAVE_ROOM';

// Initial State
const initialState = {
    roomId: null,
};

// Reducer
const roomReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case JOIN_ROOM:
            return { ...state, roomId: action.payload };
        case LEAVE_ROOM:
            return { ...state, roomId: null };
        default:
            return state;
    }
};

// Action Creators
export const joinRoom = roomId => ({
    type: JOIN_ROOM,
    payload: roomId
});

export const leaveRoom = () => ({
    type: LEAVE_ROOM
});

export default roomReducer;
