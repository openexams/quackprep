import { isAuthenticated } from "#middleware/authMiddleware.js";
import { upsertVoteOnClass } from "#models/class/vote/index.js";

import express from "express";
import { classVotePostSchema } from "../../../../schema/index.js";

const router = express.Router();

router.post("/", isAuthenticated, async function (req, res, next) {
  const data = req.body;
  try {
    const validated = classVotePostSchema.parse(data);
    const result = await upsertVoteOnClass(
      validated.class_id,
      validated.vote,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
