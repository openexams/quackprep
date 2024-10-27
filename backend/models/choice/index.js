import sqlExe from "#db/dbFunctions.js";

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
    `SELECT YEAR(created_at) as year ,MONTH(created_at) as month ,COUNT(*) as 
    questions_answered FROM answers_transactional GROUP BY YEAR(created_at),
     MONTH(created_at)
     JOIN choices c ON a.choice_id = c.id AND c.deleted = 0
     ORDER BY YEAR ASC, MONTH ASC`
  );
}

//CRUD

export async function getChoicesByQuestion(question_id) {
  // TODO TEST
  const params = { question_id };
  return await sqlExe.executeCommand(
    `SELECT c.id,c.answer,c.is_correct,c.created_by,qc.question_id FROM choices c 
    JOIN question_choice qc ON qc.question_id = :question_id AND c.id = qc.choice_id
    WHERE c.deleted=0
     ORDER BY id ASC`,
    params
  );
}

export async function addChoiceToQuestion( // NOT TESTED TODO
  user_id,
  question_id,
  isCorrect,
  text
) {
  const params = { user_id, question_id, isCorrect, text };
  const result = (
    await sqlExe.executeCommand(
      `INSERT INTO choices (answer,is_correct,created_by) values (:text,:isCorrect,:user_id)`,
      params
    )
  ).insertId;
  params["result"] = result;
  const bridge_tbl_res = await sqlExe.executeCommand(
    `INSERT INTO question_choice (question_id,choice_id) values (:question_id, :result)`,
    params
  );
  return result;
}

export async function getCurrentChoicesByGroupIdAndType( // TODO answers_current
  user_id,
  group_id,
  group_type
) {
  const params = { user_id, group_id, group_type };
  return await sqlExe.executeCommand(` `, params);
}
