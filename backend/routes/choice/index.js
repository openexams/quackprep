import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import {
  upsertChoiceToQuestion,
  getChoicesByQuestion,
  getQuestionsAnsweredByMonthAndYear,
  getWhichUsersAnsweredMostQuestions,
  postChoice,
  getChoicesByGroupId,
  addManyChoicesToQuestion,
  getChoicesByUserId,
  getTotalSubmissions,
} from "#models/choice/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { commonErrorMessage } from "#utils/utils.js";
import { Router } from "express";
import currentRouter from "./current/index.js";
import aiRouter from "./ai/index.js";

const router = Router();

router.use("/current", currentRouter);
router.use("/ai", aiRouter);

// answers transactional
router.post("/answer/", async function (req, res) {
  const data = req.body;
  if (!data.question_id || !data.choice_id) {
    commonErrorMessage(res, 400, "please include a choice & question");
    return;
  }
  try {
    const result = await postChoice(
      req.user || null,
      data.choice_id,
      data.question_id,
      data?.text
    );
    res.status(201).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to post answer", error);
  }
});

router.get("/top", async function (req, res) {
  try {
    const result = await getWhichUsersAnsweredMostQuestions();
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get top users", error);
  }
});

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

/// CRUD CHOICES

//// R
router.get("/user", isAuthenticated, async function (req, res) {
  try {
    const result = await getChoicesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get choice by user", error);
  }
});

router.get("/:question_id", async function (req, res) {
  try {
    const result = await getChoicesByQuestion(req.params.question_id);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get choices by q.id ${req.params.question_id}`,
      error
    );
  }
});

router.get("/group/:group_id", async function (req, res) {
  try {
    const result = await getChoicesByGroupId(req.params.group_id);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get choices by group id ${req.params.group_id}`,
      error
    );
  }
});

// C

router.post(
  "/many/:question_id",
  isAuthenticated,
  isCreator,
  async function (req, res) {
    const data = req.body;
    try {
      if (!data?.choices) {
        throw Error("pls send all json body");
      }

      const result = await addManyChoicesToQuestion(
        parseInt(req.params.question_id),
        req.user,
        data.choices
      );

      res.status(201).json(result);
    } catch (error) {
      commonErrorMessage(
        res,
        500,
        `failed to add many choices to q id ${req.params.question_id}`,
        error
      );
    }
  }
);

router.post(
  "/:question_id",
  isAuthenticated,
  isCreator,
  async function (req, res) {
    const data = req.body;
    try {
      if (data?.text == null || data?.isCorrect == null || !data?.type) {
        commonErrorMessage(
          res,
          400,
          "send body with text (string), isCorrect(bool), type"
        );
      }

      const result = await upsertChoiceToQuestion(
        req.user,
        req.params.question_id,
        data.isCorrect,
        data.text,
        data.type,
        data?.id || null
      );
      res.status(201).json(result);
    } catch (error) {
      commonErrorMessage(
        res,
        500,
        `failed to add choice to q id ${req.params.question_id}`,
        error
      );
    }
  }
);

// D
router.delete(
  "/:choice_id",
  isAuthenticated,
  isCreator,
  async function (req, res) {
    try {
      const choice_id = parseInt(req.params.choice_id);
      const result = await cascadeSetDeleted(
        req.user,
        "choice",
        choice_id,
        0,
        0,
        0,
        1,
        0
      );
      res.status(200).json(result);
    } catch (error) {
      commonErrorMessage(
        res,
        500,
        `failed to delete choice ${req.params.choice_id}`,
        error
      );
    }
  }
);

router.get("/answer/total", async function (req, res) {
  try {
    const result = await getTotalSubmissions();
    res.status(201).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to getTotalSubmissions", error);
  }
});

export default router;
