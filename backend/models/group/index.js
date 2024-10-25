import sqlExe from "#db/dbFunctions.js";

export async function getGroupsByClassId(class_id, type) {
  const params = { class_id, type };
  return await sqlExe.executeCommand(
    `SELECT g.name,g.id,g.desc,g.created_by, g.class_id, gt.type_name as type FROM cgroups g JOIN group_types gt on g.type = gt.id WHERE gt.type_name = :type ORDER BY g.id ASC`,
    params
  );
}

export async function getGroupIdByClassNameAndGroupName(groupName, className) {
  const params = { groupName, className };
  return await sqlExe.executeCommand(
    // todo may be cooked chat
    `SELECT g.id,g.name, g.class_id FROM cgroups g JOIN classes c ON g.class_id = c.id AND c.name = :className WHERE g.name =:groupName`,
    params
  );
}

// TODO CREATE GROUP & ADD GROUP TO CLASS
