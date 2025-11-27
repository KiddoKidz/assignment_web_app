'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MemberSchema, type Member } from '@/schemas/member';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { deleteMember } from '@/services/member.service';
import { memberKeys } from '@/lib/queryKeys';

const useMemberForm = (initialData?: Partial<Member>) => {
    return useForm<Member>({
        resolver: zodResolver(MemberSchema),
        defaultValues: initialData ?? {},
    });
};

const useDeleteMember = (): UseMutationResult<void, unknown, number> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
        },
    });
};

export { useMemberForm, useDeleteMember };