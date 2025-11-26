'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookSchema, type Book } from '@/schemas/book';

export const useBookForm = (initialData?: Partial<Book>) => {
    return useForm<Book>({
        resolver: zodResolver(BookSchema),
        defaultValues: initialData ?? {},
    });

};