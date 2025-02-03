import { z } from "zod";

export const questionSchema = z.object({
  question: z.string().min(1).max(2048),
  group_id: z.string().transform((val) => val.split(",")), // if i parse to int frontend somehow reverts to string
  id: z.number().int().positive(),
  upvotes: z.number().int(),
  explanation_url: z.string().max(4096).url().nullable(),
  group_name: z.string().transform((val) => val.split(",")),
  type_name: z.string().transform((val) => val.split(",")),
  class_id: z.number().int().positive(),
  class_category: z.number().int().positive(),
  school_id: z.number().int().positive(),
  ai: z.number().int().min(0).max(1),
});
