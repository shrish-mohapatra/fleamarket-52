import axios from 'axios';

export default {
    login: async(args) => {
        const {email, password} = args;

        try {
            const result = await axios.post("/api/graph", { query: 
                `
                {
                    login(email: "${email}",password: "${password}") {
                        token
                        message
                    }
                }
                `
            })

            if(result.data.errors) return {message: result.data.errors[0].message}

            return {
                token: result.data.data.login.token,
                userID: result.data.data.login.userID,
            }
        } catch (error) {
            return {message: error.response}
        }
    },

    signup: async(args) => {
        const {email, password} = args;

        try {
            const result = await axios.post("/api/graph", { query: 
                `
                mutation{
                    signup(email: "${email}",password: "${password}") {
                        token
                        message
                    }
                }
                `
            })

            if(result.data.errors) return {message: result.data.errors[0].message}

            return {
                token: result.data.data.login.token,
                userID: result.data.data.login.userID,
            }
        } catch (error) {
            return {message: error.response}
        }
    },
}