'use client'

import { useForm, type Resolver } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { BorrowedBookInputSchema, type BorrowedBookInput, type BorrowedBooksPageResponse } from '@/schemas/borrowedBook'

import { useMutation, useQuery, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { deleteBorrowedBook, getAllBorrowedBooks } from '@/services/borrowedBook.service'
import { borrowedBookKeys } from '@/lib/queryKeys'
const useBorrowedBookForm = (defaultValues?: Partial<BorrowedBookInput>) => {
    return useForm<BorrowedBookInput>({
        resolver: zodResolver(BorrowedBookInputSchema) as Resolver<BorrowedBookInput>,
        defaultValues,
    })
}

const useDeleteBorrowedBook = (): UseMutationResult<void, unknown, number> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteBorrowedBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: borrowedBookKeys.lists() })
        },
    })
}

const useBorrowedBooks = (page: number, search?: string, borrowDate?: string) => {
    return useQuery<BorrowedBooksPageResponse>({
        queryKey: borrowedBookKeys.list({ page, limit: 10, search, borrowDate }),
        queryFn: () => getAllBorrowedBooks(page, 10, search, borrowDate),
    })
}

export { useBorrowedBookForm, useDeleteBorrowedBook, useBorrowedBooks }