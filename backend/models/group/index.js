import sqlExe from "#db/dbFunctions.js";
import { verifyUserOwnsRowId } from "#utils/sqlFunctions.js";

async function selectGroups(WHERE, params) {
  return await sqlExe.executeCommand(
    `SELECT g.name,g.id,g.desc,g.created_by, g.class_id, gt.type_name as type, cl.category as class_category, cl.school_id
    FROM cgroups g JOIN group_types gt on g.type = gt.id 
    JOIN classes cl ON g.class_id = cl.id
    
    WHERE g.deleted = 0 AND cl.deleted=0 AND ${WHERE} 
    ORDER BY g.class_id ASC`,
    params
  );
}

export async function getGroupsByClassId(class_id, type) {
  const params = { class_id, type };
  if (type) {
    return await selectGroups(
      `g.class_id = :class_id AND gt.type_name = :type`,
      params
    );
  } else {
    return await selectGroups(`g.class_id = :class_id`, params);
  }
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
  // uniqueness check?
  const unique = await sqlExe.executeCommand(
    `SELECT * from cgroups WHERE class_id = :class_id AND name =:name AND created_by != :user_id`,
    params
  );
  if (!id && unique?.[0]?.class_id) {
    throw new Error(
      "verifys issue where you create a group with same name and same class as other person."
    );
    return;
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
  return await selectGroups(`g.id = :result`, { result: id || group_id });
}
