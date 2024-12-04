import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  createQuestionReport,
  deleteAllQuestionLinks,
  getQuestionsByGroupId,
  getQuestionsByUserId,
  linkQuestionToGroups,
  selectQuestion,
  upsertQuestion,
} from "#models/question/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = express.Router();

router.get("/user", isAuthenticated, async function (req, res) {
  try {
    const result = await getQuestionsByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get questions by user id ${req.user}`,
      error
    );
  }
});

router.get("/:group_id", async function (req, res) {
  try {
    const result = await getQuestionsByGroupId(
      req.params.group_id,
      req.params.type
    );
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get question by group id ${req.params.group_id} and grouptype ${req.params.type}`,
      error
    );
  }
});

router.delete(
  "/:question_id",
  isAuthenticated,
  isCreator,
  async function (req, res) {
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
      commonErrorMessage(
        res,
        500,
        `failed to delete question by id ${req.params.question_id}`,
        error
      );
    }
  }
);

router.post("/", isAuthenticated, isCreator, async function (req, res) {
  const data = req.body;
  try {
    if (!data.question || !Array.isArray(data?.group_ids)) {
      commonErrorMessage(
        res,
        500,
        `please send in a question (string) and group_ids (array<int>)`
      );
      return;
    }
    const questions = await upsertQuestion(
      data?.id,
      data.question,
      data?.question_num_on_exam,
      req.user,
      data.group_ids // destructure group ids into last arg
    ); // will be the id of the question, however question_id will be an array of 2 as duplicate groups occur
    const question_id = questions?.[0]?.id;
    if (data?.id) await deleteAllQuestionLinks(question_id); // deletes all of them only when its edited, if its being created it will have no links
    await linkQuestionToGroups(question_id, data.group_ids); // links question to the groups

    res.status(201).json(questions);
  } catch (error) {
    commonErrorMessage(res, 500, `failed to create question`, error);
  }
});

router.post("/report/:question_id", isAuthenticated, async function (req, res) {
  const { text } = req.body;
  if (!text || !req.params.question_id) {
    commonErrorMessage(
      res,
      500,
      `please send in a text (string) and question_id (int)`
    );
    return;
  }
  try {
    const result = await createQuestionReport(
      req.user,
      req.params.question_id,
      text
    );
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to report question by id ${req.params.question_id}`,
      error
    );
  }
});

export default router;
