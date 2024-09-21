import sqlExe from "#db/dbFunctions.js";

export async function getClasses() {
  return await sqlExe.executeCommand(
    "SELECT cl.id, cl.name, cl.description, c.name as category FROM classes cl JOIN class_categories c on c.id = cl.category ORDER BY cl.id ASC"
  );
}

export async function getClassIdByClassName(className) {
  const params = { className };
  return await sqlExe.executeCommand(
    "SELECT cl.id, cl.name FROM classes cl WHERE cl.name = :className",
    params
  );
}

// 3 new functions not tested
