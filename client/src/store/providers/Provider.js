import React from 'react';

import AppRouter from '../../routers/AppRouter';
import {BrowserRouter} from 'react-router-dom'

import { CoreProvider } from './CoreProvider';
import { AuthProvider } from './AuthProvider';

import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/api/graph',
  });
  
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')

    return {
        headers: {
            ...headers,
            token: token || "",
        }
    }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function Provider() {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <CoreProvider>
                    <BrowserRouter>
                        <AppRouter/>
                    </BrowserRouter>
                </CoreProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}

export default Provider;