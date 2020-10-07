import React from 'react';
import AppRouter from '../../routers/AppRouter';
import {BrowserRouter} from 'react-router-dom'
import { CoreProvider } from './CoreProvider';

function Provider() {
    return (
        <CoreProvider>
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </CoreProvider>
    );
}

export default Provider;