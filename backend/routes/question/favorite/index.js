import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  getFavoriteQuestionsByUserId,
  upsertFavoriteQuestion,
} from "#models/question/favorite/index.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = express.Router();

router.get("/", isAuthenticated, async function (req, res) {
  try {
    const result = await getFavoriteQuestionsByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get fav questions by user id ${req.user}`,
      error
    );
  }
});

router.post("/", isAuthenticated, async function (req, res) {
  const data = req.body;
  if (!data.question_id || data.is_favorite == null) {
    commonErrorMessage(res, 400, "please input a is_favorite and question_id");
    return;
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
    commonErrorMessage(
      res,
      500,
      `failed to get fav questions by user id ${req.user}`,
      error
    );
  }
});

export default router;
