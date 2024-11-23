import { Router } from "express";
import { upsertTimeSpent } from "#models/account/index.js";

import { isAuthenticated } from "#middleware/authMiddleware.js";
import { commonErrorMessage } from "#utils/utils.js";

const router = Router();

router.use(isAuthenticated);

router.post("/time_spent", async function (req, res) {
  try {
    const result = await upsertTimeSpent(req.user); // always 5 min
    res.status(201).json(result);
  } catch (error) {
    commonErrorMessage(
      res,
      500,
      "failed to update your time spent on the site",
      error
    );
  }
});

router.patch("/icon", async function (req, res) {
  // user could send malicious image TODO not going to work for now
  try {
    const icon_url = req.body;
    res.status(500).json();
  } catch (error) {
    commonErrorMessage(res, 500, "failed to update your icon", error);
  }
});

// router.patch change username

// change password

// change email EHH MAYBE

// change icon

//TODO
export default router;
