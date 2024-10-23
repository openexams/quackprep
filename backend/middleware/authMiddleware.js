import { checkApiKey } from "#models/auth/index.js";

export async function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    //dlog("user is logged in");
    next();
  } else if (req.headers?.token && (await checkApiKey(req.headers.token))) {
    dlog("api token detected");
    req.user = await checkApiKey(req.headers.token); // inject into req.user temporaryily
    next();
  } else {
    //dlog("User not authed");
    res.status(401).json({
      message: "401 you do not have access to this page, please login",
    });
  }
}
