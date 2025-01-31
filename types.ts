import { questionSchema } from "./schema/question.schema.js";
import { z } from "zod";

export type Question = z.infer<typeof questionSchema>;
