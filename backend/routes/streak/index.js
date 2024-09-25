import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getStreakData,
  hasStreak,
  getTopStreaks,
  claimStreak,
} from "#models/streak/index.js";
import express from "express";

const router = express.Router();

router.use(isAuthenticated);

// does user have streak

router.get("/has_streak", async function (req, res) {
  try {
    const bool = await hasStreak(req.user);
    res.status(200).json(bool);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server errored getting users streak" });
  }
});

router.get("/top/:amt", async function (req, res) {
  try {
    if (parseInt(req.params.amt) != 5) {
      throw Error("hacker");
    }
    const result = await getTopStreaks(req.params.amt);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get top streaks with amt ${req.params.amt}`,
    });
  }
});

// gets all of the users current streak data
router.get("/", async function (req, res) {
  try {
    const data = await getStreakData(req.user);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "failed to get all streak data" });
  }
});

// lets user claim a streak
router.post("/", async function (req, res) {
  try {
    const data = await claimStreak(req.user);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "failed to claim streak" });
  }
});

export default router;
