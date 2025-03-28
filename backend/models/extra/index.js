import sqlExe from "#db/dbFunctions.js";
import {
  getLastRowManipulated,
  verifyUserOwnsRowId,
} from "#utils/sqlFunctions.js";

export async function getAnnouncement() {
  return (await sqlExe.executeCommand(`SELECT * FROM announcements`))[0]?.text;
}

export async function selectPdfs(WHERE, params) {
  return await sqlExe.executeCommand(
    `SELECT p.id, p.link, p.name, p.class_id, cl.category as class_category, cl.school_id FROM pdfs p
    JOIN classes cl ON p.class_id = cl.id 
    WHERE p.deleted = 0 AND ${WHERE}
    ORDER BY p.class_id`,
    params
  );
}

export async function getPdfsByClassId(class_id) {
  const params = { class_id };
  return await selectPdfs(`p.class_id = :class_id`, params);
}

export async function getPdfsByUserId(user_id) {
  const params = { user_id };
  return await selectPdfs(`p.created_by = :user_id`, params);
}

export async function upsertPdf(user_id, id, link, class_id, name) {
  const params = { user_id, id, link, class_id, name };

  // TODO MAKES SURE USER OWNS CLASS THEY ARE INSERTING PDF INTO
  if (!id && !(await verifyUserOwnsRowId(class_id, user_id, "classes"))) {
    throw new Error("user is adding a pdf to a class which they do NOT own");
    return;
  }

  const pdf_id = (
    await sqlExe.executeCommand(
      `INSERT INTO pdfs (name, created_by, id, link, class_id)
     VALUES(:name,:user_id, :id, :link, :class_id)
     ON DUPLICATE KEY UPDATE
      link = :link,
      class_id = :class_id,
      name=:name
`,
      params,
      { verifyUserOwnsRowId: "pdfs" }
    )
  ).insertId;
  return await selectPdfs(`p.id=:pdf_id`, { pdf_id: id || pdf_id });
}
