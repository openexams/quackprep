import { Router } from "express";
import {
  getMyStats,
  getTotalTimeSpent,
  upsertTimeSpent,
} from "#models/account/index.js";

import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = Router();

router.post("/time_spent", isAuthenticated, async function (req, res) {
  try {
    const result = await upsertTimeSpent(req.user); // always 5 min
    res.status(201).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      "failed to update your time spent on the site",
      error
    );
  }
});

router.get("/time_spent/total", async function (req, res) {
  try {
    const result = await getTotalTimeSpent();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get total time spent", error);
  }
});

router.get("/stats", isAuthenticated, async function (req, res) {
  try {
    const result = await getMyStats(req.user);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get stats by user_id ${req.user}`,
      error
    );
  }
});

export default router;
