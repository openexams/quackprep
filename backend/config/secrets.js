import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if (!process.env.NODE_ENV) {
  dotenv.config({
    path: path.join(__dirname, "../../secrets.env"),
    debug: true,
  });
}
// if add secret make sure to add to .env test too
export const secrets = {
  NODE_ENV: process.env.NODE_ENV,
  SESSION_SECRET: process.env.SESSION_SECRET,
  MADDOX_MYSQL_USERNAME: process.env.MADDOX_MYSQL_USERNAME,
  MADDOX_MYSQL_PASSWORD: process.env.MADDOX_MYSQL_PASSWORD,
  MADDOX_MYSQL_SERVER: process.env.MADDOX_MYSQL_SERVER,
  MADDOX_MYSQL_DB: process.env.MADDOX_MYSQL_DB,
  MADDOX_MYSQL_PORT: process.env.MADDOX_MYSQL_PORT,
  REDIS_URL: process.env.REDIS_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  MATHPIX_API_KEY: process.env.MATHPIX_API_KEY,
  MATHPIX_APP_ID: process.env.MATHPIX_APP_ID,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  QUACKPREP_EMAIL_USER: process.env.QUACKPREP_EMAIL_USER,
  QUACKPREP_EMAIL_PASS: process.env.QUACKPREP_EMAIL_PASS,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT: process.env.R2_ENDPOINT,
};

if (secrets.NODE_ENV == undefined) {
  throw Error("fatal error ENV VARS NOT LOADED");
  process.exit(1);
} else {
  console.log("secrets found!");
}
