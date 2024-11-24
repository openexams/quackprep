import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getStreakData,
  hasStreak,
  getTopStreaks,
  claimStreak,
} from "#models/streak/index.js";
import { commonErrorMessage } from "#utils/utils.js";
import express from "express";

const router = express.Router();

router.get("/has_streak", isAuthenticated, async function (req, res) {
  try {
    const bool = await hasStreak(req.user);
    res.status(200).json(bool);
  } catch (error) {
    console.log(error);
    commonErrorMessage(
      res,
      500,
      `failed to get if user ${req.user} has a current streak`,
      error
    );
  }
});

router.get("/top/:amt", async function (req, res) {
  try {
    if (parseInt(req.params.amt) != 5) {
      commonErrorMessage(res, 400, "only 5 top streaks are allowed");
      return;
    }
    const result = await getTopStreaks(req.params.amt);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get top streaks", error);
  }
});

// gets all of the users current streak data
router.get("/", isAuthenticated, async function (req, res) {
  try {
    const data = await getStreakData(req.user);
    res.status(200).json(data);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get streak data", error);
  }
});

// lets user claim a streak
router.post("/", isAuthenticated, async function (req, res) {
  try {
    const data = await claimStreak(req.user);
    if (!data?.current_streak) {
      // data will be {} if no streak was claimed
      commonErrorMessage(
        res,
        400,
        "failed to claim streak, you probably alr have a streak"
      );
      return;
    }
    res.status(201).json(data);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to claim streak", error);
  }
});

export default router;
