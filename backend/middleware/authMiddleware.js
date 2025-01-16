import { checkApiKey } from "#models/auth/index.js";

/**
 * Checks if the user is using an api key. if so attach to user obj (saved by redis I think idk)
 * @param {*} req
 * @param {*} token
 * @returns {Boolean}
 */
export async function hasApiKeyAndInsert(req, token) {
  if (token) {
    const user_id = await checkApiKey(token);
    if (user_id) {
      req.user = user_id;
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export async function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    //dlog("user is logged in");
    next();
  } else if (req.headers?.token) {
    dlog("token detected");
    const valid = await hasApiKeyAndInsert(req, req.headers.token);
    if (valid) {
      next();
    } else {
      res.status(401).json({
        message: "401 your api key is incorrect",
      });
      return;
    }
  } else {
    dlog("User not authed");
    res.status(401).json({
      message: "401 you do not have access to this page, please login",
    });
  }
}
