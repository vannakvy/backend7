import {
    config
} from 'dotenv';

const {
    parsed
} = config();

export const {
    DB,
    PORT,
    PROD,
    SECRET_ACCESS_KEY,
    SECRET_REFRESH_TIME,
    SECRET_REFRESH_KEY,
    SECRET_ACCESS_TIME,
    IN_PROD = PROD === 'production',
    BASE_URL = `http://localhost:${PORT}`,
} = parsed;







