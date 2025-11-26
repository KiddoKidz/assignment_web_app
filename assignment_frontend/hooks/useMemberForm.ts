'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberSchema, type Member } from '@/schemas/member';

export const useMemberForm = (initialData?: Partial<Member>) => {
    return useForm<Member>({
        resolver: zodResolver(MemberSchema),
        defaultValues: initialData ?? {},
    });
};