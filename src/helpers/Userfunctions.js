import {
    pick
} from 'lodash';

import {
    sign,
} from 'jsonwebtoken';

import {
    SECRET_ACCESS_KEY,
    SECRET_REFRESH_KEY,
    SECRET_ACCESS_TIME,  
    SECRET_REFRESH_TIME
} from '../config';

export const issueAuthToken = async (jwtPayload) => {
    let token = await sign(jwtPayload, SECRET_ACCESS_KEY, {
        expiresIn:SECRET_ACCESS_TIME
    });
    return `Bearer ${token}`;
};


export const issueAuthRefreshToken = async (jwtPayload) => {
    let token = await sign(jwtPayload, SECRET_REFRESH_KEY, {
        expiresIn: SECRET_REFRESH_TIME
    });
    return `Bearer ${token}`;
}

export const serializeUser = user => pick(user, [
    'id',
    'email',
    'username',
    'lastName',
    'firstName',
    'roles',
    'tel',
    'pages'
]);


