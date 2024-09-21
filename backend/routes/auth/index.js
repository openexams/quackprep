import { Router } from "express";
import bcrypt from "bcrypt";
import { findUserById, getUserCount, register } from "#models/auth/index.js";
import passport from "#config/passportConfig.js";
import { isAuthenticated } from "#middleware/authMiddleware.js";

const router = Router();

router.get("/users/count", isAuthenticated, async function (req, res) {
  try {
    const result = await getUserCount();
    res.status(200).json(result[0].COUNT);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to get user count" });
  }
});

router.post("/register", async function (req, res) {
  // make sure to check if that emails not alr taken lol TODO
  const { firstName, lastName, username, email, password } = req.body;
  if (!firstName || !lastName || !username || !email || !password) {
    res.status(400).json({
      message:
        "please include a firstName, lastName, username, email, password",
    });
    return;
  }
  // check if email alr exists
  const hashedPass = await bcrypt.hash(password, 10);
  const result = await register(
    firstName,
    lastName,
    username,
    email,
    hashedPass
  );

  if (result) {
    res.status(200).json({ message: "successfully created a account" });
  } else {
    res.status(500).json({ message: "failed to create account" });
  }
});

router.post("/login", (req, res, next) => {
  dlog("email login");
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
      return res.status(200).json(user);
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
    else res.status(200).json({ message: "logged out" });
  });
});

/** GOOGLE */
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
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);
/**   *    *    * */

export default router;
