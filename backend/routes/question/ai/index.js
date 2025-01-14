import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";
import { generateQuestionLike } from "#models/question/ai/index.js";

const router = express.Router();

router.post("/question_like", isAuthenticated, async function (req, res) {
  const data = req.body;
  if (!data.likeQuestionId || !data.likeQuestionText) {
    commonErrorMessage(
      res,
      400,
      "please select a question for an example for the ai"
    );
    return;
  }
  try {
    const result = await generateQuestionLike(
      req.user,
      data.likeQuestionText,
      data.likeQuestionId
    );
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to gen fav question based on question_id: ${data?.likeQuestionId}`,
      error
    );
  }
});

export default router;
