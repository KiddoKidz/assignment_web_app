import { z } from "zod";
import { PageInfo } from "./pageInfo";


export const AuthorSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1).max(255),
});

export type Author = z.infer<typeof AuthorSchema>;

export interface AuthorsPageResponse {
    content: Author[];
    page: PageInfo;
}