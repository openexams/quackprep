import z from "zod";

export const classVotePostSchema = z.object({
  class_id: z.number().positive().int(),
  vote: z.number().int().min(0).max(1),
});
