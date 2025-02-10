import { secrets } from "#config/secrets.js";
import OpenAI from "openai";
import { S3Client } from "@aws-sdk/client-s3";

export const corsOrigins = [
  "https://accounts.google.com/o/oauth2",
  "https://api.quackprep.com",
  "https://quackprep.com",
  "https://www.quackprep.com",
  "https://quackprep.pages.dev",
];
if (secrets.NODE_ENV === "local") corsOrigins.push("http://localhost:3001"); // maybe bad pratice

export const myS3Client = new S3Client({
  region: "auto",
  endpoint: secrets.R2_ENDPOINT,
  credentials: {
    secretAccessKey: secrets.R2_SECRET_ACCESS_KEY,
    accessKeyId: secrets.R2_ACCESS_KEY_ID,
  },
});

export const openai = new OpenAI({
  apiKey: secrets.OPENAI_API_KEY,
});

export const deepseek = new OpenAI({
  apiKey: secrets.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

export const MYSQL_CONFIG = {
  host: secrets.MADDOX_MYSQL_SERVER,
  user: secrets.MADDOX_MYSQL_USERNAME,
  password: secrets.MADDOX_MYSQL_PASSWORD,
  database: secrets.MADDOX_MYSQL_DB,
  port: secrets.MADDOX_MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  timezone: "Z", // This sets the timezone to UTC
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

export const SESSION_CONFIG = {
  secret: secrets.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    domain: secrets.NODE_ENV === "prod" ? "quackprep.com" : "",
    httpOnly: secrets.NODE_ENV === "prod" ? true : false,
    secure: secrets.NODE_ENV !== "local",
    sameSite: true,
  },
};

export const REDIS_CONFIG = {
  url: secrets.REDIS_URL, // why does this work?
};

export const GOOGLE_OAUTH_CONFIG = {
  clientID: secrets.GOOGLE_CLIENT_ID,
  clientSecret: secrets.GOOGLE_CLIENT_SECRET,
  callbackURL: `${secrets.BACKEND_URL}/api/auth/google/callback`, // local or prod
};

export const MATHPIX_API_INFO = {
  MATHPIX_API_KEY: secrets.MATHPIX_API_KEY,
  MATHPIX_APP_ID: secrets.MATHPIX_APP_ID,
};

export const email_auth = {
  user: secrets.QUACKPREP_EMAIL_USER,
  pass: secrets.QUACKPREP_EMAIL_PASS,
};
