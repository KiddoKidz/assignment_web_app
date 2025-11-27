'use client'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { BorrowedBookInputSchema, type BorrowedBookInput } from '@/schemas/borrowedBook'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { deleteBorrowedBook } from '@/services/borrowedBook.service'
import { borrowedBookKeys } from '@/lib/queryKeys'
const useBorrowedBookForm = (defaultValues?: Partial<BorrowedBookInput>) => {
    return useForm<BorrowedBookInput>({
        resolver: zodResolver(BorrowedBookInputSchema),
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

export { useBorrowedBookForm, useDeleteBorrowedBook }