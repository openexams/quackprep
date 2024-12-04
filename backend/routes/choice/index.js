import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import {
  upsertChoiceToQuestion,
  getChoicesByQuestion,
  getQuestionsAnsweredByMonthAndYear,
  getWhichUsersAnsweredMostQuestions,
  postChoice,
  upsertCurrentChoice,
  getCurrentChoicesByGroupIdAndType,
  getChoicesByGroupId,
  addManyChoicesToQuestion,
  getChoicesByUserId,
} from "#models/choice/index.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { commonErrorMessage } from "#utils/utils.js";
import express, { Router } from "express";
const router = Router();

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

/**
 * pulls in the current choices that this user has,
 */
router.get(
  "/current/:group_id/:group_type",
  isAuthenticated,
  async function (req, res) {
    try {
      const result = await getCurrentChoicesByGroupIdAndType(
        req.user,
        req.params.group_id,
        req.params.group_type
      );

      res.status(200).json(result);
    } catch (error) {
      commonErrorMessage(
        res,
        500,
        `failed to get current choices for group id ${req.params.group_id} and type ${req.params.group_type}`,
        error
      );
    }
  }
);

// answers transactional
router.post("/answer/:choice_id", isAuthenticated, async function (req, res) {
  try {
    const result = await postChoice(req.user || null, req.params.choice_id);
    res.status(201).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to post answer", error);
  }
});

// answers current
router.post(
  "/:choice_id/:question_id",
  isAuthenticated,
  async function (req, res) {
    try {
      const result = await upsertCurrentChoice(
        req.user,
        req.params.choice_id,
        req.params.question_id
      );
      res.status(201).json(result);
    } catch (error) {
      commonErrorMessage(res, 500, "failed to post current answer", error);
    }
  }
);

export default router;
