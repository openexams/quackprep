import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { getQuestionsByTopic } from "#models/question/index.js";
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

export default router;
