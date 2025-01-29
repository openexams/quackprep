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
import { checkForBadWords } from "#middleware/badwordsMiddleware.js";
import { errorHandler } from "#middleware/errorHandler.js";
import { RATE_LIMIT_EXCEEDED } from "../error_codes.js";
import ApiError from "#utils/ApiError.js";
import { AI_ROUTES_RATE_LIMIT_PER_MIN } from "../constants.js";

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

const anonRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: 300, // small but prob good
  handler: (req, res) => {
    res.setHeader("retry-after", 60);
    errorHandler(
      new ApiError("Rate limit exceeded", 429, RATE_LIMIT_EXCEEDED),
      req,
      res
    );
  },
});

const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 min
  limit: AI_ROUTES_RATE_LIMIT_PER_MIN,
  handler: (req, res) => {
    res.setHeader("retry-after", 60);
    errorHandler(
      new ApiError("AI Rate limit exceeded", 429, RATE_LIMIT_EXCEEDED),
      req,
      res
    );
  },
});

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

// Move rate limiters before other middleware
app.use(anonRateLimit);
app.use("/api/ai", aiRateLimit);

// Then other middleware
app.use(express.static(path.join(__dirname, "./public/")));
app.use(checkForBadWords);

app.use("/api", router);

app.get("/*", (req, res) => {
  // never hits this with way I have frotend setup (its on cloudflare)
  res.redirect(process.env.FRONTEND_URL);
});

app.use(errorHandler);

await sqlExe.testConnection();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
