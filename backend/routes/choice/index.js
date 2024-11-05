import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  addChoiceToQuestion,
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
import express, { Router } from "express";
const router = Router();

router.get("/top", async function (req, res) {
  try {
    const result = await getWhichUsersAnsweredMostQuestions();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "server error, retrieve top qs answered" });
  }
});

router.get("/qsansweredbymandy", async function (req, res) {
  try {
    const result = await getQuestionsAnsweredByMonthAndYear();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "server error, getting all qs answerd by month and year",
    });
  }
});

/// CRUD CHOICES

//// R
router.get("/user", isAuthenticated, async function (req, res) {
  try {
    const result = await getChoicesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get choices by user id ${req.user}`,
    });
  }
});

router.get("/:question_id", isAuthenticated, async function (req, res) {
  try {
    const result = await getChoicesByQuestion(req.params.question_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get choice by question id ${req.params.question_id}`,
    });
  }
});

router.get("/group/:group_id", isAuthenticated, async function (req, res) {
  try {
    const result = await getChoicesByGroupId(req.params.group_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by group id ${req.params.group_id}`,
    });
  }
});

// C

router.post("/many/:question_id", isAuthenticated, async function (req, res) {
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
    res.status(500).json({
      message: `failed to add ${data?.choices?.length} choices by q id ${req.params.question_id}`,
    });
  }
});

router.post("/:question_id", isAuthenticated, async function (req, res) {
  const data = req.body;
  try {
    if (
      data?.isCorrect === undefined ||
      data?.isCorrect === null ||
      !data?.text
    ) {
      throw Error("pls send all json body");
    }

    const result = await addChoiceToQuestion(
      req.user,
      req.params.question_id,
      data.isCorrect,
      data.text
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to add choice by q id ${req.params.question_id}`,
    });
  }
});

// D
router.delete("/:choice_id", async function (req, res) {
  try {
    const choice_id = parseInt(req.params.choice_id);
    const result = await cascadeSetDeleted(
      req.user,
      "choice",
      choice_id,
      0,
      0,
      0,
      1
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to delete choice by id ${req.params.choice_id}`,
    });
  }
});

/**
 * pulls in the current choices that this user has,
 */
router.get("/current/:group_id/:group_type", async function (req, res) {
  try {
    const result = await getCurrentChoicesByGroupIdAndType(
      req.user,
      req.params.group_id,
      req.params.group_type
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get currently selected choices: ${req.params.choice_id}`,
    });
  }
});

// answers transactional
router.post("/answer/:choice_id", isAuthenticated, async function (req, res) {
  try {
    const result = await postChoice(req.user, req.params.choice_id);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "server error, could not upload answer" });
  }
});

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
      res
        .status(500)
        .json({ message: "server error, could not upsert current answer" });
    }
  }
);

export default router;
