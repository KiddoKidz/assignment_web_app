'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CalendarArrowDown, CalendarArrowUp, IdCard, Pen, Trash2 } from 'lucide-react'
import { useDeleteBorrowedBook } from '@/hooks/borrowedBook'

import { borrowedBookKeys } from '@/lib/queryKeys'
import { getAllBorrowedBooks } from '@/services/borrowedBook.service'
import type { BorrowedBooksPageResponse } from '@/schemas/borrowedBook'
import { LoadingSkeleton } from '@/components/list/LoadingGrid'
import { ErrorState } from '@/components/list/ErrorState'
import { EmptyState } from '@/components/list/EmptyState'
import { Pagination } from '@/components/list/Pagination'
import { useEffect } from 'react'


export default function BorrowedBooksPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const page = Number(searchParams.get('page')) || 0

    const { data, isLoading, error } = useQuery<BorrowedBooksPageResponse>({
        queryKey: borrowedBookKeys.all({ page, limit: 12 }),
        queryFn: () => getAllBorrowedBooks(page, 10),
    })
    const { mutate, isPending, isSuccess: isDeleteSuccess } = useDeleteBorrowedBook()

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success('Borrowed Book deleted successfully')
        }
    }, [isDeleteSuccess, router])

    const goToPage = (page: number) => {
        router.push(`/borrowedBooks?page=${page}`)
    }

    const totalPages = data?.page.totalPages ?? 0

    let mainComponent = null

    if (isLoading) {
        mainComponent = <LoadingSkeleton numItems={9} />
    } else if (error) {
        mainComponent = <ErrorState message="Error fetching borrowed books" />
    } else if (!data?.content?.length) {
        mainComponent = <EmptyState title="No borrowed books found" description="Try creating one." />
    } else {
        mainComponent = (
            <>
                {data.content.map((borrowedBook) => (
                    <Card key={borrowedBook.id} className="overflow-hidden hover:shadow-lg transition-all">
                        <CardHeader className="px-6">
                            <CardTitle className="leading-tight line-clamp-2">{borrowedBook.book.title}</CardTitle>
                            <CardDescription>
                                <span className="flex items-center">
                                    <IdCard className="h-4 w-4 mr-2" /><p>{borrowedBook.member.name ?? '...'}</p>
                                </span>
                                <span className="flex items-center">
                                    <CalendarArrowUp className="h-4 w-4 mr-2" /><p>{borrowedBook.borrowDate.toLocaleDateString() ?? '...'}</p>
                                </span>
                                <span className="flex items-center">
                                    <CalendarArrowDown className="h-4 w-4 mr-2" /><p>{borrowedBook.returnDate?.toLocaleDateString() ?? '...'}</p>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6">
                            <div className="flex gap-2">
                                <Button asChild size="sm" className="flex-1">
                                    <Link href={`/borrowed-books/${borrowedBook.id}`}>
                                        <Pen className="h-4 w-4 mr-2" /> Edit
                                    </Link>
                                </Button>
                                <Button size="sm" variant="destructive" className="flex-1" disabled={isPending} onClick={() => mutate(borrowedBook.id!)} >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Borrowed Books</h1>
                <Button asChild>
                    <Link href="/borrowed-books/create">+ New Borrowed Book</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mainComponent}
            </div>
            {!isLoading && totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                />
            )}
        </div>
    )
}