import { getCurrentChoicesByUserId } from "#models/choice/current/index.js";
import { isAuthenticated } from "#middleware/authMiddleware.js";
import { Router } from "express";
const router = Router();

router.get("/", isAuthenticated, async function (req, res, next) {
  try {
    const result = await getCurrentChoicesByUserId(req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
