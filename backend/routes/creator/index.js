import { Router } from "express";

import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";
import { makeUserACreator } from "#models/creator/index.js";

const router = Router();

router.post("/become", isAuthenticated, async function (req, res) {
  try {
    await makeUserACreator(req.user);
    res.status(201).json({ message: "you are now a creator" });
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to make user ${req.user} a creator`,
      error
    );
    return;
  }
});

export default router;
