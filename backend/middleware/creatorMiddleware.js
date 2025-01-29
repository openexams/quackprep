import { checkIfCreator } from "#models/account/index.js";
import { errorHandler } from "./errorHandler.js";
import { UnauthorizedError } from "../utils/ApiError.js";

export async function isCreator(req, res, next) {
  // todo
  if ((await checkIfCreator(req.user)) === true) {
    next();
  } else {
    return errorHandler(new UnauthorizedError(), req, res, next);
  }
}
