import { z } from "zod";

export const MemberSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1).max(255),
    email: z.email().optional(),
    phone: z.string().max(20).optional(),
});

export type Member = z.infer<typeof MemberSchema>;