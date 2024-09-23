import dotenv from "dotenv";

global.NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV === undefined) {
  dotenv.config({
    path: "../../secrets.env",
  });
}
global.NODE_ENV = process.env.NODE_ENV;

console.log(NODE_ENV);

export const MYSQL_CONFIG = {
  host: NODE_ENV == "prod" ? process.env.MYSQL_URL : process.env.MYSQL_SERVER,
  user: NODE_ENV == "prod" ? null : process.env.MYSQL_USERNAME,
  password: NODE_ENV == "prod" ? null : process.env.MYSQL_PASSWORD,
  database: NODE_ENV == "prod" ? null : process.env.MYSQL_DB,
  port: NODE_ENV == "prod" ? null : process.env.MYSQL_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
};

export const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    domain: process.env.NODE_ENV === "prod" ? ".quackprep.com" : "",
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
