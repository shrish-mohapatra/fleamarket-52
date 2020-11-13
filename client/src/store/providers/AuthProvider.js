import React, { useState, createContext } from 'react';
import { useMutation } from '@apollo/client';
import actions from '../actions/AuthActions'


export const AuthContext = createContext({
    userID: "",
    token: "",
})

export const AuthProvider = ({children}) => {
    const [userID, setUserID] = useState("");
    const [token, setToken] = useState("");

    const [login] = useMutation(actions.login)
    const [signup] = useMutation(actions.signup)

    const updateAuth = (result) => {
        localStorage.setItem('token', result.token)
        localStorage.setItem('userID', result.userID)

        setUserID(result.userID)
        setToken(result.setToken)
    }

    return (
        <AuthContext.Provider
            value={{
                userID,
                token,

                login: async (args) => {
                    try {
                        const result = await login({variables: args})
                        updateAuth(result.data.login)
                    } catch(error) {
                        return error.message
                    }
                },

                signup: async (args) => {
                    try {
                        const result = await signup({variables: args})
                        updateAuth(result.data.signup)
                    } catch(error) {
                        return error.message
                    }
                },

                updateToken: (newToken) => {
                    localStorage.setItem('token', newToken)
                    setToken(newToken)
                },
                
                local_auth: () => {
                    const token = localStorage.getItem('token')
                    const userID = localStorage.getItem('userID')

                    if(token && userID) {
                        setToken(token)
                        setUserID(userID)            

                        return {token, userID}
                    }
                    
                    return false
                },

                logout: () => {
                    setUserID("");
                    setToken("");

                    localStorage.clear();
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}