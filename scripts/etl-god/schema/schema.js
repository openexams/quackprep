import z from "zod";

const BoilerStatsSchema = z
  .object({
    count: z.number(),
    timeSpent: z.string(),
    timeSpentVideo: z.string(),
    submissions: z.number(),
    submissionsCorrect: z.number(),
    questions: z.number(), // count of questions in class, can be used to verify we added everything.
    exams: z.number(), // same for exams
    topics: z.number(),
    accuracy: z.number(),
    difficulty: z.number(),
  })
  .strip();

const BoilerCourseSchema = z
  .object({
    id: z.string(),
    abbreviation: z.string(),
    number: z.number(),
    name: z.string(),
    subject: z.any(),
    color: z.any(),
    disclaimer: z.any(),
    studyModes: z.any(),
    flags: z.any(),
    stats: BoilerStatsSchema,
    resources: z.any(),
  })
  .strip();

export const BoilerClassSchema = z
  .object({
    subject: z.string(),
    courses: z.array(BoilerCourseSchema),
  })
  .strip(); // use clas shema to create name

export const BoilerExamSchema = z
  .object({
    // https://api.boilerexams.com/courses/MA16200/exams
    id: z.string(),
    number: z.number(),
    year: z.number().int().min(1900).max(new Date().getFullYear()),
    season: z.enum(["WINTER", "SPRING", "SUMMER", "FALL"]),
    stats: z.object({ questions: z.number().int() }),
    resources: z.array(
      z.object({
        type: z.string(),
        data: z.object({
          link: z.string(),
        }),
      })
    ),
    questions: z.array(
      z.object({
        id: z.string(),
      })
    ),
  })
  .strip();

export const BoilerQuestionSchema = z
  .object({
    id: z.string(),
    type: z.enum(["MULTIPLE_CHOICE", "FREE_RESPONSE"]), //check for free response
    data: z.object({ body: z.string(), solution: z.number().int() }),
    answerChoices: z.array(
      z.object({ id: z.string(), index: z.number().int(), body: z.string() })
    ),
    topics: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    explanation: z.object({
      resouces: z.array(
        // explanation for correct answer choice
        z.object({
          type: z.enum(["IMAGE", "VIDEO"]),
          data: z.object({ url: z.string() }),
          questionId: z.string().nullable(), // tied to question
          answerChoiceId: z.string().nullable(), // tied to some answer
          explanationId: z.string().nullable(), // tied to correct answer
        })
      ),
    }),
  })
  .strip();

export const JSONQuestionSchema = z.object({
  question: z.string(),
  explanation_url: z.string(),
  topics: z.array(z.string()),
});
export const JSONGroupSchema = z.object({
  name: z.string(),
  type: z.number().int(),
  desc: z.string(),
  questionCount: z.number().int(),
  questions: z.array(JSONQuestionSchema).nullable(),
  pdfLink: z.string(),
});

export const JSONChoiceSchema = z.object({
  answer: z.string(),
  is_correct: z.number().int().max(1).min(0),
  type: z.enum(["mcq", "frq"]),
});
export const JSONClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.number().int(),
  questionCount: z.number().int(),
  groups: z.array(JSONGroupSchema).nullable(),
});
