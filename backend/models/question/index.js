import sqlExe from "#db/dbFunctions.js";
import {
  getLastRowManipulated,
  verifyRowCreatedByUser,
  verifyUserOwnsRowId,
} from "#utils/sqlFunctions.js";
import { mergeKeys } from "../../../shared/globalFuncs.js";

export async function selectQuestion(WHERE, params) {
  const result = await sqlExe.executeCommand(
    `SELECT q.id, q.question, g.id as group_id, q.question_num_on_exam,
    cl.id as class_id, cl.school_id,cl.category as class_category
    FROM questions q 
    JOIN group_question gq ON q.id = gq.question_id
    JOIN questions qq -- join questions back
    JOIN group_question new_gq ON qq.id = gq.question_id -- join new group which has all pulled in questions & ALL groups they relate to
    JOIN cgroups g ON g.id = new_gq.group_id AND new_gq.question_id = q.id -- join groups where pulled in questions map to a group (pulling in all groups now)
    JOIN classes cl ON g.class_id = cl.id 
    WHERE q.deleted = 0 AND ${WHERE}
    ORDER BY q.id ASC`,
    params
  );
  return mergeKeys(result, "group_id");
  // group together group ids into an array
}

export async function getQuestionsByGroupId(group_id) {
  const params = { group_id };
  return await selectQuestion("gq.group_id=:group_id", params);
}

export async function getQuestionsByUserId(user_id) {
  const params = { user_id };
  return await selectQuestion("q.created_by = :user_id", params);
}

// export async function createQuestionInGroups(
//   user_id,
//   question,
//   question_num_on_exam = null,
//   ...group_ids
// ) {
//   if (!group_ids.length) {
//     console.log("created question w NO group id??");
//     return null;
//   }
//   const params = { user_id, question, question_num_on_exam };
//   const question_id = (
//     await sqlExe.executeCommand(
//       `INSERT INTO questions (question,created_by,question_num_on_exam)
//     VALUES(:question,:user_id,:question_num_on_exam);`,
//       params
//     )
//   ).insertId;
//   await linkQuestionToGroups(question_id, group_ids);

//   return question_id;
// }

/**
 *
 * @param {int} id
 * @param {String} question
 * @param {Int} question_num_on_exam
 * @param {Int} user_id
 * @param {Array} group_ids only needs group ids to verify the user owns the groups
 */
export async function upsertQuestion(
  id = null,
  question,
  question_num_on_exam = null,
  user_id,
  group_ids
) {
  const params = { id, question, question_num_on_exam, user_id };

  for (let i of group_ids) {
    // verify user created all these groups this has way to many sql calls TODO FIX
    if (
      id != null &&
      !(await verifyRowCreatedByUser(group_ids[i], user_id, "cgroups"))
    ) {
      throw new Error(
        "User does not own group they are trying to add questions too"
      );
      return;
    }
  }
  if (id && !(await verifyUserOwnsRowId(id, user_id, "questions"))) {
    throw new Error(
      "User does not own question they are trying to create/edit"
    );
    return;
  }
  const question_id = (
    await sqlExe.executeCommand(
      `INSERT INTO questions (id,question,created_by,question_num_on_exam) VALUES(:id,:question,:user_id,:question_num_on_exam)
    ON DUPLICATE KEY UPDATE
      question=:question,
      question_num_on_exam=:question_num_on_exam`,
      params
    )
  ).insertId;
  return await sqlExe.executeCommand(
    `${getLastRowManipulated("questions", question_id)}`
  );
}

/**
 *
 * @param {Int} question_id
 * @param {Array<Int>} group_ids
 */
export async function linkQuestionToGroups(question_id, group_ids) {
  const params = { question_id };
  for (let i = 0; i < group_ids.length; i++) {
    params["cur_group_id"] = group_ids[i];
    await sqlExe.executeCommand(
      `INSERT INTO group_question (question_id,group_id) 
    VALUES(:question_id, :cur_group_id);`,
      params // TODO USE SAME LOGIC AS ADDMANYCHOICES() INSTEAD OF A LOOP SQL EXECUTE
    );
  }
}

export async function deleteAllQuestionLinks(question_id = null) {
  if (question_id == null) {
    return -1;
  }
  const result = (
    await sqlExe.executeCommand(
      `DELETE FROM group_question WHERE question_id = :question_id`,
      { question_id }
    )
  ).affectedRows;
  return result;
}
