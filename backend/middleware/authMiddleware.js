export function isAuthenticated(req, res, next) {
  // if (NODE_ENV == "local") {
  //   return next(); // change to auto login for dev
  // }
  if (req.isAuthenticated()) {
    return next();
  }
  dlog("User not authed");
  res
    .status(401)
    .json({ message: "401 you do not have access to this page, please login" }); //fix
}
