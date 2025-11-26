'use client'

import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthorSchema, type Author } from '@/schemas/author';

export const useAuthorForm = (initialData?: Partial<Author>): UseFormReturn<Author> => {
    return useForm<Author>({
        resolver: zodResolver(AuthorSchema),
        defaultValues: initialData ?? {},
    });
};