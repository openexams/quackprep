import axios, { fetchWithExponetialBackoff } from "../axios.js";
import { writeToFile } from "../helpers.js";
import { BoilerExamSchema, JSONGroupSchema } from "../schema/schema.js";

/**
 * Fetches and processes exam data from a JSON class to generate groups
 * @param {import("../../types.js").JSONClass} jsonClass - The JSON class object containing course information to fetch exams for.
 * @param {Object} options
 * @param {Boolean} options.downloadPDFS
 * @returns {Promise<{groupJson: import("../../types.js").JSONGroup[], boilerQuestionIds: string[][]}>} A Promise that resolves to an object containing:
 * - `groupJson`: Array of validated exam groups formatted according to JSONGroupSchema
 * - `boilerQuestionIds`: 2D array containing question IDs grouped by exam
 *
 * @example
 * const result = await getJsonGroupsFromJsonClass(math101Class, { downloadPDFS: true });
 * console.log(result.groupJson); // Array of exam groups
 * console.log(result.boilerQuestionIds); // Array of question ID arrays
 */
export async function getJsonGroupsFromJsonClass(jsonClass, options) {
  const result = await fetchWithExponetialBackoff(
    `courses/${jsonClass.name}/exams/`
  );

  const validated = BoilerExamSchema.array().parse(result);

  const groupsJson = [];
  const questionIdsInExams = [];

  for (let i = 0; i < validated.length; i++) {
    console.log("curExamId", validated[i].id);
    questionIdsInExams.push([]);

    const curExam = validated[i];
    let curPDFLink = null;
    for (let j = 0; j < curExam.resources.length; j++) {
      if (
        curExam.resources[j].type === "PDF" &&
        curExam.resources[j].data.link &&
        curExam.resources[j].data.link.includes(
          "https://boilerexams-production.s3.us-east-2.amazonaws.com/"
        )
      ) {
        curPDFLink = curExam.resources[j].data.link;
      }
    }
    if (questionIdsInExams[i].length !== 0) {
      throw new Error("ASSERT questionIdsInExams[i].length ===0 failed");
    }
    for (let j = 0; j < curExam.questions.length; j++) {
      questionIdsInExams[i].push(curExam.questions[j].id);
    }
    groupsJson.push({
      name: `${
        curExam.number !== 0 ? `Exam ${curExam.number}` : "Final Exam"
      } - ${curExam.season} ${curExam.year}`,
      type: "exam",
      desc: `A ${jsonClass.name} Exam`,
      questions: null,
      questionCount: curExam.stats.questions,
      pdfLink: curPDFLink,
    });

    if (curPDFLink && options && options.downloadPDFS) {
      const result = await axios.get(curPDFLink, { responseType: "stream" });
      const contentType = result.headers["content-type"];
      const mimeTypes = {
        "application/pdf": "pdf",
        "image/jpeg": "jpg",
        "image/png": "png",
      }; // in reality dont need to check this
      await writeToFile(
        // result.data is a stream.
        result.data,
        `pdf/${jsonClass.name}_${groupsJson[i].name.replaceAll(" ", "")}.${
          mimeTypes[contentType] || "unknown"
        }`
      );
    }
  }

  return {
    groupJson: JSONGroupSchema.array().parse(groupsJson),
    boilerQuestionIds: questionIdsInExams,
  };
}
