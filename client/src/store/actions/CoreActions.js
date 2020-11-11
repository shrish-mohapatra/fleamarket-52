import axios from 'axios';

export default {
    getUser: async(args) => {        
        let {userID} = args;

        try {
            const result = await axios.post("/api/graph", { query: 
                `
                {
                    user(id: "${userID}") {
                        email
                        accounts{
                            balance
                            portfolio{
                                id
                                shares
                            }
                        }
                    }
                }
                `
            })

            if(result.data.errors) return {message: result.data.errors[0].message}
            return result.data.data.user
        } catch (error) {
            return {message: error.response}
        }
    },
}