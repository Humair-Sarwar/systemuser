import React from 'react';
import SystemUserLogin from '../pages/auth/SystemUserLogin';

const AuthRoutes = [
    {
        path: '/login',
        element: <SystemUserLogin />
    },
    {
        path: '/systemuser/login',
        element: <SystemUserLogin />
    },
    {
        path: '/systermuser/login',
        element: <SystemUserLogin />
    },
];

export default AuthRoutes;
