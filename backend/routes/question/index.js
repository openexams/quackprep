import express from "express";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  createQuestionInGroups,
  getQuestionsByGroupId,
} from "#models/question/index.js";

const router = express.Router();
router.use(isAuthenticated);

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

router.post("/", async function (req, res) {
  const data = req.body;
  try {
    if (!data.question || !Array.isArray(data?.group_ids)) {
      res.status(400).json({
        message: `pass in all req args`,
      });
      return;
    }
    const result = await createQuestionInGroups(
      req.user,
      data.question,
      data?.question_num_on_exam,
      ...data.group_ids // destructure group ids into last arg
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to add question to groups || group`,
    });
  }
});

// TODO ADD QUESTION TO GROUP
export default router;
