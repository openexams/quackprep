import { fetchWithExponetialBackoff } from "../axios.js";
import { BoilerExamSchema, JSONGroupSchema } from "../schema/schema.js";

/**
 *
 * @param {import("../types").JSONClass} jsonClass
 */
export async function getJsonGroupsFromJsonClass(jsonClass) {
  const result = await fetchWithExponetialBackoff(
    `courses/${jsonClass.name}/exams/`
  );

  const validated = BoilerExamSchema.array().parse(result);
  const groupsJson = [];
  for (let i = 0; i < validated.length; i++) {
    const curExam = validated[i];
    let curPDFLink = null;
    for (let j = 0; j < curExam.resources.length; j++) {
      if (
        curExam.resources[j].type === "PDF" &&
        curExam.resources[j].data.link.includes(
          "https://boilerexams-production.s3.us-east-2.amazonaws.com/"
        )
      ) {
        curPDFLink = curExam.resources[j].data.link;
      }
    }
    groupsJson.push({
      name: `${
        curExam.number !== 0 ? `Exam ${curExam.number}` : "Final Exam"
      } - ${curExam.season} ${curExam.year}`,
      type: 2,
      desc: `A ${jsonClass.name} Exam`,
      questions: null,
      questionCount: curExam.stats.questions,
      pdfLink: curPDFLink,
    });
  }
  return JSONGroupSchema.array().parse(groupsJson);
}
