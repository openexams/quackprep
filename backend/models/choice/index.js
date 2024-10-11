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
     a JOIN users u ON u.id = a.user_id GROUP BY a.user_id ORDER BY questions_answered DESC LIMIT 5; 
    `
  ); //pull in top 5
}

export async function getQuestionsAnsweredByMonthAndYear() {
  return await sqlExe.executeCommand(
    `SELECT YEAR(created_at) as year ,MONTH(created_at) as month ,COUNT(*) as 
    questions_answered FROM answers_transactional GROUP BY YEAR(created_at),
     MONTH(created_at) ORDER BY YEAR ASC, MONTH ASC`
  );
}

//CRUD

export async function getChoicesByQuestion(question_id) {
  const params = { question_id };
  return await sqlExe.executeCommand(
    `SELECT * FROM choices WHERE question_id = :question_id ORDER BY id ASC`,
    params
  );
}

export async function addChoiceToQuestion(
  user_id,
  question_id,
  isCorrect,
  text
) {
  const params = { user_id, question_id, isCorrect, text };
  console.log(params);
  return (
    await sqlExe.executeCommand(
      `INSERT INTO choices (answer,is_correct,question_id,user_id) values (:text,:isCorrect,question_id,user_id)`,
      params
    )
  ).insertId;
}

export async function updateChoice(user_id, choice_id, newIsCorrect, newText) {
  const params = { user_id, choice_id, newText, newIsCorrect };
  return await sqlExe.executeCommand(
    `UPDATE choices SET answer = :newText, is_correct=:newIsCorrect, WHERE id = :choice_id `,
    params
  );
}

export async function deleteChoice(user_id, choice_id) {
  //console.log(user_id, choice_id);
  const params = { choice_id }; // can use user_id for updated by.
  return await sqlExe.executeCommand(
    `UPDATE choices c SET c.deleted = 1 WHERE c.id = :choice_id `,
    params
  );
}
