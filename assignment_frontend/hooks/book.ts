'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookInputSchema, type BookInput } from '@/schemas/book';

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { deleteBook } from '@/services/book.service';
import { bookKeys } from '@/lib/queryKeys';

const useBookForm = (initialData?: Partial<BookInput>) => {
    return useForm<BookInput>({
        resolver: zodResolver(BookInputSchema),
        defaultValues: initialData ?? {},
    });
};

const useDeleteBook = (): UseMutationResult<void, unknown, number> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
        },
    });
};

export { useBookForm, useDeleteBook };