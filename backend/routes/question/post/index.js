import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  deleteQuestionPost,
  getQuestionPostsByQuestionId,
  upsertQuestionPost,
} from "#models/question/post/index.js";
import {
  questionPostInsertSchema,
  questionPostSelectSchema,
} from "../../../../schema/index.js";
import { BadRequestError } from "#utils/ApiError.js";
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

router.post("/", isAuthenticated, async function (req, res, next) {
  const data = req.body;
  try {
    let validated;
    try {
      validated = questionPostInsertSchema.parse(data);
    } catch (error) {
      throw new BadRequestError(
        "please include all fields needed.",
        400,
        error
      );
      return;
    }
    const result = await upsertQuestionPost(
      validated.id,
      validated.post_id,
      validated.question_id,
      validated.text,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isAuthenticated, async function (req, res, next) {
  try {
    if (!req.params.id) {
      throw new BadRequestError("please include a id to delete");
    }
    const result = await deleteQuestionPost(req.params.id, req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
