import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const OAUTH_CONFIG = {
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/auth/oauth/callback`,
};