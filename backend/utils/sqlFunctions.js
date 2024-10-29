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
 * @returns {Integer} #rows affected
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
  return (
    await sqlExe.executeCommand(
      `
    UPDATE classes c 
    JOIN cgroups g ON g.class_id = c.id --  join groups with that certain class id
    JOIN group_question gq ON g.id = gq.group_id -- join qs in that certain groupid
    JOIN questions q ON q.id = gq.question_id   -- ^^
    JOIN question_choice qc ON q.id =qc.question_id  -- join choices with that q id
    JOIN choices ch ON ch.id = qc.choice_id         -- ^
    SET c.deleted=:delClass,g.deleted=:delGroup,q.deleted=:delQuestion,ch.deleted=:delChoice
    WHERE c.created_by = :user_id AND ${where} 
`, // if user created the class they have access to do anything they want inside that class.
      params
    )
  ).affectedRows;
}
