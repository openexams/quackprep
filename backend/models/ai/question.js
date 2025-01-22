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
import { MAX_QUESTIONS_CONTEXT } from "#config/constants.js";
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
        "asst_a168JvA9PlzK2WaKZ6oukDe4",
        `create a question like: "${likeQuestionText}"\nin json format`
      );

    const response = await sendPromptAndRecieveJSONResult(
      `answer this: ${quackAssistResponseJSON.question}`,
      {
        type: "object",
        properties: {
          option: {
            type: "string",
            description:
              "answer to the question in latex, MUST wrap latex in $$",
            minLength: 1,
            maxLength: 500,
          },
        },
        required: ["option"],
        additionalProperties: false,
        example: {
          option: "$$3^{x}$$",
        },
        strict: true,
      },
      "o1-preview",
      "Answer questions with accuracy"
    );
    // needed for sql db WHAT IF THEY BOTH GENERATE THE CORRECT RESPONSE?
    for (let i = 0; i < quackAssistResponseJSON.options.length; i++) {
      quackAssistResponseJSON.options[i] = {
        ...quackAssistResponseJSON.options[i],
        type: "mcq",
        is_correct: false,
      };
    }

    quackAssistResponseJSON.options.push({
      text: response.option,
      is_correct: true,
      type: "mcq",
    });

    // get what groups curQuestion has
    const object_w_groups = await getWhatGroupsQuestionisIn(likeQuestionId);
    const groups_question_is_in = [];
    for (let i = 0; i < object_w_groups.length; i++) {
      groups_question_is_in.push(object_w_groups[i].group_id);
    }

    const question_with_2 = await upsertQuestion(
      null,
      quackAssistResponseJSON.question,
      user_id,
      groups_question_is_in,
      true
    );
    question_added = question_with_2?.[0];

    if (!question_added?.id) {
      throw new Error("failed to add AI question, question not created");
      return;
    }

    const choices_added = await addManyChoicesToQuestion(
      question_added?.id,
      user_id,
      quackAssistResponseJSON.options
    );
    return { question: question_with_2, choices: choices_added };
  } catch (error) {
    if (question_added?.id) {
      // if we added a question & errored then->
      await setDeletedQuestionAndCascadeChoices(question_added?.id);
    }
    throw error;
  }
}

/**
 *
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
    questions.sort(() => Math.random() - 0.5);

    // Build context string
    for (let i = 0; i < questions.length && i < MAX_QUESTIONS_CONTEXT; i++) {
      context += "Question " + i + questions[i].question + "\n\n";
    }

    const prompt =
      "Generate a question in JSON format that covers the same topic as the questions above";

    /**@type {import("../../../shared-types/question.types.ts").GenQuestion} */
    const quackAssistResponseJSON =
      await sendOpenAiAssistantPromptAndRecieveResult(
        "asst_a168JvA9PlzK2WaKZ6oukDe4",
        context + prompt
      );

    for (let i = 0; i < quackAssistResponseJSON.options.length; i++) {
      quackAssistResponseJSON.options[i] = {
        ...quackAssistResponseJSON.options[i],
        type: "mcq",
      };
    }

    const question_with_2 = await upsertQuestion(
      null,
      quackAssistResponseJSON.question,
      user_id,
      [group_id],
      true
    );

    question_added = question_with_2?.[0];

    if (!question_added?.id) {
      throw new Error("failed to add AI question, question not created");
    }

    const choices_added = await addManyChoicesToQuestion(
      question_added?.id,
      user_id,
      quackAssistResponseJSON.options
    );
    return { question: question_with_2, choices: choices_added };
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
