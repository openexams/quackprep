import sqlExe from "#db/dbFunctions";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";
import { upsertCurrentChoice } from "./current/index";
import { ResultSetHeader } from "mysql2";

export async function postChoice(
  user_id: number,
  choice_id: number,
  question_id: number,
  text: string
) {
  const params = { choice_id, user_id, text };
  const result = (await sqlExe.executeCommand(
    `INSERT INTO answers_transactional (choice_id, created_by, text) VALUES(:choice_id,:user_id, :text)`,
    params
  )) as ResultSetHeader;
  const insertId = result.insertId;
  if (user_id) {
    return await upsertCurrentChoice(user_id, choice_id, question_id, insertId);
  } else {
    return { message: "Success, however user is NOT signed in" };
  }
}

export async function getWhichUsersAnsweredMostQuestions() {
  return await sqlExe.executeCommand(
    `SELECT u.id, u.username, u.is_creator, COUNT(*) as questions_answered, u.icon FROM answers_transactional
     a JOIN users u ON u.id = a.created_by JOIN choices c ON a.choice_id = c.id AND c.deleted = 0
       GROUP BY a.created_by ORDER BY questions_answered DESC LIMIT 5; 
    `
  ); //pull in top 5
}

export async function getQuestionsAnsweredByMonthAndYear() {
  return await sqlExe.executeCommand(
    `SELECT YEAR(a.created_at) as year ,MONTH(a.created_at) as month ,COUNT(*) as 
    questions_answered FROM answers_transactional a
     JOIN choices c ON a.choice_id = c.id
     GROUP BY YEAR(a.created_at),MONTH(a.created_at)
     ORDER BY YEAR ASC, MONTH ASC`
  ); // gets choice submissions of choices that are deleted too
}

//CRUD

async function selectChoices(WHERE, params) {
  const result = await sqlExe.executeCommand(
    `
    SELECT c.id,
       c.answer
       ,c.is_correct
       ,c.created_by
     ,c.question_id
     ,c.type
     , cl.id as class_id,
    group_concat(g.id SEPARATOR ',') as group_id,

    cl.school_id, cl.category as class_category, ans.num_submissions
     FROM choices c
     JOIN group_question gq ON c.question_id = gq.question_id
     JOIN cgroups g on g.id = gq.group_id
     JOIN classes cl ON cl.id = g.class_id
     LEFT JOIN (SELECT ans.choice_id, COUNT(*) as num_submissions FROM answers_transactional ans
			GROUP BY ans.choice_id)
            ans on c.id = ans.choice_id

    WHERE c.deleted=0 AND g.deleted=0 AND cl.deleted=0 AND ${WHERE}
    GROUP BY c.id, c.answer, c.is_correct, c.created_by, c.question_id, c.type, cl.id, cl.school_id, cl.category
	ORDER BY c.question_id ASC
     `,
    params
  ); // if question is deleted then choice should be deleted
  return result;
}

export async function getChoicesByQuestion(question_id) {
  const params = { question_id };
  return await selectChoices("c.question_id = :question_id", params);
}

export async function getChoicesByUserId(user_id) {
  const params = { user_id };
  return await selectChoices("c.created_by = :user_id", params);
}

export async function getChoicesByGroupId(group_id) {
  const params = { group_id };
  return await sqlExe.executeCommand(
    `
      SELECT 
     c.id,
     c.answer,
     c.is_correct,
     c.created_by,
     c.question_id,
     c.type, 
     cl.id as class_id,
     GROUP_CONCAT(g.id SEPARATOR ',') as group_id, 
      cl.school_id, 
      cl.category as class_category, ans.num_submissions
      FROM choices c 
      JOIN group_question gq ON c.question_id = gq.question_id
      LEFT JOIN group_question new_gq ON c.question_id = new_gq.question_id
      JOIN cgroups g on g.id = new_gq.group_id 
      JOIN classes cl ON cl.id = g.class_id
      LEFT JOIN (SELECT ans.choice_id, COUNT(*) as num_submissions FROM answers_transactional ans
			GROUP BY ans.choice_id) 
            ans on c.id = ans.choice_id
      WHERE c.deleted=0 AND g.deleted=0 AND cl.deleted=0 AND gq.group_id =:group_id
      GROUP BY c.id, c.answer, c.is_correct, c.created_by, c.question_id, c.type, cl.id, cl.school_id, cl.category 
      ORDER BY c.id ASC

`,
    params
  );
}

export async function upsertChoiceToQuestion(
  user_id,
  question_id,
  isCorrect,
  text,
  type,
  id = null
) {
  const params = { user_id, question_id, isCorrect, text, type, id };

  if (!(await verifyUserOwnsRowId(question_id, user_id, "questions"))) {
    throw new Error(
      "user does not own the question they are trying to create/edit a choice in"
    );
    return;
  }
  const choice_id = (
    await sqlExe.executeCommand(
      `INSERT INTO choices (id,answer,is_correct,created_by,question_id,type) values (:id,:text,:isCorrect,:user_id,:question_id,:type)
      ON DUPLICATE KEY UPDATE
      answer=:text,
      is_correct=:isCorrect,
      question_id=:question_id,
      type=:type`,
      params,
      { verifyUserOwnsRowId: "choices" }
    )
  ).insertId;
  // return the id the user sent (user edited) or return the created row.
  return await selectChoices("c.id =:choice_id", {
    choice_id: id || choice_id,
  });
}

/**
 * adds x amt of choices to a question, does not check if the user is allowed to do this, use it carefully
 * @param {Int} question_id
 * @param {Int} user_id
 * @param {Array} choices array of choices all having text and is_correct keys
 * @returns {Void}
 * @example
 * "choices": [
    {
      "text": "hello",
      "is_correct": 1,
      "type": "mcq"
    },
    {
      "text": "po",
      "is_correct": 0,
      "type": "mcq"
    }
  ]
 */
export async function addManyChoicesToQuestion(question_id, user_id, choices) {
  // todo test
  if (!choices?.length && !(choices.length <= 5) && !(choices.length >= 1)) {
    throw new Error("choices array incorrect len");
    return;
  }
  // TODO

  let sqlStatement = `INSERT INTO choices (question_id, answer, is_correct, created_by, type) VALUES `;
  for (let i = 0; i < choices.length; i++) {
    sqlStatement += "(?,?,?,?,?)";
    if (i !== choices.length - 1) {
      // dont add comma at end
      sqlStatement += ",";
    } else {
      sqlStatement += ";";
    }
  }
  let params = [];
  for (let i = 0; i < choices.length; i++) {
    params.push(
      question_id,
      choices[i]?.text,
      choices[i]?.is_correct,
      user_id,
      choices[i]?.type
    );
  }
  const result = await sqlExe.queryCommand(sqlStatement, params);
  return await selectChoices(
    `c.id between ${result.insertId} AND ${
      result.insertId + result.affectedRows - 1
    }`
  );
}

export async function getTotalSubmissions() {
  return (
    await sqlExe.executeCommand(`SELECT count(*) as count from answers_transactional at
`)
  )?.[0]?.count;
}
