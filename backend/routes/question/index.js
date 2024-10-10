import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  createQuestionInTopic,
  getQuestionsByTopic,
} from "#models/question/index.js";
import { getChoicesByQuestion } from "#models/answer/index.js";

const router = express.Router();
router.use(isAuthenticated);

router.get("/:topic_id", async function (req, res) {
  try {
    const result = await getQuestionsByTopic(req.params.topic_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by topic id ${req.params.topic_id}`,
    });
  }
});

///

router.get("/choices/:question_id", async function (req, res) {
  try {
    res.status(400).json({ message: "old route hit update code maddox" });
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by topic id ${req.params.question_id}`,
    });
  }
});

// C
router.post("/", async function (req, res) {
  try {
    if (!req.body) {
      throw Error("need body");
    }
    const data = req.body;
    let result;
    if (req.headers?.token) {
      // ABSRTRAC
      result = await createQuestionInTopic(
        await checkApiKey(req.headers.token),
        data.topic_id,
        data.question,
        data.year,
        data.semester,
        data.exam_num,
        data.question_num_on_exam
      );
    } else {
      result = await createQuestionInTopic(
        req.user,
        data.topic_id,
        data.question,
        data.year,
        data.semester,
        data.exam_num,
        data.question_num_on_exam
      );
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by topic id ${req.params.question_id}`,
    });
  }
});

export default router;
