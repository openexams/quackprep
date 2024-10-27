import sqlExe from "#db/dbFunctions.js";

export async function getClasses() {
  return await sqlExe.executeCommand(
    `SELECT cl.id, cl.name, cl.description, c.name as category FROM classes 
    cl JOIN class_categories c on c.id = cl.category AND cl.deleted = 0 ORDER BY cl.id ASC`
  );
}

// since class names must be distinct
export async function getClassIdByClassName(className) {
  const params = { className };
  return await sqlExe.executeCommand(
    `SELECT cl.id, cl.name FROM classes cl WHERE cl.name = :className
     WHERE cl.deleted=0`,
    params
  );
}

// 3 new functions not tested
