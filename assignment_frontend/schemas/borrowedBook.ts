import { z } from "zod";
import { PageInfo } from "./pageInfo";
import { BookResponseSchema } from "./book";
import { MemberSchema } from "./member";

export const BorrowedBookInputSchema = z.object({
    id: z.number().int().optional(),
    bookId: z.number().int().positive(),
    memberId: z.number().int().positive(),
    borrowDate: z.coerce.date(),
    returnDate: z.coerce.date().nullable().optional()
        .transform((val) => val === null ? undefined : val),
});

export type BorrowedBookInput = z.infer<typeof BorrowedBookInputSchema>;

export const BorrowedBookResponseSchema = z.object({
    id: z.number().int().positive(),
    book: BookResponseSchema,
    member: MemberSchema,
    borrowDate: z.coerce.date(),
    returnDate: z.coerce.date().nullable().optional()
        .transform((val) => val === null ? undefined : val),
})

export type BorrowedBookResponse = z.infer<typeof BorrowedBookResponseSchema>;

export interface BorrowedBooksPageResponse {
    content: BorrowedBookResponse[];
    page: PageInfo;
}
