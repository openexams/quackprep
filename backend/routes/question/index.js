import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  createQuestionInTopic,
  getQuestionsByExamId,
  getQuestionsByTopicId,
  linkQuestionToExam,
} from "#models/question/index.js";

const router = express.Router();
router.use(isAuthenticated);

router.get("/topic/:group_id", async function (req, res) {
  try {
    const result = await getQuestionsByTopicId(req.params.group_id);
    //console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by topic id ${req.params.group_id}`,
    });
  }
});

router.get("/exam/:group_id", async function (req, res) {
  try {
    const result = await getQuestionsByExamId(req.params.group_id);
    //console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by exam id ${req.params.topic_id}`,
    });
  }
});

// Creates Question AND links it to a topic
router.post("/", async function (req, res) {
  // ALLA THIS SHIT NEEDS FIXED TODO
  try {
    if (!req.body) {
      throw Error("need body");
    }
    const data = req.body;
    const result = await createQuestionInTopic(
      req.user,
      data.topic_id,
      data.question,
      data.year,
      data.semester,
      data.exam_num,
      data.question_num_on_exam
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to add question by topic id ${req.body?.topic_id}`,
    });
  }
});

// C
router.post("/exam_link", async function (req, res) {
  // ALLA THIS SHIT NEEDS FIXED TODO
  try {
    if (!req.body.exam_id || !req.body.question_id) {
      throw Error("bruh");
    }
    const data = req.body;
    const result = await linkQuestionToExam(data.exam_id, data.question_id);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to link question to exam id ${req.body?.exam_id}`,
    });
  }
});

export default router;
