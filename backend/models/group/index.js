import sqlExe from "#db/dbFunctions.js";

export async function getGroupsByClassId(class_id, type) {
  const params = { class_id, type };
  return await sqlExe.executeCommand(
    `SELECT g.name,g.id,g.desc,g.created_by, g.class_id, gt.type_name as type FROM cgroups g JOIN group_types gt on g.type = gt.id WHERE gt.type_name = :type ORDER BY g.id ASC`,
    params
  );
}

// not used
export async function getGroupIdByClassNameAndGroupName(groupName, className) {
  const params = { groupName, className };
  return await sqlExe.executeCommand(
    // todo may be cooked chat
    `SELECT g.id,g.name, g.class_id FROM cgroups g JOIN classes c ON g.class_id = c.id AND c.name = :className WHERE g.name =:groupName`,
    params
  );
}

export async function createGroupInClass(user_id, class_id, type, name, desc) {
  const params = { user_id, class_id, type, name, desc };
  return (
    await sqlExe.executeCommand(
      `INSERT INTO cgroups(name,type,\`desc\`,created_by,class_id) VALUES(:name,:type,:desc:user_id,:class_id);`, // back ticks may not work
      params
    )
  ).insertId;
}

// TODO CREATE GROUP & ADD GROUP TO CLASS
