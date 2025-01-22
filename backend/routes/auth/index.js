import { Router } from "express";
import bcrypt from "bcrypt";
import { findUserById, getUserCount, register } from "#models/auth/index.js";
import passport from "#config/passportConfig.js";
import validator from "validator";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import { commonErrorMessage } from "#utils/utils.js";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const router = Router();

router.get("/users/count", async function (req, res) {
  try {
    const result = await getUserCount();
    res.status(200).json(result?.[0].COUNT);
  } catch (error) {
    commonErrorMessage(res, 500, "failed to get user count", error);
  }
});

router.post("/register", async function (req, res) {
  commonErrorMessage(
    res,
    500,
    "register through email is currently turned off, please use google login"
  );
  return;
  // make sure to check if that emails not alr taken lol TODO FIX AND ITS TURNED OFF RN
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    commonErrorMessage(
      res,
      400,
      "please send all required fields: first name, last name, username, email, password"
    );
    return;
  }
  if (!validator.isEmail(email)) {
    commonErrorMessage(res, 400, "Invalid Email, try again with a valid email");
    return;
  }
  if (
    matcher.getAllMatches(email).length !== 0 ||
    matcher.getAllMatches(username).length !== 0
  ) {
    commonErrorMessage(
      res,
      400,
      "no bad words allowed, if you believe this is a mistake please contact support"
    );
    return;
  }
  if (username.includes(" ")) {
    commonErrorMessage(
      res,
      400,
      "no spaces allowed in first name, last name, or username"
    );
    return;
  }

  // check if email alr exists TODO will currently just not work
  const hashedPass = await bcrypt.hash(password, 10);
  const result = await register(username, email, hashedPass);

  if (result) {
    res.status(201).json({ message: "successfully created a account" });
  } else {
    commonErrorMessage(res, 500, "failed to create account");
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info, status) => {
    if (err) {
      dlog("/auth/login errored", status);
      return res.status(500).json({ message: "server error" });
    }
    if (!user) {
      dlog("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        dlog(err);
        return res.status(status);
      }
      return res.status(201).json(user);
    });
  })(req, res, next);
});

router.get("/verify", async function (req, res) {
  if (req.user) {
    const user = await findUserById(req.user); // req.user holds the id
    res.status(200).json(user);
  } else {
    res.status(201).json({ message: "failed insta login" }); // should be a 401
  }
});

router.post("/signout", function (req, res) {
  req.logOut(function (err) {
    if (err) return res.status(500).json({ message: "failed to logout" });
    else res.status(201).json({ message: "logged out" });
  });
});

/** GOOGLE */
/** /api/auth/google */
router.get(
  "/google",

  passport.authenticate("google", {
    display: "popup",
    scope: ["profile", "email"],
    failureFlash: true,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  async function (req, res) {
    res.redirect(process.env.FRONTEND_URL);
  }
);
/**   *    *    * */

export default router;
