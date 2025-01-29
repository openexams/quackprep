import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { upsertVoteOnQuestion } from "#models/question/vote/index.js";
import { BadRequestError } from "#utils/ApiError.js";
const router = express.Router();

router.post("/", isAuthenticated, async function (req, res, next) {
  const data = req.body;
  if (!data.question_id || (data.vote !== 0 && data.vote !== 1)) {
    return next(new BadRequestError("please include a vote & question_id"));
  }
  try {
    const result = await upsertVoteOnQuestion(
      req.user,
      data.question_id,
      data.vote
    );
    res.status(201).json(result); // user does not need this back
  } catch (error) {
    next(error);
  }
});

export default router;
