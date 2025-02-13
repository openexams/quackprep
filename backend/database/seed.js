import { initTestAccount } from "#models/auth/index.js";
import sqlExe from "./dbFunctions.js";
import bcrypt from "bcrypt";

export const class_categories = [
  { name: "CS", description: "Computer Science" },
  { name: "MA", description: "Math" },
  { name: "ECO", description: "Economy" },
  { name: "BIO", description: "Biology" },
  { name: "CHEM", description: "Chemistry" },
  { name: "PHY", description: "Physics" },
  { name: "PSY", description: "Psychology" },
  { name: "Other", description: "Other" },
  { name: "ENG", description: "Engineering" },
  { name: "STAT", description: "Statistics" },
];

export const group_types = [{ type_name: "topic" }, { type_name: "exam" }];

export async function seedDb() {
  for (const category of class_categories) {
    await sqlExe.executeCommand(
      `INSERT INTO class_categories (name, description) VALUES (:name, :description)`,
      { name: category.name, description: category.description }
    );
  }
  for (const type of group_types) {
    await sqlExe.executeCommand(
      `INSERT INTO group_types (type_name) VALUES (:type_name)`,
      { type_name: type.type_name }
    );
  }
  await sqlExe.executeCommand(
    // had to remove ' from don't
    `INSERT INTO schools (school_name,color,description) VALUES('General','black', 'Dont have a exact school you want your content in? Add it here!')`
  );
  await initTestAccount();

  return 0;
}

await seedDb();
