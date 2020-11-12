import { gql } from '@apollo/client';

export default {
    login: gql`
        mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                message            
                userID
                token
            }
        }`
    ,

    signup: gql`
        mutation Signup($email: String!, $password: String!) {
            signup(email: $email, password: $password) {
                message            
                userID
                token
            }
        }`
    ,
}