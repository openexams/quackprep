import { Router } from "express";
import {
  getWhichUsersAnsweredMostQuestions,
  getQuestionsAnsweredByMonthAndYear,
  getTotalSubmissions,
} from "#models/stats/index.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = Router();

router.get("/qsansweredbymandy", async function (req, res) {
  try {
    const result = await getQuestionsAnsweredByMonthAndYear();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      "failed to get questions answered by month and year",
      error
    );
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

router.get("/answer/total", async function (req, res) {
  try {
    const result = await getTotalSubmissions();
    res.status(201).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to getTotalSubmissions", error);
  }
});

export default router;
