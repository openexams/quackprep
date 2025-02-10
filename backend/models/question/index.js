import sqlExe from "#db/dbFunctions.js";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";
import { questionSelectSchema } from "../../../schema/index.js";

export async function createQuestionReport(user_id, question_id, text) {
  const params = { user_id, question_id, text };
  return await sqlExe.executeCommand(
    `INSERT INTO question_reports (created_by,text,question_id) VALUES(:user_id, :text,:question_id)`,
    params
  );
}

/**
 * this function has down syndrome
 * @param {Number} group_id
 * @returns {import('../../../types').Question[]}
 */
export async function getQuestionsByGroupId(group_id) {
  const result = await sqlExe.executeCommand(
    `SELECT q.id,
       q.question,
        group_concat(g.id SEPARATOR ',') AS group_id,

       q.explanation_url,
        group_concat(g.name SEPARATOR ',') as group_name,
       group_concat(gt.type_name SEPARATOR ',') as type_name,
    cl.id as class_id, cl.school_id,cl.category as class_category, q.ai,CONVERT(COALESCE(qv.upvotes, 0), SIGNED) AS upvotes

    FROM questions q

    JOIN group_question gq ON q.id = gq.question_id AND gq.group_id = :group_id -- all groups relating to this question
    JOIN questions qq ON gq.question_id = qq.id -- all questions which relate to group id
    JOIN group_question new_gq ON qq.id = new_gq.question_id -- use all questions that are in all groups now this shit has all groups needed
    JOIN cgroups g ON g.id = new_gq.group_id

    LEFT JOIN
    (select COALESCE(SUM(
       CASE
         WHEN qv.vote = 1 THEN 1  -- upvote adds +1
         WHEN qv.vote = 0 THEN -1 -- down vote subtracts 1
       END
    ), 0) AS upvotes, question_id from question_votes qv GROUP BY question_id) as qv ON qv.question_id = qq.id

    JOIN group_types gt ON gt.id = g.type
    JOIN classes cl ON g.class_id = cl.id
    WHERE q.deleted = 0 AND g.deleted=0 AND cl.deleted=0
    GROUP BY q.id, q.question, q.explanation_url, cl.id, cl.school_id, cl.category, q.ai
    ORDER BY q.id ASC`,
    { group_id }
  );
  const validated = questionSelectSchema.array().parse(result);
  return validated;
}

/**
 * @returns {import('../../../types').Question[]}
 */
export async function selectQuestion(WHERE, params) {
  const result = await sqlExe.executeCommand(
    `SELECT
    q.id,
    q.question,
    q.ai,
    CONVERT(COALESCE(qv.upvotes, 0), SIGNED) AS upvotes,
    group_concat(g.id SEPARATOR ',') AS group_id,

    group_concat(gt.type_name SEPARATOR ',') as type_name,
    group_concat(g.name SEPARATOR ',') as group_name,
    cl.id AS class_id,
    cl.school_id,
    cl.category AS class_category,q.explanation_url
FROM
    questions q
LEFT JOIN
    (select COALESCE(SUM(
       CASE
         WHEN qv.vote = 1 THEN 1  -- upvote adds +1
         WHEN qv.vote = 0 THEN -1 -- down vote subtracts 1
       END
    ), 0) AS upvotes, question_id from question_votes qv GROUP BY question_id) as qv ON qv.question_id = q.id
JOIN
    group_question gq ON q.id = gq.question_id
JOIN
    cgroups g ON g.id = gq.group_id

JOIN
	group_types gt ON g.type = gt.id
JOIN
    classes cl ON cl.id = g.class_id
WHERE
    q.deleted = 0 AND g.deleted=0 AND cl.deleted=0 AND ${WHERE}
GROUP BY
    q.id, cl.id
ORDER BY
    q.id ASC`,
    params
  );
  const validated = questionSelectSchema.array().parse(result);

  return validated;
}

export async function getQuestionsByUserId(user_id) {
  const params = { user_id };
  return await selectQuestion(`q.created_by = :user_id`, params);
}

/**
 * Users must own the group they are inserting to unless it an ai gen question
 * @param {int} id
 * @param {String} question
 * @param {Int} user_id
 * @param {Number[]} group_ids only needs group ids to verify the user owns the groups
 * @param {Boolean} aiGenerated
 */
export async function upsertQuestion(
  id = null,
  question,
  user_id,
  group_ids,
  aiGenerated = false
) {
  const params = { id, question, user_id, aiGenerated };
  if (!aiGenerated) {
    // if its ai then anyone can create ai questions
    for (let i = 0; i < group_ids?.length; i++) {
      // verify user created all these groups this has way to many sql calls TODO FIX
      if (
        id != null &&
        !(await verifyUserOwnsRowId(group_ids[i], user_id, "cgroups"))
      ) {
        throw new Error(
          "User does not own group they are trying to add questions too"
        );
        return;
      }
    }
  }

  const question_id = (
    await sqlExe.executeCommand(
      `INSERT INTO questions (id,question,created_by, ai) VALUES(:id,:question,:user_id, :aiGenerated)
    ON DUPLICATE KEY UPDATE
      question=:question`,
      params,
      { verifyUserOwnsRowId: "questions" }
    )
  ).insertId; // only returns a insert if a question was created
  if (id) await deleteAllQuestionLinks(id); // deletes all of them only when its edited, if its being created it will have no links
  await linkQuestionToGroups(id || question_id, group_ids);
  return (
    await selectQuestion(`q.id=:question_id`, {
      question_id: id || question_id,
    })
  )[0];
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
      params // TODO USE SAME LOGIC AS addManyChoices() INSTEAD OF A LOOP SQL EXECUTE
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

export async function setDeletedQuestionAndCascadeChoices(question_id) {
  await sqlExe.executeCommand(
    `UPDATE questions q 
LEFT JOIN choices c on c.question_id = q.id
SET q.deleted=1, c.deleted=1 WHERE q.id = :question_id`,
    { question_id }
  );
}

/**
 *
 * @param {Number} question_id
 * @returns {Array<Number>} returns an array of group ids that the question is in
 */
export async function getWhatGroupsQuestionisIn(question_id) {
  const array_of_sql = await sqlExe.executeCommand(
    `select * from group_question gq where gq.question_id = :question_id`,
    { question_id }
  );
  const groups_question_is_in = [];
  for (let i = 0; i < array_of_sql.length; i++) {
    groups_question_is_in.push(array_of_sql[i].group_id);
  }
  return groups_question_is_in;
}
