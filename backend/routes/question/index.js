import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  deleteAllQuestionLinks,
  getQuestionsByGroupId,
  getQuestionsByUserId,
  linkQuestionToGroups,
  upsertQuestion,
} from "#models/question/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { isCreator } from "#middleware/creatorMiddleware";

const router = express.Router();
router.use(isAuthenticated);

router.get("/user", async function (req, res) {
  try {
    const result = await getQuestionsByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by user id ${req.user}`,
    });
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
    res.status(500).json({
      message: `failed to get question by group id ${req.params.group_id} and grouptype ${req.params.type}`,
    });
  }
});

router.delete("/:question_id", async function (req, res) {
  try {
    const question_id = parseInt(req.params.question_id);
    const result = await cascadeSetDeleted(
      req.user,
      "question",
      question_id,
      0,
      0,
      1,
      1
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to delete question by id ${req.params.question_id}`,
    });
  }
});

router.post("/", isCreator, async function (req, res) {
  const data = req.body;
  try {
    if (!data.question || !Array.isArray(data?.group_ids)) {
      res.status(400).json({
        message: `pass in all req args`,
      });
      return;
    }
    const question_id = await upsertQuestion(
      data?.id,
      data.question,
      data?.question_num_on_exam,
      req.user,
      data.group_ids // destructure group ids into last arg
    );
    if (data?.id) await deleteAllQuestionLinks(question_id); // deletes all of them only when its edited, if its being created it will have no links
    const affectedRows = await linkQuestionToGroups(
      question_id,
      data.group_ids
    );

    res.status(201).json(affectedRows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `failed to add question to groups || group`,
    });
  }
});

// TODO ADD QUESTION TO GROUP
export default router;
