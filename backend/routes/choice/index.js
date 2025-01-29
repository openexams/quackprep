import { isAuthenticated } from "#middleware/authMiddleware.js";
import { isCreator } from "#middleware/creatorMiddleware.js";
import {
  upsertChoiceToQuestion,
  getChoicesByQuestion,
  postChoice,
  getChoicesByGroupId,
  addManyChoicesToQuestion,
  getChoicesByUserId,
} from "#models/choice/index.js";

import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { Router } from "express";
import currentRouter from "./current/index.js";
import { BadRequestError } from "#utils/ApiError.js";

const router = Router();

router.use("/current", currentRouter);

// answers transactional
router.post("/answer/", async function (req, res, next) {
  const data = req.body;
  if (!data.question_id || !data.choice_id) {
    next(new BadRequestError("please include a choice & question"));
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
    next(error);
  }
});

/// CRUD CHOICES

//// R
router.get("/user", isAuthenticated, async function (req, res, next) {
  try {
    const result = await getChoicesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:question_id", async function (req, res, next) {
  try {
    const result = await getChoicesByQuestion(req.params.question_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/group/:group_id", async function (req, res, next) {
  try {
    const result = await getChoicesByGroupId(req.params.group_id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// C

router.post(
  "/many/:question_id",
  isAuthenticated,
  isCreator,
  async function (req, res, next) {
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
      next(error);
    }
  }
);

router.post(
  "/:question_id",
  isAuthenticated,
  isCreator,
  async function (req, res, next) {
    const data = req.body;
    try {
      if (data?.text == null || data?.isCorrect == null || !data?.type) {
        next(
          new BadRequestError(
            "send body with text (string), isCorrect(bool), type"
          )
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
      next(error);
    }
  }
);

// D
router.delete(
  "/:choice_id",
  isAuthenticated,
  isCreator,
  async function (req, res, next) {
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
      next(error);
    }
  }
);

export default router;
