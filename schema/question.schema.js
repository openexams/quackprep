import { z } from "zod";

export const myQuestionSchema = z.object({
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

export const questionPostSchema = z.object({
  id: z.number().int().positive(),
  question_id: z.number().int().positive(),
  text: z.string().min(1).max(2048),
  post_id: z.number().int().positive().nullable().optional(),
  deleted: z.number().int().min(0).max(1),
  created_by: z.number().int().positive(),
  updated_at: z.date(),
  created_at: z.date().optional(),
});

export const questionPostSelectSchema = questionPostSchema.extend({
  username: z.string().min(1).max(255),
  icon: z.string().max(2048).nullable(),
});
