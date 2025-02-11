import sqlExe from "#db/dbFunctions";
import { selectClasses } from "../index.js";

/**
 *
 * @param {Number} class_id
 * @param {Number} vote make sure its a 0 or a 1
 * @param {Number} user_id
 * @returns entire class with new upvote value
 */
export async function upsertVoteOnClass(class_id, vote, user_id) {
  const insert_id = (
    await sqlExe.executeCommand(
      `INSERT INTO class_votes (class_id,vote,user_id) 
        VALUES(:class_id,:vote,:user_id)
        ON DUPLICATE KEY UPDATE
        vote = :vote
        `,
      { class_id, vote, user_id }
    )
  ).insertId;
  return (await selectClasses(`cl.id = :class_id`, { class_id }))[0];
}
