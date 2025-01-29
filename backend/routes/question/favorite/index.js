import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getFavoriteQuestionsByUserId,
  upsertFavoriteQuestion,
} from "#models/question/favorite/index.js";
import { BadRequestError } from "#utils/ApiError.js";
const router = express.Router();

router.get("/", isAuthenticated, async function (req, res, next) {
  try {
    const result = await getFavoriteQuestionsByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async function (req, res, next) {
  const data = req.body;
  if (!data.question_id || data.is_favorite == null) {
    return next(
      new BadRequestError("please input a is_favorite and question_id")
    );
  }
  try {
    const result = await upsertFavoriteQuestion(
      data.id,
      data.question_id,
      data.is_favorite,
      req.user
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
