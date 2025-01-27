import { getCurTimeUTCFormatted } from "./dateFunctions.js";
import "#config/config.js";

export function errLogging(err, errMsg) {
  console.log(`[${getCurTimeUTCFormatted()}] ${errMsg}\n${err}`);
}

/**
 * Logs only if on dev mode
 */
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
  res,
  status = 500,
  message = "rip bruh error",
  error = "an error has occurred"
) {
  dlog(`${error}\n${message}`);
  res.status(status).json({
    message: `${message}\n${NODE_ENV === "local" ? `\nFOR DEV:${error}` : ""}`,
  });
}
