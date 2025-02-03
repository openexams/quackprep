import { fetchWithExponetialBackoff } from "../axios.js";
import { BoilerExamSchema, JSONGroupSchema } from "../schema/schema.js";

/**
 *
 * @param {import("../types").JSONClass} jsonClass
 */
export async function getJsonGroupsCallBoilerFromJsonClass(jsonClass) {
  const result = await fetchWithExponetialBackoff(
    `courses/${jsonClass.name}/exams/`
  );

  const validated = BoilerExamSchema.array().parse(result);
  const groupsJson = [];
  for (let i = 0; i < validated.length; i++) {
    const curExam = validated[i];
    groupsJson.push({
      name: `${
        curExam.number !== 0 ? `Exam ${curExam.number}` : "Final Exam"
      } - ${curExam.season} ${curExam.year}`,
      type: 2,
      desc: `A ${jsonClass.name} Exam`,
      questions: null,
      questionCount: curExam.stats.questions,
    });
  }
  return JSONGroupSchema.array().parse(groupsJson);
}

console.log(await getJsonGroupsCallBoilerFromJsonClass({ name: "MA16200" }));
