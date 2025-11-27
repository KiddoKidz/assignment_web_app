'use client'

import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthorSchema, type Author } from '@/schemas/author';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { deleteAuthor } from '@/services/author.service';
import { authorKeys } from '@/lib/queryKeys';

const useAuthorForm = (initialData?: Partial<Author>): UseFormReturn<Author> => {
    return useForm<Author>({
        resolver: zodResolver(AuthorSchema),
        defaultValues: initialData ?? {},
    });
};

const useDeleteAuthor = (): UseMutationResult<void, unknown, number> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAuthor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authorKeys.lists() });
        },
    });
};

export { useAuthorForm, useDeleteAuthor };