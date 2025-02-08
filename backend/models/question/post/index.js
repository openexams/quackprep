import sqlExe from "#db/dbFunctions.js";

export async function getQuestionPostsByQuestionId(question_id) {
  return await sqlExe.executeCommand(
    `
    select
    qp.id,qp.question_id,

           CASE
           WHEN qp.deleted = 1 THEN NULL
           ELSE qp.text
           END as text
           
         ,qp.post_id,qp.updated_at,u.username,u.icon,qp.created_by,qp.deleted
    from question_forum_posts qp
    JOIN users u ON qp.created_by = u.id
    `,
    { question_id }
  );
}
