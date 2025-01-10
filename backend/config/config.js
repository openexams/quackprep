import dotenv from "dotenv";
import OpenAI from "openai";

global.NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === undefined) {
  dotenv.config({
    path: "../../secrets.env",
    debug: true,
  });
}
global.NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV == undefined) {
  throw Error("fatal error ENV VARS NOT LOADED");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const MYSQL_CONFIG = {
  host: process.env.MADDOX_MYSQL_SERVER,
  user: process.env.MADDOX_MYSQL_USERNAME,
  password: process.env.MADDOX_MYSQL_PASSWORD,
  database: process.env.MADDOX_MYSQL_DB,
  port: process.env.MADDOX_MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
  timezone: "Z", // This sets the timezone to UTC
};

export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    domain: process.env.NODE_ENV === "prod" ? "quackprep.com" : "",
    httpOnly: process.env.NODE_ENV === "prod" ? true : false,
    secure: process.env.NODE_ENV !== "local",
    sameSite: true,
  },
};

export const REDIS_CONFIG = {
  url: process.env.REDIS_URL, // why does this work?
};

export const GOOGLE_OAUTH_CONFIG = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`, // local or prod
};
