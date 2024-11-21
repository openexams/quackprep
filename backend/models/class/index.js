import sqlExe from "#db/dbFunctions.js";
import {
  getLastRowManipulated,
  verifyUserOwnsRowId,
} from "#utils/sqlFunctions.js";

export async function getClassCategories() {
  return await sqlExe.executeCommand(`SELECT * FROM class_categories`);
}

async function selectClasses(WHERE, params) {
  // pulls in a random group from the class as to use on frotend to check if the class has any groups
  return await sqlExe.executeCommand(
    `SELECT cl.id, cl.name, cl.school_id, cl.description, cl.category, MIN(g.id) as group_id, min(p.id) as pdf_id FROM classes cl 
    JOIN class_categories c ON c.id = cl.category
    LEFT JOIN cgroups g on g.class_id = cl.id
    LEFT JOIN pdfs p on p.class_id = cl.id
    WHERE cl.deleted=0 AND ${WHERE}
    GROUP BY cl.id
    ORDER BY cl.school_id ASC
    `,
    params
  );
}

export async function getClasses() {
  // where in this is alr done jst past smth in so it does not errs
  return await selectClasses("cl.deleted = 0", null);
}

// school table in class
export async function getSchools() {
  return await sqlExe.executeCommand(`SELECT * FROM schools`);
}

export async function getClassesByUserId(user_id) {
  const params = { user_id };
  return await selectClasses("cl.created_by = :user_id", params);
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
  const class_id = (
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
    `${getLastRowManipulated("classes", class_id)}`
  );
}
