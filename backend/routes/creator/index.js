import { Router } from "express";

import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";
import { submitCreatorForm } from "#models/creator/index.js";

const router = Router();

router.post("/", isAuthenticated, async function (req, res) {
  const data = req.body;
  if (!data.the_why || !data.school) {
    commonErrorMessage(res, 400, "pls pass in all args", null);
    return;
  }
  try {
    await submitCreatorForm(req.user, data.the_why, data.school);
    res.status(200).json({ message: "recieved successfully" });
  } catch (error) {
    commonErrorMessage(res, 500, "failed to submit creator form", error);
    return;
  }
});

export default router;
