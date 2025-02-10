import sqlExe from "#db/dbFunctions.js";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";
import { cascadeSetDeleted } from "#utils/sqlFunctions.js";
import { groupSelectSchema } from "../../../schema/index.js";

/**
 *
 * @param {*} WHERE
 * @param {*} params
 * @returns {import('../../../types').Group[]}
 */
async function selectGroups(WHERE, params) {
  const result = await sqlExe.executeCommand(
    `SELECT g.name,g.id,g.desc,g.created_by, g.class_id, gt.type_name as type, cl.category as class_category, cl.school_id
    FROM cgroups g JOIN group_types gt on g.type = gt.id 
    JOIN classes cl ON g.class_id = cl.id
    
    WHERE g.deleted = 0 AND cl.deleted=0 AND ${WHERE} 
    ORDER BY g.class_id ASC`,
    params
  );
  return groupSelectSchema.array().parse(result);
}

export async function getGroupsByClassId(class_id, type) {
  const params = { class_id, type };

  return await selectGroups(
    `g.class_id = :class_id ${type ? "AND gt.type_name = :type" : ""}`,
    params
  );
}

export async function getGroupsByUserId(user_id) {
  const params = { user_id };
  return await selectGroups("g.created_by =:user_id", params);
}

export async function upsertGroupInClass(
  user_id,
  class_id,
  type,
  name,
  desc,
  id = null
) {
  // this should only run if editing, not if creating
  const params = { user_id, class_id, type, name, desc, id };

  if (!(await verifyUserOwnsRowId(class_id, user_id, "classes"))) {
    throw new Error(
      "user does not own the class they are trying to edit/create a group in"
    );
    return; // all work end no play makea maddox a dull boy
  }
  const group_id = (
    await sqlExe.executeCommand(
      `INSERT INTO cgroups(id,name,type,\`desc\`,created_by,class_id) VALUES(:id,:name,(SELECT id FROM group_types where type_name = :type),:desc,:user_id,:class_id)
      ON DUPLICATE KEY UPDATE
      name =:name,
      type=(SELECT id FROM group_types where type_name = :type),
      \`desc\`=:desc,
      class_id=:class_id
      
      `,
      params,
      { verifyUserOwnsRowId: "cgroups" }
    )
  ).insertId;
  return (await selectGroups(`g.id = :result`, { result: id || group_id }))[0];
}
export async function deleteGroupById(user_id, group_id) {
  return await cascadeSetDeleted(user_id, "group", group_id, 0, 1, 1, 1, 0);
}

/**
 * Maps a link to a group
 * @param {String} link
 * @param {Number} group_id
 * @returns {Number} id that was created in group_file_inserts
 */
export async function uploadFileLinkToGroup(link, group_id) {
  return (
    await sqlExe.executeCommand(
      `INSERT INTO group_file_inserts (link,group_id) VALUES (:link,:group_id)`,
      { link, group_id }
    )
  ).insertId;
}
