import { z } from "zod";

export const AuthorSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1).max(255),
});

export type Author = z.infer<typeof AuthorSchema>;