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
    SECRET,
    IN_PROD = PROD === 'dev',
    BASE_URL = `http://localhost:${PORT}`,
} = parsed;





