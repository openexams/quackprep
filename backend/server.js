import "#utils/utils.js"; //keep
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import router from "./routes/index.js";
import passport from "./config/passportConfig.js";
import RedisStore from "connect-redis";
import redis from "redis";

import bodyParser from "body-parser";
import { REDIS_CONFIG, SESSION_CONFIG } from "./config/config.js";
import sqlExe from "#db/dbFunctions.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { hasStreak } from "#models/streak/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log(path.join(__dirname, "./public/"));

app.use(express.json());

app.set("trust proxy", 1);

let corsOrigins = [
  "https://accounts.google.com/o/oauth2",
  "https://api.quackprep.com",
  "https://quackprep.com",
  "https://www.quackprep.com",
  "https://quackprep-production.up.railway.app",
];
if (NODE_ENV === "local") corsOrigins.push("http://localhost:3001"); // maybe bad pratice

const corsOrigin = {
  origin: corsOrigins,
  credentials: true,
  optionSuccessStatus: 200,
};

console.log(NODE_ENV);

if (NODE_ENV === "prod") {
  console.log("Connecting to redis...");
  const redisClient = redis.createClient(REDIS_CONFIG);

  try {
    await redisClient.connect();
    console.log("Connected to redis");
  } catch (error) {
    console.log("Failed to connect to redis\n", error);
  }

  redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
  });
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      ...SESSION_CONFIG,
    })
  );
} else {
  app.use(session(SESSION_CONFIG));
}

await sqlExe.test();

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 min
    limit: 150, // small but prob good
  })
);
app.use(cors(corsOrigin));
app.use(
  morgan(
    `[:date[clf]] :method :url :status :response-time ms - :res[content-length]`
  )
);

app.use(bodyParser.urlencoded({ extended: true }));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
/** *        *          *     */

app.use(express.static(path.join(__dirname, "./public/")));

app.use("/api", router);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

//test db connections
