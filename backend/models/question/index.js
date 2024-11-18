import sqlExe from "#db/dbFunctions.js";
import {
  verifyRowCreatedByUser,
  verifyUserOwnsRowId,
} from "#utils/sqlFunctions.js";

export async function getQuestionsByGroupId(group_id, type) {
  const params = { group_id, type };
  return await sqlExe.executeCommand(
    // PULL IN MORE! TODO WTF TEST SPENT10 MIN
    `SELECT q.id, q.question, g.id as group_id, gt.type_name as type, q.question_num_on_exam,
    cl.id as class_id, cl.school_id,cl.category as class_category
    FROM questions q 
    JOIN group_question gq ON gq.group_id = :group_id AND gq.question_id = q.id 
    JOIN cgroups g ON gq.group_id = g.id 
    JOIN group_types gt ON gt.id = g.type
    JOIN classes cl ON g.class_id = cl.id 
    WHERE q.deleted = 0
    ORDER BY q.id ASC
`, // AND gt.type_name = :type
    params
  );
}

export async function getQuestionsByUserId(user_id) {
  const params = { user_id };
  return await sqlExe.executeCommand(
    `SELECT q.id, q.question, g.id as group_id, gt.type_name as type, q.question_num_on_exam,
    cl.id as class_id, cl.school_id,cl.category as class_category
     FROM questions q 
    JOIN group_question gq ON gq.question_id = q.id 
    JOIN cgroups g ON gq.group_id = g.id
    JOIN group_types gt ON gt.id = g.type 
    JOIN classes cl ON g.class_id = cl.id 
    WHERE q.deleted = 0 AND q.created_by = :user_id
    ORDER BY q.id ASC
`, // if a question maps to multiple groups, it will duplicate the question for each group id its linked to
    params
  );
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
  return question_id;
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
