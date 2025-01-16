import { checkIfCreator } from "#models/account/index.js";

export async function isCreator(req, res, next) {
  // todo
  if ((await checkIfCreator(req.user)) === true) {
    next();
  } else {
    res.status(401).json({ message: "you are are not a creator" });
    return;
  }
}
