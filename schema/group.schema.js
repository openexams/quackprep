import z from "zod";
export const myGroupSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  class_id: z.number().int(),
  type: z.number().int(),
  desc: z.string(),
  created_by: z.number().int(),
});
