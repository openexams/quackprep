import z from "zod";

export const BoilerResourcesSchema = z.array(
  z
    .object({
      type: z.enum(["IMAGE", "VIDEO", "PDF", "LOGO"]),
      data: z.object({
        key: z.string().optional(),
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
    questions: z.number(), // count of questions in class, can be used to verify we added everything.
    exams: z.number(), // same for exams
    topics: z.number(),
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

export const BoilerTopicSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    stats: z.object({ questions: z.number().int() }),
    questions: z.array(
      z.object({
        id: z.string(),
      })
    ),
  })
  .strip();

export const BoilerExamSchema = z.object({
  id: z.string(),
  stats: z.object({ questions: z.number().int() }),
  questions: z.array(
    z.object({
      id: z.string(),
    })
  ),
  number: z.number(),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  season: z.enum(["WINTER", "SPRING", "SUMMER", "FALL"]),
  resources: BoilerResourcesSchema,
});

export const BoilerQuestionSchema = z
  .object({
    id: z.string(),
    type: z.enum([
      "MULTIPLE_CHOICE",
      "FREE_RESPONSE",
      "PARENT",
      "SHORT_ANSWER",
    ]),
    data: z.object({
      body: z.string(),
      solution: z.string().or(z.array(z.number().int())).optional(),
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
    children: z.array(z.lazy(() => BoilerQuestionSchema)).optional(),
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
  type: z.enum(["MULTIPLE_CHOICE", "FREE_RESPONSE", "PARENT"]),
});

// MY JSON SCHEMA //
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
  type: z.enum(["exam", "topic"]),
  desc: z.string(),
  questions: z.array(JSONQuestionSchema).nullable(),
  pdfLink: z.string().nullable(),
  questionCount: z.number().int().optional(), // to track stats
});

export const JSONClassSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.enum([
    "CS",
    "MA",
    "ECO",
    "BIO",
    "CHEM",
    "PHY",
    "ENG",
    "STAT",
    "PSY",
    "Other", // TODO KEEP UP TO DATE WITH SQL DB I HAVE THESE HARDCODED IN LIKE 5 DIFF SPOTS
  ]),
  questionCount: z.number().int().optional(), // to track stats
  groups: z.array(JSONGroupSchema).nullable(),
});
