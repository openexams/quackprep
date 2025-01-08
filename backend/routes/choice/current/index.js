import { getCurrentChoicesByUserId } from "#models/choice/current/index.js";
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

export default router;
