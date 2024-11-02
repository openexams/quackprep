import { Router } from "express";
import { upsertTimeSpent } from "#models/account/index.js";

import { isAuthenticated } from "#middleware/authMiddleware.js";

const router = Router();

router.use(isAuthenticated);

router.post("/time_spent", async function (req, res) {
  try {
    const result = await upsertTimeSpent(req.user); // always 5 min
    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json("server error, could not update your time spent on the site.");
  }
});

router.patch("/icon", async function (req, res) {
  // user could send malicious image TODO not going to work for now
  try {
    const icon_url = req.body;
    res.status(500).json();
  } catch (error) {
    res
      .status(500)
      .json("server error, could not update your time spent on the site.");
  }
});

// router.patch change username

// change password

// change email EHH MAYBE

// change icon

//TODO
export default router;
