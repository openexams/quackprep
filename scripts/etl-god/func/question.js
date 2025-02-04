import axios, { fetchWithExponetialBackoff } from "../axios.js";
import {
  BoilerQuestionSchema,
  BoilerQuestionSubmissionSchema,
  JSONChoiceSchema,
  JSONQuestionSchema,
} from "../schema/schema.js";
import { sleep } from "../helpers.js";

function createMDImageFromURLAndAlt(url, altText) {
  return `![${altText || ""}](${url})`;
}

/**
 *
 * @param {String} questionId
 * @param {String} type MULTIPLE_CHOICE || FREE_RESPONSE
 * @param {Number[]} userSolution
 */
export async function postQuestionSubmissionToBoilerExams(
  questionId,
  type,
  userSolution
) {
  const millisecondsSpanned = Math.round((Math.random() + 0.5) * 15 * 1000);
  const timeStarted = new Date();
  const timeEnded = new Date(timeStarted.getTime() + millisecondsSpanned);

  const submissionData = {
    questionId: questionId,
    type: type,
    userSolution: userSolution,
    timeStarted: timeStarted.toISOString(),
    timeEnded: timeEnded.toISOString(),
    timeSpent: millisecondsSpanned,
    timeSpentModal: 0,
    timeSpentVideo: 0,
    osFamily: "Windows",
  };
  await sleep(millisecondsSpanned);

  const response = await axios.post(
    "/submissions",
    BoilerQuestionSubmissionSchema.parse(submissionData)
  );
  console.log("Sent", submissionData);
  return response.data;
}

/**
 * TODO FINISH!!
 * @param {String[]} boilerQuestionIds
 * @returns {import("../types").JSONQuestion} questions with choices included.
 */
export async function boilerQuestionsToJsonQuestions(boilerQuestionIds) {
  const questions = [];
  for (let i = 0; i < boilerQuestionIds.length; i++) {
    // for all passed in questions
    const result = await fetchWithExponetialBackoff(
      `/questions/${boilerQuestionIds[i]}`
    );
    console.log(`recieved ${JSON.stringify(result)}`);
    const validated = BoilerQuestionSchema.parse(result);

    const question_images =
      validated.resources.length > 0
        ? validated.resources
            .filter((item) => item.type === "IMAGE" && item.questionId !== null) // all things related to question will be in base resource.
            .map((item) =>
              createMDImageFromURLAndAlt(item.data.url, item.data.altText)
            )
            .join("\n")
        : null;

    const question_explanation_url = validated.explanation.resources.find(
      (resource) => resource.type === "VIDEO"
    ).data.url; // finds first video (should only be one I hope. add validation checks for this)

    const question_text = validated.data.body;

    const question_topic_names = validated.topics.map((topic) => topic.name);

    let question_type = null;
    // dumbass logic to check question type for quackprep.
    if (
      Array.isArray(validated.data.solution) &&
      validated.data.solution.length > 0 &&
      validated.data.answerChoices.length > 0 &&
      validated.type === "MULTIPLE_CHOICE"
    ) {
      question_type = "mcq";
    } else if (
      // they have shit setup so weird, bunch of cowboys ill tell you. - Hubert (Buster) Dunesmore.
      Array.isArray(validated.data.solution) &&
      validated.data.solution.length === 0 &&
      validated.data.answerChoices.length === 0 &&
      validated.type === "MULTIPLE_CHOICE"
    ) {
      question_type = "frq";
    } else if (
      validated.type === "FREE_RESPONSE" &&
      !Array.isArray(validated.data.solution)
    ) {
      question_type = "frq";
    } else {
      throw new Error(`I have not forseen this question type ${{ validated }}`);
    }
    // for choices all things relating to the choices for images etc will be in explanation.resources

    let choices = null;
    if (question_type === "frq") {
      const choice_images =
        validated.explanation.resources.length > 0
          ? validated.explanation.resources
              .filter((item) => item.type === "IMAGE")
              .map((item) =>
                createMDImageFromURLAndAlt(item.data.url, item.data.altText)
              )
              .join("\n")
          : null;
      choices = [
        {
          answer: validated.data.solution + " " + choice_images,
          is_correct: 1,
          type: question_type,
        },
      ];
    } else if (question_type === "mcq") {
      choices = validated.data.answerChoices.map((choice) => {
        const curChoiceImages =
          validated.explanation.resources.length > 0
            ? validated.explanation.resources
                .filter(
                  (item) =>
                    item.answerChoiceId === choice.id && item.type === "IMAGE"
                )
                .map((item) =>
                  createMDImageFromURLAndAlt(item.data.url, item.data.altText)
                )
                .join("\n")
            : null;
        return {
          answer: choice.body + " " + curChoiceImages,
          is_correct: validated.data.solution.includes(choice.index) ? 1 : 0,
          type: question_type,
        };
      });
    } else {
      throw new Error("question type isnt frq or mcq somehow");
    }

    questions.push(
      JSONQuestionSchema.parse({
        question: question_text + " " + question_images,
        explanation_url: question_explanation_url,
        topics: question_topic_names,
        choices: JSONChoiceSchema.array().parse(choices),
      })
    );

    // fix image can be for question or for choice.
  }
  return JSONQuestionSchema.array().parse(questions);
}

// console.log(
//   (
//     await boilerQuestionsToJsonQuestions([
//       "91839a1e-5f61-4ac7-a05f-75b97967004a",
//     ])
//   )[0].question
// );
