import { getCurTimeUTCFormatted } from "./dateFunctions.js";
import { Response } from "express";

export function errLogging(err, errMsg) {
  console.log(`[${getCurTimeUTCFormatted()}] ${errMsg}\n${err}`);
}

global.dlog = function (message, ...params) {
  if (NODE_ENV === "local") {
    console.log(message, ...params);
  }
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * res.status(status).json({message:message + error})
 * @param {Response} res
 * @param {number} status
 * @param {String} message
 * @param {Error | string | null | any} error
 */
export function commonErrorMessage(
  res: Response,
  status = 500,
  message = "rip bruh error",
  error = "an error has occurred"
) {
  res
    .status(status)
    .json({ message: `${message}\n${NODE_ENV === "local" ? error : ""}` });
}
