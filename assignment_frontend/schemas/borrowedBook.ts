import { z } from "zod";

export const BorrowedBookSchema = z.object({
    id: z.number().int().optional(),
    book_id: z.number().int().positive(),
    member_id: z.number().int().positive(),
    borrow_date: z.coerce.date<Date>(),
    return_date: z.coerce.date<Date>().optional(),
});

export type BorrowedBook = z.infer<typeof BorrowedBookSchema>;