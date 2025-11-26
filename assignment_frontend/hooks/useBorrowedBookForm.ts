import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { BorrowedBookSchema, type BorrowedBook } from '@/schemas/borrowedBook'

export const useBorrowedBookForm = (defaultValues?: Partial<BorrowedBook>) => {
    return useForm<BorrowedBook>({
        resolver: zodResolver(BorrowedBookSchema),
        defaultValues,
    })
}