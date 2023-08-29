import { ObjectId } from 'mongodb';

export const PORT = Number(process.env.FM_ADMIN_PORT);
export const DB_URL = String(process.env.FM_ADMIN_DB_URL);
export const DB_NAME = String(process.env.FM_ADMIN_DB_NAME);
export const ADMIN_ID = ObjectId.createFromHexString(String(process.env.FM_ADMIN_ID));
export const CLOUDINARY_CLOUD_NAME = String(process.env.FM_ADMIN_CLD_NAME);
export const ALGOLIA_APP_ID = String(process.env.FM_ALGOLIA_APP_ID);
export const ALGOLIA_API_KEY = String(process.env.FM_ALGOLIA_API_KEY);
