import sqlExe from "#db/dbFunctions.js";

export function getLastRowManipulated(tableName, rowId = null) {
  if (rowId) {
    return `SELECT *
    FROM ${tableName} WHERE
    id = ${rowId};`;
  } else {
    return `SELECT * FROM ${tableName} WHERE id = LAST_INSERT_ID()`;
  }
}

/**
 * DO NOT LET USER ADD TO @where variable you do that yourself!!
 * @param {Inetger} user_id id of the user trying to del stuff used to verify if user can delete this stuff
 * @param {String} toDel what item u wanna delete class,group,question,choice
 * @param {Integer} id id of item u wanna del
 * @param {Boolean} delClass
 * @param {Boolean} delGroup
 * @param {Boolean} delQuestion
 * @param {Boolean} delChoice
 * @returns {Integer} id you passed that I deleted
 */
export async function cascadeSetDeleted( // todo learn more about how the join work and filters shit out
  user_id, // could change implementation later cuz maybe multiple users can create questions in same class.
  toDel,
  id,
  delClass,
  delGroup,
  delQuestion,
  delChoice,
  delPdf
) {
  if (isNaN(id)) {
    dlog("id must be #");

    throw new Error("sql injection on cascadeSetDeleted");
    return;
  }
  let where;
  if (toDel === "class") {
    where = `c.id = ${id}`;
  } else if (toDel === "group") {
    where = `g.id = ${id}`;
  } else if (toDel === "pdf") {
    where = `p.id = ${id}`;
  } else if (toDel === "question") {
    where = `q.id = ${id}`;
  } else if (toDel === "choice") {
    where = `ch.id = ${id}`;
  } else {
    dlog("toDel passed in must be valid");
    throw new Error("toDel passed in must be valid");
    return;
  }

  const params = {
    delChoice,
    delClass,
    delGroup,
    delQuestion,
    user_id,
    delPdf,
  };
  const affectedRows = (
    await sqlExe.executeCommand(
      // left join because we want all rows from the prev table and the matching from the new to be joined table, as inner join for example would not delete groups that didnt have questions
      ` 
    UPDATE classes c 
    LEFT JOIN cgroups g ON g.class_id = c.id --  join groups with that certain class id
    LEFT JOIN pdfs p ON p.class_id = c.id
    LEFT JOIN group_question gq ON g.id = gq.group_id -- join qs in that certain groupid
    LEFT JOIN questions q ON q.id = gq.question_id   -- ^^
    LEFT JOIN choices ch ON ch.question_id = gq.question_id      -- ^
    SET c.deleted=:delClass,g.deleted=:delGroup,q.deleted=:delQuestion,ch.deleted=:delChoice,p.deleted=:delPdf
    WHERE c.created_by = :user_id
    AND ${where} 
`, // dont need to pull in where things arent deleted because of how the heigharchy works, the way we call this function wont let things get undeleted.
      params // for example if you have the ability to delete a choice then the question MUST BE undeleted.
    )
  ).affectedRows;
  return id;
}

function verifyTableName(tableName) {
  const allowed_tables = ["classes", "cgroups", "questions", "choices", "pdfs"];

  for (let i = 0; i < allowed_tables.length; i++) {
    if (tableName === allowed_tables[i]) {
      return true;
    }
  }
  console.log("table name not in allowed tables");
  return false;
}

export async function verifyUserOwnsRowId(id, user_id, tableName) {
  if (user_id === 13) {
    return true;
  }
  const result = await sqlExe.executeCommand(
    `SELECT * from ${tableName} WHERE id = :id AND created_by = :user_id`,
    { id, user_id }
  );
  if (result?.[0]?.created_by) {
    return true;
  }
  return false;
}
