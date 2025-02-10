import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  createQuestionReport,
  getQuestionsByGroupId,
  getQuestionsByUserId,
  upsertQuestion,
} from "#models/question/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import favRouter from "./favorite/index.js";
import voteRouter from "./vote/index.js";
import postRouter from "./post/index.js";
import { BadRequestError } from "#utils/ApiError.js";
const router = express.Router();

router.use("/vote", voteRouter);

router.use("/favorite", favRouter);
router.use("/post", postRouter);

router.get("/user", isAuthenticated, async function (req, res, next) {
  try {
    const result = await getQuestionsByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:group_id", async function (req, res, next) {
  try {
    const result = await getQuestionsByGroupId(req.params.group_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:question_id",
  isAuthenticated,
  isCreator,
  async function (req, res, next) {
    try {
      const question_id = parseInt(req.params.question_id);
      const result = await cascadeSetDeleted(
        req.user,
        "question",
        question_id,
        0,
        0,
        1,
        1,
        0
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", isAuthenticated, isCreator, async function (req, res, next) {
  const data = req.body;
  try {
    if (!data.question || !Array.isArray(data?.group_ids)) {
      return next(
        new BadRequestError(
          `please send in a question (string) and group_ids (array<int>)`
        )
      );
    }
    const question = await upsertQuestion(
      data?.id,
      data.question,
      req.user,
      data.group_ids // destructure group ids into last arg
    ); // will be the id of the question, however question_id will be an array of 2 as duplicate groups occur
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/report/:question_id",
  isAuthenticated,
  async function (req, res, next) {
    const { text } = req.body;
    if (!text || !req.params.question_id) {
      return next(
        new BadRequestError(
          `please send in a text (string) and question_id (int)`
        )
      );
    }
    try {
      const result = await createQuestionReport(
        req.user,
        req.params.question_id,
        text
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
