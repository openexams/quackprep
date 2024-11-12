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
  delChoice
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
  } else if (toDel === "question") {
    where = `q.id = ${id}`;
  } else if (toDel === "choice") {
    where = `c.id = ${id}`;
  } else {
    dlog("toDel passed in must be valid");
    throw new Error("toDel passed in must be valid");
    return;
  }

  const params = { delChoice, delClass, delGroup, delQuestion, user_id };
  const affectedRows = (
    await sqlExe.executeCommand(
      // left join because we want all rows from the prev table and the matching from the new to be joined table, as inner join for example would not delete groups that didnt have questions
      ` 
    UPDATE classes c 
    LEFT JOIN cgroups g ON g.class_id = c.id --  join groups with that certain class id
    LEFT JOIN group_question gq ON g.id = gq.group_id -- join qs in that certain groupid
    LEFT JOIN questions q ON q.id = gq.question_id   -- ^^
    LEFT JOIN choices ch ON ch.question_id = gq.question_id      -- ^
    SET c.deleted=:delClass,g.deleted=:delGroup,q.deleted=:delQuestion,ch.deleted=:delChoice
    WHERE c.created_by = :user_id AND ${where} 
`, // if user created the class they have access to do anything they want inside that class.
      params
    )
  ).affectedRows;
  return id;
}

function verifyTableName(tableName) {
  const allowed_tables = ["classes", "cgroups", "questions", "choices"];

  if (tableName in allowed_tables) {
    return true;
  }
  return false;
}

export async function verifyUserOwnsRowId(id, user_id, tableName) {
  if (verifyTableName(tableName) === false) {
    return false;
  }
  const owned = await sqlExe.executeCommand(
    `SELECT * FROM ${tableName} x WHERE x.id = :id`,
    { id }
  );
  owned = owned?.[0]?.created_by;
  if (owned === user_id) {
    return true;
  }
  return false;
}
/**
 *
 * @param {Int} user_id
 * @param {String} tableName tableName must have created_by column DO NOT LET USERS RUN THIS SQL INJECTION
 */
export async function verifyRowCreatedByUser(id, user_id, tableName) {
  const result = await sqlExe.executeCommand(
    `SELECT * from ${tableName} WHERE id = :id AND created_by = :user_id`,
    { id, user_id }
  );
  if (result?.[0]?.created_by) {
    return true;
  }
  return false;
}
