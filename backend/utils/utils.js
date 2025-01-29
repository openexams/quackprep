import { getCurTimeUTCFormatted } from "./dateFunctions.js";
import "#config/config.js";
import { errorHandler } from "#middleware/errorHandler.js";
import ApiError from "#utils/ApiError.js";

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
