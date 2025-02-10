import { getCurTimeUTCFormatted } from "./dateFunctions.js";
import { secrets } from "#config/secrets.js";
import "#config/config.js";

export function errLogging(err, errMsg) {
  console.log(`[${getCurTimeUTCFormatted()}] ${errMsg}\n${err}`);
}
/**
 * Logs only if on dev mode
 */
global.dlog = function (message, ...params) {
  if (secrets.NODE_ENV === "local") {
    console.log(message, ...params);
  }
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
