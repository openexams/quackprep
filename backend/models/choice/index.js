import sqlExe from "#db/dbFunctions.js";
import {
  verifyRowCreatedByUser,
  verifyUserOwnsRowId,
} from "#utils/sqlFunctions.js";
import { mergeKeys } from "../../../shared/globalFuncs.js";

export async function postChoice(user_id, choice_id) {
  const params = { choice_id, user_id };
  return await sqlExe.executeCommand(
    `INSERT INTO answers_transactional (choice_id, user_id) VALUES(:choice_id,:user_id)`,
    params
  ); // maybe get last inserted id so i can see it worked? Naaaa....
}

export async function upsertCurrentChoice(user_id, choice_id, question_id) {
  const params = { choice_id, user_id, question_id };
  // if user already has row with this question update it, if not create a new one.
  return await sqlExe.executeCommand(
    `INSERT INTO answers_current (choice_id, user_id, question_id) VALUES(:choice_id,:user_id, :question_id)
    ON DUPLICATE KEY
    UPDATE choice_id = :choice_id`,
    params
  );
}

export async function getWhichUsersAnsweredMostQuestions() {
  return await sqlExe.executeCommand(
    `SELECT a.user_id, u.username, COUNT(*) as questions_answered, u.icon FROM answers_transactional
     a JOIN users u ON u.id = a.user_id JOIN choices c ON a.choice_id = c.id AND c.deleted = 0
       GROUP BY a.user_id ORDER BY questions_answered DESC LIMIT 5; 
    `
  ); //pull in top 5
}

export async function getQuestionsAnsweredByMonthAndYear() {
  return await sqlExe.executeCommand(
    `SELECT YEAR(a.created_at) as year ,MONTH(a.created_at) as month ,COUNT(*) as 
    questions_answered FROM answers_transactional a
     JOIN choices c ON a.choice_id = c.id AND c.deleted = 0
     GROUP BY YEAR(a.created_at),MONTH(a.created_at)
     ORDER BY YEAR ASC, MONTH ASC`
  );
}

//CRUD

async function selectChoices(WHERE, params) {
  const result = await sqlExe.executeCommand(
    `
    SELECT c.id,c.answer,c.is_correct,c.created_by,c.question_id,c.type, cl.id as class_id, g.id as group_id, 
    cl.school_id, cl.category as class_category
     FROM choices c 
     LEFT JOIN group_question gq ON c.question_id = gq.question_id
     JOIN cgroups g on g.id = gq.group_id 
     JOIN classes cl ON cl.id = g.class_id
    WHERE c.deleted=0 AND g.deleted=0 AND cl.deleted=0 AND ${WHERE}
     ORDER BY c.question_id ASC`,
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
      SELECT c.id,c.answer,c.is_correct,c.created_by,c.question_id,c.type, cl.id as class_id, g.id as group_id, 
      cl.school_id, cl.category as class_category
      FROM choices c 
      JOIN group_question gq ON c.question_id = gq.question_id
      LEFT JOIN group_question new_gq ON c.question_id = new_gq.question_id
      JOIN cgroups g on g.id = new_gq.group_id 
      JOIN classes cl ON cl.id = g.class_id
      WHERE c.deleted=0 AND g.deleted=0 AND cl.deleted=0 AND gq.group_id =30
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

  if (!(await verifyRowCreatedByUser(question_id, user_id, "questions"))) {
    throw new Error(
      "user does not own the question they are trying to create/edit a choice in"
    );
    return;
  }

  if (id && (await verifyUserOwnsRowId(id, user_id, "choices")) === false) {
    throw new Error("user does not own the row they are trying to edit");
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
      params
    )
  ).insertId;

  return await selectChoices("c.id =:choice_id", { choice_id });
}

/**
 * adds x amt of choices to a question
 * @param {Int} question_id
 * @param {Int} user_id
 * @param {Array} choices array of choices all having text and is_correct keys
 * @returns {Object}
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
  return await sqlExe.queryCommand(sqlStatement, params);
}

export async function getCurrentChoicesByGroupIdAndType( // TODO answers_current
  user_id,
  group_id,
  group_type
) {
  const params = { user_id, group_id, group_type };
  return await sqlExe.executeCommand(` `, params);
}
