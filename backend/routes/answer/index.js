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
import { checkApiKey } from "#models/auth/index.js";
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

/// CRUD CHOICES & API KEY POSSIBLE TO USE

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
    let result;
    if (req.headers?.token) {
      result = await addAnswerToQuestion(
        await checkApiKey(req.headers.token),
        req.params.question_id,
        data.isCorrect,
        data.text
      );
    } else {
      result = await addAnswerToQuestion(
        req.user,
        req.params.question_id,
        data.isCorrect,
        data.text
      );
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to add choice by q id ${req.params.question_id}`,
    });
  }
});

// U
router.patch("/:choice_id", async function (req, res) {
  const data = req.body;
  try {
    if ((!data?.isCorrect, data?.text)) {
      throw Error("pls send all json body");
    }
    let result;
    if (req.headers?.token) {
      // can i abstract this?
      result = await updateAnswer(
        await checkApiKey(req.headers.token),
        req.params.choice_id,
        data.isCorrect,
        data.text
      );
    } else {
      result = await updateAnswer(
        req.user,
        req.params.choice_id,
        data.isCorrect,
        data.text
      );
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to update choice by choice id: ${req.params.choice_id}`,
    });
  }
});

//D
router.delete("/:choice_id", async function (req, res) {
  console.log(req.headers.token);
  try {
    let result;
    if (req.headers?.token) {
      result = await deleteAnswer(
        await checkApiKey(req.headers.token),
        req.params.choice_id
      );
    } else {
      result = await deleteAnswer(req.user, req.params.choice_id);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: `failed to delete choice by choice id: ${req.params.choice_id}`,
    });
  }
});

export default router;
