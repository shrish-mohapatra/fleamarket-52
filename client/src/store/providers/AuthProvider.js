import React, { useState, createContext } from 'react';
import actions from '../actions/AuthActions'

export const AuthContext = createContext({
    userID: "",
    token: "",

    login: () => new Promise((resolve) => {}),
    signup: () => new Promise((resolve) => {}),
    logout: () => {},
})

export const AuthProvider = ({children}) => {
    const [userID, setUserID] = useState("");
    const [token, setToken] = useState("");

    const updateAuth = (result) => {
        if(result.message) return result.message;

        setUserID(result.userID)
        setToken(result.setToken)        
    }

    return (
        <AuthContext.Provider
            value={{
                userID,
                token,

                login: async (args) => {
                    let result = await actions.login(args);
                    return updateAuth(result)
                },

                signup: async (args) => {
                    let result = await actions.signup(args);
                    return updateAuth(result)
                },

                logout: () => {
                    setUserID("");
                    setToken("");
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}