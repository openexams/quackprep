import axios, { fetchWithExponetialBackoff } from "../axios.js";
import { writeToFile } from "../helpers.js";
import {
  BoilerExamSchema,
  BoilerTopicSchema,
  JSONGroupSchema,
} from "../schema/schema.js";

/**
 *
 * @param {import("../types.js").BoilerExam | import("../types.js").BoilerTopic} boilerGroup
 * @returns {String[]}
 */
export function addBoilerQuestionIdsFromGroupToArray(boilerGroup) {
  const ret = [];
  for (let j = 0; j < boilerGroup.questions.length; j++) {
    ret.push(boilerGroup.questions[j].id);
  }
  return ret;
}

/**
 *
 * @param {import("../types.js").JSONClass} jsonClass
 * @returns {import("../types.js").JSONGroup[]}
 */
export async function getTopicJsonGroupsFromJsonClass(jsonClass) {
  const result = await fetchWithExponetialBackoff(
    `/courses/${jsonClass.name}/topics`
  );
  const validated = BoilerTopicSchema.array().parse(result);
  console.log(`got ${validated.length} topics from ${jsonClass.name}`);
  const questionIdsInTopics = [];
  const topics = [];
  for (let i = 0; i < validated.length; i++) {
    const curTopic = validated[i];
    questionIdsInTopics.push(addBoilerQuestionIdsFromGroupToArray(curTopic));
    topics.push({
      name: curTopic.name,
      type: "topic",
      desc: `${curTopic.name} in ${jsonClass.name}`,
      questions: null,
      questionCount: curTopic.stats.questions,
      pdfLink: null,
    });
  }
  return {
    groupJson: JSONGroupSchema.array().parse(topics),
    boilerQuestionIds: questionIdsInTopics,
  };
}

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
export async function getExamJsonGroupsFromJsonClass(jsonClass, options) {
  const result = await fetchWithExponetialBackoff(
    `courses/${jsonClass.name}/exams/`
  );
  if (
    !Array.isArray(result) ||
    (Array.isArray(result) && result.length === 0)
  ) {
    console.log(`courses/${jsonClass.name}/exams/ has no exams, trying topics`);
    return getTopicJsonGroupsFromJsonClass(jsonClass);
  }

  const validated = BoilerExamSchema.array().parse(result);
  console.log(`recieved ${validated.length} exams for class`, jsonClass.name);

  const groupsJson = [];
  const questionIdsInExams = [];

  for (let i = 0; i < validated.length; i++) {
    console.log("curExamId", validated[i].id);

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
    questionIdsInExams.push(addBoilerQuestionIdsFromGroupToArray(curExam));
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
        `pdf/${jsonClass.name}-${groupsJson[i].name.replaceAll(" ", "")}.${
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
