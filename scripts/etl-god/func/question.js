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
 *
 * @param {import("../types.js").BoilerQuestion | String} boilerQuestion
 * @param {String} questionContext
 * @returns {import("../types.js").JSONQuestion[]}
 */
export async function boilerQuestionToJsonQuestion(
  boilerQuestionOrId,
  questionContext = null
) {
  let boilerQuestion = null;
  if (typeof boilerQuestionOrId === "string") {
    console.log("curQuestionId", boilerQuestionOrId);
    const result = await fetchWithExponetialBackoff(
      `/questions/${boilerQuestionOrId}`
    );
    boilerQuestion = BoilerQuestionSchema.parse(result);
  } else {
    console.log("curQuestionId", boilerQuestionOrId.id);
    boilerQuestion = BoilerQuestionSchema.parse(boilerQuestionOrId);
  }

  // now do some cool stuff

  const return_questions = [];
  const question_images =
    boilerQuestion.resources.length > 0 // in resources and not explanation.resources
      ? boilerQuestion.resources
          .filter((item) => item.type === "IMAGE" && item.questionId !== null) // all things related to question will be in base resource.
          .map((item) =>
            createMDImageFromURLAndAlt(item.data.url, item.data.altText)
          )
          .join("\n")
      : null;

  const question_video_resource = boilerQuestion.explanation.resources.find(
    (resource) => resource.type === "VIDEO"
  ); // finds first video (should only be one I hope. add validation checks for this)

  const question_explanation_url = question_video_resource
    ? question_video_resource?.data?.url
    : null;

  const question_text = (questionContext || "") + boilerQuestion.data.body;

  const question_topic_names = boilerQuestion.topics.map((topic) => topic.name);

  let question_type = null;
  // dumbass logic to check question type for transformation to quackprep.
  if (
    Array.isArray(boilerQuestion.data.solution) &&
    boilerQuestion.data.solution.length > 0 &&
    boilerQuestion.data.answerChoices.length > 0 &&
    boilerQuestion.type === "MULTIPLE_CHOICE"
  ) {
    question_type = "mcq";
  } else if (
    // they have shit setup so weird, bunch of cowboys ill tell you. - Hubert (Buster) Dunesmore.
    Array.isArray(boilerQuestion.data.solution) &&
    boilerQuestion.data.solution.length === 0 &&
    boilerQuestion.data.answerChoices.length === 0 &&
    boilerQuestion.type === "MULTIPLE_CHOICE"
  ) {
    question_type = "frq";
  } else if (
    boilerQuestion.type === "FREE_RESPONSE" ||
    boilerQuestion.type === "SHORT_ANSWER"
  ) {
    question_type = "frq";
  } else if (
    boilerQuestion.type === "PARENT" &&
    boilerQuestion.data.answerChoices.length === 0
  ) {
    console.log("Found PARENT question, splitting now");
    const context = question_text; // context for child question is parent question text
    const childQuestions = boilerQuestion.children;
    // these child questions should NOT have children of they own.
    for (let k = 0; k < childQuestions.length; k++) {
      // push data in from og question.
      childQuestions[k].explanation.resources.push(question_video_resource);
      childQuestions[k].topics = boilerQuestion.topics;
      //
      const result_child_question = JSONQuestionSchema.array().parse(
        await boilerQuestionToJsonQuestion(childQuestions[k], context) // call this function again, it should return the child question.
      );
      if (result_child_question.length !== 1) {
        throw new Error(
          "ChildQuestion.length !== 1. child question may have more children question or another issue occured."
        );
      } else {
        return_questions.push(result_child_question[0]);
      }
    } // TODO MAKE THESE QUESTIONS TOPIC & explanation_url SAME AS PARENT
    return return_questions; // cuz this question we are on will NOT be made into a question
  } else {
    throw new Error(`I have not forseen this question type ${boilerQuestion}`);
  }

  // all things relating to the choices for images etc will be in explanation.resources
  let choices = null;
  if (question_type === "frq") {
    const explanation_resources_images =
      boilerQuestion.explanation.resources.length > 0
        ? boilerQuestion.explanation.resources
            .filter((item) => item.type === "IMAGE")
            .map((item) =>
              createMDImageFromURLAndAlt(item.data.url, item.data.altText)
            )
            .join("\n")
        : null;
    choices = [
      {
        answer:
          (!Array.isArray(boilerQuestion.data.solution)
            ? boilerQuestion.data.solution
            : "") +
          (explanation_resources_images
            ? " " + explanation_resources_images
            : ""),
        is_correct: 1,
        type: question_type,
      },
    ];
  } else if (question_type === "mcq") {
    choices = boilerQuestion.data.answerChoices.map((choice) => {
      const curChoiceImages =
        boilerQuestion.explanation.resources.length > 0
          ? boilerQuestion.explanation.resources
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
        answer: choice.body + (curChoiceImages ? " " + curChoiceImages : ""),
        is_correct: boilerQuestion.data.solution.includes(choice.index) ? 1 : 0,
        type: question_type,
      };
    });
  } else {
    throw new Error("question type isnt frq or mcq somehow");
  }
  return_questions.push({
    question: question_text + (question_images ? " " + question_images : ""),
    explanation_url: question_explanation_url,
    topics: question_topic_names,
    choices: JSONChoiceSchema.array().parse(choices),
  });

  return JSONQuestionSchema.array().parse(return_questions);
}

/**
 * @param {String[]} boilerQuestionIds
 * @returns {import("../types.ts").JSONQuestion[]} questions with choices included.
 */
export async function boilerQuestionsToJsonQuestions(boilerQuestionIds) {
  let questions = [];
  for (let i = 0; i < boilerQuestionIds.length; i++) {
    // for all passed in questions
    const jsonQuestions = await boilerQuestionToJsonQuestion(
      boilerQuestionIds[i]
    );
    questions = [...questions, ...jsonQuestions];
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
