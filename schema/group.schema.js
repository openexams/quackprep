import z from "zod";
export const groupSelectSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  class_id: z.number().int().positive(),
  type: z.string(),
  desc: z.string(),
  created_by: z.number().int().positive(),
  class_category: z.number().int().positive(),
  school_id: z.number().int().positive(),
});
