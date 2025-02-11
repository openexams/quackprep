import sqlExe from "#db/dbFunctions.js";

export async function getClassCategories() {
  return await sqlExe.executeCommand(`SELECT * FROM class_categories
    ORDER BY
    CASE
      WHEN id = 8 THEN 5000
      ELSE id
      END, id;`);
}

export async function selectClasses(WHERE, params) {
  // pulls in a random group from the class as to use on frotend to check if the class has any groups
  // sorts by the school_id and then by the updated_at (newest first)
  return await sqlExe.executeCommand(
    `
    SELECT cl.id, cl.name, cl.school_id, cl.description, cl.category, MIN(g.id) as group_id, min(p.id) as pdf_id, u.id as created_by, u.username as created_username, vc.votes as upvotes
    FROM classes cl
    LEFT JOIN
        (SELECT
             COALESCE(SUM(
             CASE
                WHEN vote = 0 THEN -1
                WHEN vote = 1 THEN 1
            END
             ),0)
             as votes,
             class_id from class_votes GROUP BY class_id) as vc ON vc.class_id = cl.id

    LEFT JOIN cgroups g on g.class_id = cl.id
    LEFT JOIN pdfs p on p.class_id = cl.id
    INNER JOIN users u on u.id = cl.created_by
    WHERE cl.deleted=0 AND ${WHERE}
    GROUP BY cl.id, cl.name, cl.school_id, cl.description, cl.category, u.id, u.username, cl.updated_at
    ORDER BY cl.school_id ASC, upvotes desc, cl.updated_at DESC
    `,
    params
  );
}

export async function getTotalClasses() {
  return (
    await sqlExe.executeCommand(
      `SELECT COUNT(*) as count FROM classes WHERE deleted = 0`
    )
  )[0]?.count;
}

export async function getClassesBySchoolId(school_id) {
  // where in this is alr done jst past smth in so it does not errs
  return await selectClasses("cl.deleted = 0 AND school_id = :school_id", {
    school_id,
  });
}

// school table in class
export async function getSchools() {
  return await sqlExe.executeCommand(`SELECT *
FROM schools
ORDER BY 
  CASE 
    WHEN school_name = 'General' THEN 0
    ELSE 1
  END,
  school_name; -- Add secondary sorting if needed
`);
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
  const params = { id, school_id, name, description, category, user_id };
  const class_id = (
    await sqlExe.executeCommand(
      `INSERT INTO classes (id,school_id,name,description,category,created_by)
     VALUES(:id, :school_id, :name, :description, :category, :user_id)
     ON DUPLICATE KEY UPDATE
      name = :name,
      description = :description,
      category = :category,
      school_id = :school_id`,
      params,
      { verifyUserOwnsRowId: "classes" }
    )
  ).insertId;
  return (
    await selectClasses("cl.id = :class_id", { class_id: id || class_id })
  )[0];
}

export async function getSchoolByClassId(class_id) {
  return (
    await sqlExe.executeCommand(
      `SELECT s.* FROM schools s
    JOIN classes c ON c.school_id = s.id
    WHERE c.id = :class_id`,
      { class_id }
    )
  )[0];
}
