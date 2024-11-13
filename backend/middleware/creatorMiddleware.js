import { checkIfCreator } from "#models/account";

export async function isCreator(req, res, next) {
  // todo
  if ((await checkIfCreator(req.user)) === true) {
    next();
  } else {
    res.status(400).json({ message: "you are are not a creator" });
    return;
  }
}
