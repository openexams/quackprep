import {
  getQuestionsByGroupId,
  upsertQuestion,
  getWhatGroupsQuestionisIn,
  setDeletedQuestionAndCascadeChoices,
} from "#models/question/index.js";
import { addManyChoicesToQuestion } from "#models/choice/index.js";
import sqlExe from "#db/dbFunctions.js";
import {
  sendOpenAiAssistantPromptAndRecieveResult,
  sendPromptAndRecieveJSONResult,
} from "#utils/openAi.js";
import {
  MAX_QUESTIONS_CONTEXT,
  QUACK_GEN_QUESTION_ASS_ID,
} from "../../../constants.js";
/**
 * Always mcq questions
 * @param {Integer} user_id add which user ai generated the question (does not rlly matter)
 * @param {String} likeQuestionText to feed to AI
 * @param {Number} likeQuestionId so that we can attach the AI question to the same groups as likeQuestion
 * @returns {Object} question object back to the user who generated it
 */
export async function generateQuestionLike(
  user_id,
  likeQuestionText,
  likeQuestionId
) {
  let question_added = null;
  dlog(`ai generating like q_id: ${likeQuestionId}`);
  // find the assistant I created
  try {
    /**@type {import("../../../shared-types/question.types.ts").GenQuestion} */
    const quackAssistResponseJSON =
      await sendOpenAiAssistantPromptAndRecieveResult(
        QUACK_GEN_QUESTION_ASS_ID,
        `create a question similar to: "${likeQuestionText}"\nin json format`,
        { retire_time: 5000, max_retires: 5 }
      );

    // make sure it has neccessary props to be of type GenQuestion
    quackAssistResponseJSON.options = quackAssistResponseJSON.options.map(
      (o) => ({ ...o, type: "mcq" })
    );

    // get what groups curQuestion has
    // for (let i = 0; i < quackAssistResponseJSON.options.length; i++) {
    //   const curOption = quackAssistResponseJSON.options[i];
    //   if (
    //     curOption.is_correct === true ||
    //     curOption.is_correct === "true" ||
    //     curOption.is_correct === 1
    //   ) {
    //     quackAssistResponseJSON.options.splice(i, 1);
    //     i--; // if current answer is true delete it just in case its correct. since o1 will generate answer better
    //   } else {
    //     quackAssistResponseJSON.options[i] = {
    //       ...curOption,
    //       type: "mcq",
    //       is_correct: false,
    //     };
    //   }
    // }
    // quackAssistResponseJSON.options.push({ use with generateCorrectAnswer
    //   text: correctAnswer,
    //   is_correct: true,
    //   type: "mcq",
    // });

    const groups_question_is_in = await getWhatGroupsQuestionisIn(
      likeQuestionId
    );

    question_added = await upsertQuestion(
      null,
      quackAssistResponseJSON.question,
      user_id,
      groups_question_is_in,
      true
    );

    if (!question_added?.id) {
      throw new Error("failed to add AI question, question not created");
    }
    const choices_added = await addManyChoicesToQuestion(
      question_added?.id,
      user_id,
      quackAssistResponseJSON.options
    );
    return { question: question_added, choices: choices_added };
  } catch (error) {
    if (question_added?.id) {
      // if we added a question & errored then->
      await setDeletedQuestionAndCascadeChoices(question_added?.id);
    }
    throw error;
  }
}

/**
 * Generates a question from a group (topic) of questions
 * @param {Integer} user_id add which user ai generated the question (does not rlly matter)
 * @param {Integer} group_id to find relevant questions
 * @returns {Object} question object back to the user who generated it
 */
export async function generateQuestionFromGroup(user_id, group_id) {
  // TO-DO: Generate context
  let questions = null;
  let question_added = null;
  let context = "Context:\n";
  try {
    // Fetch all pertinent questions
    questions = await getQuestionsByGroupId(group_id);

    // Shuffle the questions array
    // questions.sort(() => Math.random() - 0.5); no need to its shuffled on frontend. but thats a good way of shuffling

    // Build context string
    for (let i = 0; i < questions.length && i < MAX_QUESTIONS_CONTEXT; i++) {
      context += "Question " + i + questions[i].question + "\n\n";
    }

    const prompt =
      "Generate a question in JSON format that covers the same topic as the questions above";

    /**@type {import("../../../shared-types/question.types.ts").GenQuestion} */
    const quackAssistResponseJSON =
      await sendOpenAiAssistantPromptAndRecieveResult(
        QUACK_GEN_QUESTION_ASS_ID,
        context + prompt
      );

    quackAssistResponseJSON.options = quackAssistResponseJSON.options.map(
      (o) => ({ ...o, type: "mcq" })
    );

    question_added = await upsertQuestion(
      null,
      quackAssistResponseJSON.question,
      user_id,
      [group_id],
      true
    );

    if (!question_added?.id) {
      throw new Error(
        "failed to add AI question by multiple questions, question not created"
      );
    }

    const choices_added = await addManyChoicesToQuestion(
      question_added?.id,
      user_id,
      quackAssistResponseJSON.options
    );
    return { question: question_added, choices: choices_added };
  } catch (error) {
    if (question_added?.id) {
      // if we added a question & errored then->
      await setDeletedQuestionAndCascadeChoices(question_added?.id);
    }
    throw error;
  }
}

// DO NOT FUCKING RUN THIS!!
export async function deleteAllAIGeneratedQuestion() {
  await sqlExe.executeCommand(`UPDATE questions q
  LEFT JOIN choices c on c.question_id = q.id
  SET q.deleted=1, c.deleted=1 WHERE q.ai = 1`);
}

// /**
//  * Not used currently I would recommend checking correctness before using
//  * @param {import("../../../shared-types/question.types.ts").GenQuestion} quackAssistResponseJSON
//  * @returns {String}
//  */
// export async function generateCorrectAnswer(quackAssistResponseJSON) {
//   const correctAnswer = (
//     await sendPromptAndRecieveJSONResult(
//       `answer this: ${quackAssistResponseJSON.question}`,
//       {
//         name: "option_return",
//         schema: {
//           name: "option_return",
//           type: "object",
//           properties: {
//             explanation: {
//               type: "string",
//               description:
//                 "Explanation, written in md with LaTeX wrapped in $$",
//               minLength: 1,
//               maxLength: 1000,
//             },
//             answer: {
//               type: "string",
//               description:
//                 "The correct answer to the question in LaTeX, MUST wrap LaTeX in $$",
//               minLength: 1,
//               maxLength: 500,
//             },
//           },
//           required: ["answer", "explanation"],
//           additionalProperties: false,
//           // example: {
//           //   answer: "$$9$$",
//           //   explanation:
//           //     "The answer is derived by solving the equation $$3^{x} = 9$$, which simplifies to $$x = 2$$.",
//           // },
//           strict: true,
//         },
//       },
//       "gpt-4o", // buy o1 and switch to o1
//       `answer question with accuracy in this format: md with LaTeX wrapped in $$.
//       follow example answers:
//       ${quackAssistResponseJSON.options.map((o) => o.text).join("\n")}
//       ` // this makes sure they output same formatted answer
//     )
//   )?.answer;

//   if (!correctAnswer) {
//     throw new Error("Failed to get answer from sendPromptAndRecieveJSONResult");
//   }
//   return correctAnswer;
// }
