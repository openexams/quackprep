import z from "zod";
export const myClassSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  category: z.number().int(),
  school_id: z.number().int(),
  created_by: z.number().int(),
});
