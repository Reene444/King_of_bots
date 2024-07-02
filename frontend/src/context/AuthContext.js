import React, { createContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
    isAuthenticated: false,
    user: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const storedAuthState = localStorage.getItem('authState');
        if (storedAuthState) {
            console.log("checkhere");
            const { isAuthenticated, user } = JSON.parse(storedAuthState);
            if (isAuthenticated) {
                dispatch({ type: 'LOGIN', payload: user });
            }
        }
    }, []);

    const login = (user) => {
        dispatch({ type: 'LOGIN', payload: user });
        localStorage.setItem('authState', JSON.stringify({ isAuthenticated: true, user }));
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('authState');
    };

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };


// src/context/AuthContext.js
// import React, { createContext, useState } from 'react';
//
// export const AuthContext = createContext();
//
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//
//     const login = (userData) => {
//         setUser(userData);
//         // Save user data to localStorage or other storage if needed
//     };
//
//     const logout = () => {
//         setUser(null);
//         // Clear user data from localStorage or other storage if needed
//     };
//
//     return (
//         <AuthContext.Provider value={{ user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };
