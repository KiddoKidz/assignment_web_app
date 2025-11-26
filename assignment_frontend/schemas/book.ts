import { z } from "zod";

export const BookSchema = z.object({
    id: z.number().int().optional(),
    title: z.string().min(1).max(255),
    category: z.string().max(100).optional(),
    publishing_year: z.number().int().min(1000).max(2100).optional(),
    author_id: z.number().int().positive(),
});

export type Book = z.infer<typeof BookSchema>;