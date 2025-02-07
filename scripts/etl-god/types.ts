import { z } from "zod";
import {
  BoilerClassSchema,
  BoilerExamSchema,
  BoilerTopicSchema,
  BoilerQuestionSchema,
  JSONClassSchema,
  JSONGroupSchema,
  JSONQuestionSchema,
  JSONChoiceSchema,
} from "./schema/schema.js";

export type BoilerClass = z.infer<typeof BoilerClassSchema>;
export type BoilerExam = z.infer<typeof BoilerExamSchema>;
export type BoilerTopic = z.infer<typeof BoilerTopicSchema>;
export type BoilerQuestion = z.infer<typeof BoilerQuestionSchema>;
export type JSONClass = z.infer<typeof JSONClassSchema>;
export type JSONGroup = z.infer<typeof JSONGroupSchema>;
export type JSONQuestion = z.infer<typeof JSONQuestionSchema>;
export type JSONChoice = z.infer<typeof JSONChoiceSchema>;
