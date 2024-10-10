/**
 * formats the current time to utc
 * @returns {String} formatted time in YYYY-MM-DDTHH:mm:ss
 */
export function getCurTimeUTCFormatted() {
  const now = new Date();
  return (
    now.getUTCFullYear() +
    "-" +
    ("0" + (now.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getUTCDate()).slice(-2) +
    "T" +
    ("0" + now.getUTCHours()).slice(-2) +
    ":" +
    ("0" + now.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + now.getUTCSeconds()).slice(-2)
  );
}
/**
 *
 * @param {String} given will be used with new Date(given)
 */
export function curTimeUTCMinusGiven(given) {
  // testable
  const diff = (new Date().getTime() - new Date(given)) / 86400000;
  if (diff < 0) {
    return 0;
  } else {
    return diff;
  }
}
