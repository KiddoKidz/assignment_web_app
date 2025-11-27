import { z } from "zod";
import { PageInfo } from "./pageInfo";
import { AuthorSchema } from "./author";

export const BookInputSchema = z.object({
    id: z.number().int().optional(),
    title: z.string().min(1).max(255),
    category: z.string().max(100).optional(),
    publishingYear: z.number().int().optional(),
    authorId: z.number().int().positive(),
});

export type BookInput = z.infer<typeof BookInputSchema>;

export const BookResponseSchema = z.object({
    id: z.number().int().positive(),
    title: z.string().min(1).max(255),
    category: z.string().max(100).optional(),
    publishingYear: z.number().int().optional(),
    author: AuthorSchema,
});

export type BookResponse = z.infer<typeof BookResponseSchema>;

export interface BooksPageResponse {
    content: BookResponse[];
    page: PageInfo;
}