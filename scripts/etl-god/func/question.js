import { fetchWithExponetialBackoff } from "../axios.j";
import {
  BoilerQuestionSchema,
  JSONChoiceSchema,
  JSONQuestionSchema,
} from "../schema/schema.js";

/**
 * TODO FINISH!!
 * @param {String[]} boilerQuestionIds
 * @returns {import("../types").JSONQuestion} questions with choices included.
 */
export async function boilerQuestionsToJsonQuestions(boilerQuestionIds) {
  const questions = [];
  for (let i = 0; i < boilerQuestionIds.length; i++) {
    const result = await fetchWithExponetialBackoff(
      `/questions/${boilerQuestionIds[i]}`
    );
    const validated = BoilerQuestionSchema.parse(result);
    const question_text = validated.data.body;
    const question_topics = validated.topics.map((topic) => topic.name);
    const question_type = // technically choice type
      validated.type === "MULTIPLE_CHOICE"
        ? "mcq"
        : validated.type === "FREE_RESPONSE"
        ? "frq"
        : "FATAL ERROR FATAL ERROR WAAP WAAP";
    let choices = null;
    if (question_type === "frq") {
      choices = [
        {
          answer: validated.data.solution,
          is_correct: 1,
          type: question_type,
        },
      ];
    } else {
      const correct_indexs = validated.data.solution;
      choices = validated.answerChoices.map((choice) => ({
        answer: choice.body,
        is_correct: correct_indexs.includes(choice.index) ? 1 : 0,
        type: question_type,
      }));
    }

    questions.push(
      JSONQuestionSchema.parse({
        question: question_text,
        explanation_url: undefined,
        topics: question_topics,
        choices: JSONChoiceSchema.array().parse(choices),
      })
    );

    // custom logic here think more about
    // for example image can be for question or for choice.
    // frq vs mcq
  }
  return JSONQuestionSchema.array().parse(questions);
}
