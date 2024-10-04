import { isAuthenticated } from "#middleware/authMiddleware.js";
import {
  addAnswerToQuestion,
  deleteAnswer,
  getChoicesByQuestion,
  getQuestionsAnsweredByMonthAndYear,
  getWhichUsersAnsweredMostQuestions,
  postAnswer,
  updateAnswer,
  upsertCurrentAnswer,
} from "#models/answer/index.js";
import express, { Router } from "express";
const router = Router();

router.use(isAuthenticated);

router.post("/:choice_id", async function (req, res) {
  try {
    const result = await postAnswer(req.user, req.params.choice_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "server error, could not upload answer" });
  }
});

router.post("/:choice_id/:question_id", async function (req, res) {
  try {
    const result = await upsertCurrentAnswer(
      req.user,
      req.params.choice_id,
      req.params.question_id
    );
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "server error, could not upsert current answer" });
  }
});

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
router.get("/:question_id", async function (req, res) {
  try {
    const result = await getChoicesByQuestion(req.params.question_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to get question by topic id ${req.params.question_id}`,
    });
  }
});

// C

router.post("/:question_id", async function (req, res) {
  const data = req.body;
  try {
    if ((!data?.isCorrect, data?.text)) {
      throw Error("pls send all json body");
    }
    const result = await addAnswerToQuestion(
      req.user,
      req.params.question_id,
      data.isCorrect,
      data.text
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to add choice by q id ${req.params.question_id}`,
    });
  }
});

router.patch("/:choice_id", async function (req, res) {
  const data = req.body;
  try {
    if ((!data?.isCorrect, data?.text)) {
      throw Error("pls send all json body");
    }
    const result = await updateAnswer(
      req.user,
      req.params.choice_id,
      data.isCorrect,
      data.text
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to update choice by choice id: ${req.params.choice_id}`,
    });
  }
});

router.delete("/:choice_id", async function (req, res) {
  const data = req.body;
  try {
    if ((!data?.isCorrect, data?.text)) {
      throw Error("pls send all json body");
    }
    const result = await deleteAnswer(req.user, req.params.choice_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to update choice by choice id: ${req.params.choice_id}`,
    });
  }
});

export default router;
