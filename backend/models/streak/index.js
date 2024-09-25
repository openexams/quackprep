import sqlExe from "#db/dbFunctions.js";
import { curTimeUTCMinusGiven } from "#utils/dateFunctions.js";

function calculateIfHasStreak(last_claim) {
  if (curTimeUTCMinusGiven(last_claim) > 1) {
    return false;
  } else {
    return true;
  }
}

/**
 *
 * @param {int} userId
 * @param {String} last_claim
 * @returns {Boolean} returns if user has_streak
 */
async function checkAndChangeCurStreak(userId, last_claim) {
  const has_streak = calculateIfHasStreak(last_claim);
  if (has_streak == false) {
    await setCurrentStreak(userId, 0);
  }
  return has_streak;
}

/**
 * @param {Int} userId
 * @param {Int} value (positive pls)
 * @returns {Boolean}
 */
export async function setCurrentStreak(userId, value) {
  // testable
  const sqlCommand =
    "UPDATE streak SET current_streak = :value WHERE user_id = :userId";
  const params = {
    userId,
    value,
  };
  await sqlExe.executeCommand(sqlCommand, params); // no need to await maybe?
}

/**
 * Checks if the user has a streak currently.
 * @param {Int} userId
 * @returns {Boolean}
 */
export async function hasStreak(userId) {
  // testable
  const sqlCommand = "SELECT * FROM streak s WHERE s.user_id = :userId";
  const params = {
    userId,
  };
  const streak_data = (await sqlExe.executeCommand(sqlCommand, params))[0];
  return await checkAndChangeCurStreak(userId, streak_data.last_claim);
}

export async function getStreakData(userId) {
  const sqlCommand = "SELECT * FROM streak WHERE user_id = :userId";
  const params = {
    userId,
  };
  const result = (await sqlExe.executeCommand(sqlCommand, params))[0];

  // calulate if has_streak
  const has_streak = await checkAndChangeCurStreak(userId, result.last_claim);

  return { ...result, has_streak: has_streak };
}

// filters out users who dont have streaks
export async function getTopStreaks(amt) {
  return await sqlExe.executeCommand(
    `SELECT s.user_id, s.current_streak, u.username FROM streak s INNER JOIN users u ON s.user_id = u.id 
    WHERE datediff(CURRENT_TIMESTAMP,s.last_claim)  <= 1
    ORDER BY s.current_streak DESC
    LIMIT 5`,
    { amt }
  );
}
