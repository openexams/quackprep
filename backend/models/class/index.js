import sqlExe from "#db/dbFunctions.js";
import {
  getLastRowManipulated,
  verifyUserOwnsRowId,
} from "#utils/sqlFunctions.js";

export async function getClasses() {
  return await sqlExe.executeCommand(
    `SELECT cl.id, cl.name, cl.school_id, cl.description, c.name as category FROM classes 
    cl JOIN class_categories c on c.id = cl.category AND cl.deleted = 0 ORDER BY cl.id ASC`
  );
}

// since class names must be distinct
export async function getClassIdByClassName(className) {
  const params = { className };
  return await sqlExe.executeCommand(
    `SELECT cl.id, cl.name FROM classes cl WHERE cl.name = :className
     AND cl.deleted=0`,
    params
  );
}

// school table in class
export async function getSchools() {
  return await sqlExe.executeCommand(`SELECT * FROM schools`);
}

export async function getClassesBySchoolId(schoolId) {
  // written by AI todo test
  const params = { schoolId };
  return await sqlExe.executeCommand(
    `SELECT cl.id, cl.name, cl.school_id, cl.description, cl.category FROM classes 
    cl WHERE cl.school_id = :schoolId AND cl.deleted = 0 ORDER BY cl.id ASC`,
    params
  );
}

export async function getClassesByUserId(user_id) {
  const params = { user_id };
  return await sqlExe.executeCommand(
    `SELECT cl.id, cl.name, cl.school_id, cl.description, cl.category FROM classes 
    cl WHERE cl.created_by = :user_id AND cl.deleted = 0 ORDER BY cl.id ASC`,
    params
  );
}

export async function upsertClass(
  id,
  school_id,
  name,
  description,
  category,
  user_id
) {
  const params = { id, school_id, name, description, category, user_id }; // TODO CAN THIS USER CREATE A CLASS IN THIS SCHOOL?

  // this should only run if editing, not if creating
  if (id && (await verifyUserOwnsRowId(id, user_id, "classes")) === false) {
    throw new Error("user does not own the row they are trying to edit");
    return;
  }

  const unique = await sqlExe.executeCommand(
    `SELECT * from classes WHERE school_id = :school_id AND name =:name AND created_by != :user_id`, // dont actually need (created_by != :user_id) but its the safe play "im conservative in my programming but liberal in eveything else" - Hubert Dunesmore
    params
  );
  if (!id && unique?.[0]?.name) {
    // TODO is this a good way to do this, can i abstract this out?
    // verifys issue where you create a class with same name and school as other person.
    throw new Error(
      "verifys issue where you create a class with same name and school as other person."
    );
    return;
  }
  const result = (
    await sqlExe.executeCommand(
      `INSERT INTO classes (id,school_id,name,description,category,created_by)
     VALUES(:id, :school_id, :name, :description, :category, :user_id)
     ON DUPLICATE KEY UPDATE
      name = :name,
      description = :description,
      category = :category,
      school_id = :school_id`,
      params
    )
  ).insertId;
  return await sqlExe.executeCommand(
    `${getLastRowManipulated("classes", result)}`
  );
}
