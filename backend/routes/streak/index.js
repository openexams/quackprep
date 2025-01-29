import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getStreakData,
  hasStreak,
  getTopStreaks,
  claimStreak,
} from "#models/streak/index.js";
import express from "express";
import { BadRequestError } from "#utils/ApiError.js";

const router = express.Router();

router.get("/has_streak", isAuthenticated, async function (req, res, next) {
  try {
    const bool = await hasStreak(req.user);
    res.status(200).json(bool);
  } catch (error) {
    next(error);
  }
});

router.get("/top/:amt", async function (req, res, next) {
  try {
    if (parseInt(req.params.amt) != 5) {
      return next(new BadRequestError("only 5 top streaks are allowed"));
    }
    const result = await getTopStreaks(req.params.amt);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// gets all of the users current streak data
router.get("/", isAuthenticated, async function (req, res, next) {
  try {
    const data = await getStreakData(req.user);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

// lets user claim a streak
router.post("/", isAuthenticated, async function (req, res, next) {
  try {
    const data = await claimStreak(req.user);
    if (!data?.current_streak) {
      // data will be {} if no streak was claimed
      return next(
        new BadRequestError(
          "failed to claim streak, you probably alr have a streak"
        )
      );
    }
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
