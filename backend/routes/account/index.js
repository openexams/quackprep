import { Router } from "express";
import {
  getMyStats,
  getTotalTimeSpent,
  upsertTimeSpent,
  getUserCount,
} from "#models/account/index.js";

import { isAuthenticated } from "#middleware/authMiddleware.js";

const router = Router();

router.get("/users/count", async function (req, res, next) {
  try {
    const result = await getUserCount();
    res.status(200).json(result?.[0].COUNT);
  } catch (error) {
    next(error);
  }
});

router.post("/time_spent", isAuthenticated, async function (req, res, next) {
  try {
    const result = await upsertTimeSpent(req.user); // always 5 min
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/time_spent/total", async function (req, res, next) {
  try {
    const result = await getTotalTimeSpent();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/stats", isAuthenticated, async function (req, res, next) {
  try {
    const result = await getMyStats(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
