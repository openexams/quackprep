import { myQuestionSchema, questionPostSelectSchema } from "./schema/index.js";
import { z } from "zod";

export type Question = z.infer<typeof myQuestionSchema>;
export type QuestionPostSelect = z.infer<typeof questionPostSelectSchema>;
