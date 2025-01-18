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
import path from "path";
import { fileURLToPath } from "url";
import { corsOrigins } from "./config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log(path.join(__dirname, "../."));

app.use(express.json());

app.set("trust proxy", 1);

const corsOrigin = {
  origin: corsOrigins, // allow only these to hit
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
  // never hits this with way I have frotend setup (its on cloudflare)
  res.redirect(process.env.FRONTEND_URL);
});

await sqlExe.testConnection();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
