import sqlExe from "#db/dbFunctions.js";

export async function getQuestionsByTopicId(group_id) {
  const params = { group_id };
  return await sqlExe.executeCommand(
    // PULL IN MORE!
    `SELECT q.id, q.question, tp.topic_id as group_id, 'topic' AS type FROM questions q JOIN topic_question tp ON tp.topic_id = :group_id AND tp.question_id = q.id ORDER BY q.id ASC`,
    params
  );
}

export async function getQuestionsByExamId(group_id) {
  const params = { group_id };

  return await sqlExe.executeCommand(
    // PULL IN MORE!
    `SELECT q.id, q.question, eq.exam_id as group_id, 'exam' AS type FROM questions q JOIN exam_question eq ON eq.exam_id = :group_id AND eq.question_id = q.id ORDER BY q.id ASC`,
    params
  );
}

/**
 *
 * @param {Int} user_id user id foreign key
 * @param {Int} topic_id topic id foreign key
 * @param {String} question question in md, to use latex wrap in $$ so for ex hello $$\Theta$$ just did big theta
 * @param {String} year year of exam 2019 etc
 * @param {String} semester Spring or fall possibly summer depends
 * @param {Int} exam_num classes have x amt of exams, last exam usually means final
 * @param {Int} question_num_on_exam our question numbers have id, the exam question have numbers ie question 1 etc
 * @returns {Int} question id u just insterted.
 */
export async function createQuestionInTopic( // NOT TESTED TODO
  user_id,
  topic_id,
  question,
  year,
  semester,
  exam_num,
  question_num_on_exam
) {
  const params = {
    user_id,
    topic_id,
    question,
    year,
    semester,
    exam_num,
    question_num_on_exam,
  };
  const result = (
    await sqlExe.executeCommand(
      `INSERT INTO questions (created_by,question,year,semester,exam_num,question_num_on_exam) VALUES(:user_id, :question,:year,:semester,:exam_num,:question_num_on_exam)`,
      params
    )
  ).insertId;
  params["result"] = result;
  const bridge_tbl_res = (
    await sqlExe.executeCommand(
      `INSERT INTO topic_question (topic_id,question_id) VALUES(:topic_id, :result)`,
      params
    )
  ).insertId;
  return result;
}
