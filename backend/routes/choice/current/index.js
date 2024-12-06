import {
  upsertCurrentChoice,
  getCurrentChoicesByUserId,
} from "#models/choice/current/index.js";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";
import { Router } from "express";
const router = Router();

router.get("/", isAuthenticated, async function (req, res) {
  try {
    const result = await getCurrentChoicesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to get current answers for user ${req.user}`,
      error
    );
  }
});

router.post("/", isAuthenticated, async function (req, res) {
  const data = req.body;
  if (!data.choice_id || !data.question_id) {
    commonErrorMessage(res, 400, "send body with choice_id and question_id");
    return;
  }
  try {
    const result = await upsertCurrentChoice(
      req.user,
      data.choice_id,
      data.question_id
    );
    res.status(201).json(result);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to post current answer", error);
  }
});
export default router;
