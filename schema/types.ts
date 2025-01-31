import { questionSchema } from "./question.schema.js";
import { z } from "zod";

export type Question = z.infer<typeof questionSchema>;
