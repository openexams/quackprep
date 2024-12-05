import sqlExe from "#db/dbFunctions.js";
import { Streak } from "maddox-js-funcs";
// entire page is testable

/**
 *
 * @param {int} userId
 * @param {String} last_claim
 * @returns {Boolean} returns if user has_streak
 */
async function checkAndChangeCurStreak(userId, last_claim) {
  const has_streak = new Streak(last_claim).hasStreak();
  if (has_streak == false) {
    await setCurrentStreak(userId, 0);
  }
  return has_streak;
}

/**
 * @param {Int} userId
 * @param {Int} value (positive pls)
 * @returns {void}
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
  const streak_data = (await sqlExe.executeCommand(sqlCommand, params))?.[0];
  if (!streak_data?.last_claim) {
    return false;
  }
  return await checkAndChangeCurStreak(userId, streak_data.last_claim);
}

export async function getStreakData(userId) {
  const sqlCommand = "SELECT * FROM streak WHERE user_id = :userId";
  const params = {
    userId,
  };
  const result = (await sqlExe.executeCommand(sqlCommand, params))?.[0];

  // calulate if has_streak
  if (!result?.last_claim) {
    return {};
  }
  const has_streak = await checkAndChangeCurStreak(userId, result.last_claim);

  return { ...result, has_streak: has_streak };
}

// filters out users who dont have streaks
export async function getTopStreaks(amt) {
  return await sqlExe.executeCommand(
    `SELECT s.user_id, s.current_streak, u.username, u.icon, u.is_creator, current_timestamp, s.last_claim FROM streak s INNER JOIN users u ON s.user_id = u.id 
    WHERE TIMESTAMPDIFF(MINUTE, s.last_claim,CURRENT_TIMESTAMP())  <= 2880
    ORDER BY s.current_streak DESC
    LIMIT 5`,
    { amt }
  );
}

export async function claimStreak(userId) {
  // will need to be a upsert

  const old_streak_data = await getStreakData(userId);

  if (
    old_streak_data?.last_claim &&
    !new Streak(old_streak_data.last_claim).canClaimStreak()
  ) {
    return {};
  }
  const params = { userId };
  await sqlExe.executeCommand(
    `INSERT INTO streak (user_id, current_streak, longest_streak, last_claim) VALUES (:userId, 1,1,CURRENT_TIMESTAMP) 
ON DUPLICATE KEY UPDATE 
		current_streak = current_streak +1 ,  
		last_claim = CURRENT_TIMESTAMP,
        longest_streak = IF (current_streak > longest_streak, current_streak, longest_streak)
			`,
    params
  );
  return await getStreakData(userId); // dont await for call and send back old data revised w new values;
}
