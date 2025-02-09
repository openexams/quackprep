import sqlExe from "#db/dbFunctions.js";

export async function selectQuestionPosts(WHERE, params) {
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
     WHERE ${WHERE}
     ORDER BY qp.updated_at DESC
    `,
    params
  );
}

export async function getQuestionPostsByQuestionId(question_id) {
  return await selectQuestionPosts(`qp.question_id = :question_id`, {
    question_id,
  });
}
// user can edit deleted post but it shouldnt affect anything
export async function upsertQuestionPost(
  id = null,
  post_id = null,
  question_id,
  text,
  user_id
) {
  const insert_id = (
    await sqlExe.executeCommand(
      `
    INSERT INTO question_forum_posts (id, post_id, question_id,text,created_by) 
    VALUES (:id, :post_id, :question_id,:text,:user_id)
    ON DUPLICATE KEY UPDATE
    text = :text
    `,
      { id, post_id, question_id, text, user_id },
      { verifyUserOwnsRowId: "question_posts_forum" }
    )
  ).insertId;
  return (
    await selectQuestionPosts("qp.id = :valid_ref_id", {
      valid_ref_id: id || insert_id,
    })
  )[0];
}

export async function deleteQuestionPost(id, user_id) {
  await sqlExe.executeCommand(
    `UPDATE question_forum_posts SET deleted = 1 WHERE id = :id`,
    { id, user_id },
    { verifyUserOwnsRowId: "question_posts_forum" }
  );
  return id;
}
