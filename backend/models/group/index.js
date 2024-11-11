import sqlExe from "#db/dbFunctions.js";

export async function getGroupsByClassId(class_id, type) {
  const params = { class_id, type };
  return await sqlExe.executeCommand(
    `SELECT g.name,g.id,g.desc,g.created_by, g.class_id, gt.type_name as type 
    FROM cgroups g JOIN group_types gt on g.type = gt.id WHERE gt.type_name = :type 
    AND g.deleted = 0 ORDER BY g.id ASC`,
    params
  );
}

export async function getGroupsByUserId(user_id, type) {
  const params = { user_id, type };
  return await sqlExe.executeCommand(
    `SELECT g.name,g.id,g.desc,g.created_by, g.class_id, gt.type_name as type 
    FROM cgroups g JOIN group_types gt on g.type = gt.id WHERE gt.type_name = :type 
    AND g.deleted = 0 AND g.created_by =:user_id ORDER BY g.id ASC`,
    params
  );
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
  if (id && verifyUserOwnsId(id, user_id, "cgroups") === false) {
    throw new Error("user does not own the row they are trying to edit");
    return;
  }
  const unique = await sqlExe.executeCommand(
    `SELECT * from cgroups WHERE class_id = :class_id AND name =:name`,
    params
  );
  if (!id && unique?.[0]?.class_id) {
    throw new Error(
      "verifys issue where you create a group with same name and same class as other person."
    );
    return;
  }
  return (
    await sqlExe.executeCommand(
      `INSERT INTO cgroups(id,name,type,\`desc\`,created_by,class_id) VALUES(id,:name,(SELECT id FROM group_types where type_name = :type),:desc,:user_id,:class_id)
      ON DUPLICATE KEY UPDATE
      name =:name,
      type=(SELECT id FROM group_types where type_name = :type),
      \`desc\`=:desc,
      class_id=:class_id
      
      `,
      params
    )
  ).insertId;
}
