import sqlExe from "#db/dbFunctions.js";

export async function postAnswer(user_id, choice_id) {
  const params = { choice_id, user_id };
  return await sqlExe.executeCommand(
    `INSERT INTO answers_transactional (choice_id, user_id) VALUES(:choice_id,:user_id)`,
    params
  ); // maybe get last inserted id so i can see it worked?
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
