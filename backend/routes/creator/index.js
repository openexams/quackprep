import { Router } from "express";

import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";
import { submitCreatorForm, makeUserACreator } from "#models/creator/index.js";

const router = Router();

//deprecated
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

router.post("/become", isAuthenticated, async function (req, res) {
  try {
    await makeUserACreator(req.user);
    res.status(201).json({ message: "you are now a creator" });
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      `failed to make user ${req.user} a creator`,
      error
    );
    return;
  }
});

export default router;
