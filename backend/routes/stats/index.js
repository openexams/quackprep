import { Router } from "express";
import {
  getWhichUsersAnsweredMostQuestions,
  getQuestionsAnsweredByMonthAndYear,
  getTotalAiQuestions,
} from "#models/stats/index.js";
import { commonErrorMessage } from "#utils/utils.js";
import { getTotalTimeSpent } from "#models/account/index.js";
import { getTotalClasses } from "#models/class/index.js";

const router = Router();

router;

router.get("/", async function (req, res) {
  try {
    const result = {};
    result["qsansweredbymandy"] = await getQuestionsAnsweredByMonthAndYear();
    result["total_ai_questions"] = await getTotalAiQuestions();
    result["tts"] = await getTotalTimeSpent();
    result["questionsAnsweredByMonthAndYear"] =
      await getQuestionsAnsweredByMonthAndYear();
    result["total_classes_created"] = await getTotalClasses();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get all base stats", error);
  }
});

router.get("/answer/top", async function (req, res) {
  try {
    const result = await getWhichUsersAnsweredMostQuestions();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      "failed to getWhichUsersAnsweredMostQuestions",
      error
    );
  }
});

export default router;
