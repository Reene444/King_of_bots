// Action Types
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const UPDATE_USER = 'UPDATE_USER';

// Initial State
const initialState = {
    user: {
        id:null,
        name:null
    },
    /**
     * user{
     *     id;
     *     name;
     * }
     */
    isAuthenticated: false,
};

// Reducer
const authReducer = (state = initialState, action= {}) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, user: action.payload, isAuthenticated: true };
        case LOGOUT:
            return { ...state, user: null, isAuthenticated: false };
        case UPDATE_USER:
            return { ...state, user: action.payload };
        default:
            return state;
    }
};

// Action Creators
export const login = user => ({
    type: LOGIN,
    payload: user
});

export const logout = () => ({
    type: LOGOUT,
});

export const updateUser = user => ({
    type: UPDATE_USER,
    payload: user
});

export default authReducer;
