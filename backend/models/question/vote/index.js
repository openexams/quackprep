import sqlExe from "#db/dbFunctions.js";
import { selectQuestion } from "../index.js";

/**
 * upserts users vote.
 * @param {Number} user_id
 * @param {Number} question_id
 * @param {Boolean} vote 1 if upvote 0 if downvote
 */
export async function upsertVoteOnQuestion(user_id, question_id, vote) {
  const params = { user_id, question_id, vote };
  await sqlExe.executeCommand(
    `INSERT INTO question_votes (user_id,question_id,vote)
     VALUES(:user_id,:question_id,:vote)
     ON DUPLICATE KEY
     UPDATE
     vote=:vote`,
    params
  );
  return (await selectQuestion(`q.id=${question_id}`))[0];
}
