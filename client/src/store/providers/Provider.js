import React from 'react';

import AppRouter from '../../routers/AppRouter';
import {BrowserRouter} from 'react-router-dom'

import { CoreProvider } from './CoreProvider';
import { AuthProvider } from './AuthProvider';

function Provider() {
    return (
        <AuthProvider>
            <CoreProvider>
                <BrowserRouter>
                    <AppRouter/>
                </BrowserRouter>
            </CoreProvider>
        </AuthProvider>
    );
}

export default Provider;