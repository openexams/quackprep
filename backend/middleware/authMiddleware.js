import passport from "#config/passportConfig.js";
import { checkApiKey } from "#models/auth/index.js";

export async function isAuthenticated(req, res, next) {
  // if (NODE_ENV == "local") {
  //   return next(); // change to auto login for dev
  // }
  if (req.user && req.isAuthenticated()) {
    dlog("user is logged in");
    return next();
  } else if (req.headers?.token && (await checkApiKey(req.headers.token))) {
    dlog("api token detected");
    passport.authenticate("bearer", { session: false }); // tmp auth user TODO FIXd
    return next();
  } else {
    dlog("User not authed");
    res.status(401).json({
      message: "401 you do not have access to this page, please login",
    });
  }
}
