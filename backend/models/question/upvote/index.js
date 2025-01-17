import sqlExe from "#db/dbFunctions";

/**
 * todo
 * @param {Number} question_id
 * @param {Boolean} vote true if upvote false if downvote
 */
export async function voteQuestion(question_id, vote) {
  return await sqlExe.executeCommand(``);
}
