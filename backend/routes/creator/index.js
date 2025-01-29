import { Router } from "express";

import { isAuthenticated } from "#middleware/authMiddleware.js";
import { makeUserACreator } from "#models/creator/index.js";

const router = Router();

router.post("/become", isAuthenticated, async function (req, res, next) {
  try {
    await makeUserACreator(req.user);
    res.status(201).json({ message: "you are now a creator" });
  } catch (error) {
    next(error);
  }
});

export default router;
