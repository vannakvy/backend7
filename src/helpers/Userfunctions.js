import {
    pick
} from 'lodash';

import {
    sign,
} from 'jsonwebtoken';

import {
    SECRET
} from '../config';

export const issueAuthToken = async (jwtPayload) => {
    let token = await sign(jwtPayload, SECRET, {
        expiresIn: '1d'
    });
    return `Bearer ${token}`;
};

export const serializeUser = user => pick(user, [
    'id',
    'email',
    'username',
    'lastName',
    'firstName',
    'roles',
    'tel'
]);