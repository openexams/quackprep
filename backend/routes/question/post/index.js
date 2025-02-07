import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { getQuestionPostsByQuestionId } from "#models/question/post/index.js";
import { questionPostSelectSchema } from "../../../../schema/index.js";
const router = express.Router();

router.get("/:question_id", async function (req, res, next) {
  try {
    const result = await getQuestionPostsByQuestionId(req.params.question_id);
    const validated = questionPostSelectSchema.array().parse(result); // val
    res.status(200).json(validated);
  } catch (error) {
    next(error);
  }
});

export default router;
