import sqlExe from "#db/dbFunctions.js";

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

export async function getTotalSubmissions() {
  return (
    await sqlExe.executeCommand(`SELECT count(*) as count from answers_transactional at
  `)
  )?.[0]?.count;
}

export async function getTotalAiQuestions() {
  return (
    await sqlExe.executeCommand(`SELECT count(*) as count from questions where ai = 1 and deleted = 0
  `)
  )?.[0]?.count;
}
