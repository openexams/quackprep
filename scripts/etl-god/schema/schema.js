import z from "zod";

export const BoilerResourcesSchema = z.array(
  z
    .object({
      type: z.enum(["IMAGE", "VIDEO", "PDF", "LOGO"]),
      data: z.object({
        url: z.string().optional(),
        altText: z.string().optional(),
        link: z.string().optional(),
      }),
      questionId: z.string().nullable(), // tied to question
      answerChoiceId: z.string().nullable(), // tied to some mcq answer
      explanationId: z.string().nullable(), // for free response only
    })
    .strip()
);

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
    resources: BoilerResourcesSchema,
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
    id: z.string(),
    number: z.number(),
    year: z.number().int().min(1900).max(new Date().getFullYear()),
    season: z.enum(["WINTER", "SPRING", "SUMMER", "FALL"]),
    stats: z.object({ questions: z.number().int() }),
    resources: BoilerResourcesSchema,
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
    type: z.enum(["MULTIPLE_CHOICE", "FREE_RESPONSE", "PARENT"]), //check for free response
    data: z.object({
      body: z.string(),
      solution: z.string().or(z.array(z.number().int())),
      answerChoices: z.array(
        z.object({ id: z.string(), index: z.number().int(), body: z.string() })
      ),
    }),

    topics: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    explanation: z.object({
      resources: BoilerResourcesSchema,
    }),
    resources: BoilerResourcesSchema,
    children: z.array(z.lazy(() => BoilerQuestionSchema)),
  })
  .strip(); // superRefine is cool like checking what i check on question.js

export const BoilerQuestionSubmissionSchema = z.object({
  questionId: z.string(),
  timeStarted: z.coerce.date(),
  timeEnded: z.coerce.date(),
  timeSpent: z.number().int().nonnegative(),
  timeSpentModal: z.number().int().nonnegative(),
  timeSpentVideo: z.number().int().nonnegative(),
  osFamily: z.string(),
  userSolution: z.array(z.number().int()),
  type: z.enum(["MULTIPLE_CHOICE", "FREE_RESPONSE"]),
});

// my JSON SCHEMA
export const JSONChoiceSchema = z.object({
  answer: z.string(),
  is_correct: z.number().int().max(1).min(0),
  type: z.enum(["mcq", "frq"]),
});

export const JSONQuestionSchema = z.object({
  question: z.string(),
  explanation_url: z.string().nullable(),
  topics: z.array(z.string()), // array of topic names
  choices: z.array(JSONChoiceSchema),
});
export const JSONGroupSchema = z.object({
  name: z.string(),
  type: z.number().int(),
  desc: z.string(),
  questionCount: z.number().int(),
  questions: z.array(JSONQuestionSchema).nullable(),
  pdfLink: z.string().nullable(),
});

export const JSONClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.number().int(),
  questionCount: z.number().int(),
  groups: z.array(JSONGroupSchema).nullable(),
});
