import {
  questionSelectSchema,
  questionPostSelectSchema,
  groupSelectSchema,
} from "./schema/index.js";
import { z } from "zod";

export type Group = z.infer<typeof groupSelectSchema>;

export type Question = z.infer<typeof questionSelectSchema>;
export type QuestionPostSelect = z.infer<typeof questionPostSelectSchema>;
