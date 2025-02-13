import sqlExe from "./dbFunctions";

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

export async function seedDb() {
  for (const category of class_categories) {
    await sqlExe.executeCommand(
      `INSERT INTO class_categories (name, description) VALUES (:name, :description)`,
      { name: category.name, description: category.description }
    );
  }
  await sqlExe.executeCommand(
    `INSERT INTO schools (school_name,color) VALUES('General','black')`
  );
}
