import { checkApiKey } from "#models/auth/index.js";

/**
 *
 * @param {String} useragent
 * @returns {boolean}
 */
function checkUserAgentIsBot(useragent) {
  if (useragent == null) {
    return false;
  }
  const agents = {
    googlebot: "googlebot",
    bingbot: "bingbot",
    slurp: "slurp", // Yahoo bot
    duckduckbot: "duckduckbot",
    baiduspider: "baiduspider",
    yandex: "yandex",
    sogou: "sogou",
    exabot: "exabot",
    facebot: "facebot", // Facebook
    ia_archiver: "ia_archiver", // Wayback Machine
  };

  if (useragent.toLowerCase() in agents) {
    return true;
  }
  return false;
}

export async function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    //dlog("user is logged in");
    next();
  } else if (req.headers?.token && (await checkApiKey(req.headers.token))) {
    dlog("api token detected");
    req.user = await checkApiKey(req.headers.token); // inject into req.user temporaryily
    if (req.user === null) {
      res.status(401).json({
        message: "api key is incorrect",
      });
    } else {
      next();
    }
  } else if (checkUserAgentIsBot(req.get("User-Agent"))) {
    dlog("bot detected");
    req.user = 23; // web crawler id
    next();
  } else {
    dlog("User not authed");
    res.status(401).json({
      message: "401 you do not have access to this page, please login",
    });
  }
}
