import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";
import { upsertVoteOnQuestion } from "#models/question/vote/index.js";

const router = express.Router();

router.post("/", isAuthenticated, async function (req, res) {
  const data = req.body;
  if (!data.question_id || (data.vote !== 0 && data.vote !== 1)) {
    commonErrorMessage(res, 400, "please include a vote & question_id", null);
    return;
  }
  try {
    const result = await upsertVoteOnQuestion(
      req.user,
      data.question_id,
      data.vote
    );
    res.status(201).json(result); // user does not need this back
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to vote on question w question_id ${data.question_id} and vote: ${data.vote}`,
      error
    );
  }
});

export default router;
