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
import { Calendar, Pen, Tag, Trash2, UserRoundPen } from 'lucide-react'
import { useDeleteBook } from '@/hooks/book'

import { bookKeys } from '@/lib/queryKeys'
import { getAllBooks } from '@/services/book.service'
import type { BooksPageResponse } from '@/schemas/book'
import { LoadingSkeleton } from '@/components/list/LoadingGrid'
import { ErrorState } from '@/components/list/ErrorState'
import { EmptyState } from '@/components/list/EmptyState'
import { Pagination } from '@/components/list/Pagination'
import { useEffect, Suspense } from 'react'


function BooksContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const page = Number(searchParams.get('page')) || 0

    const { data, isLoading, error } = useQuery<BooksPageResponse>({
        queryKey: bookKeys.all({ page, limit: 12 }),
        queryFn: () => getAllBooks(page, 12),
    })
    const { mutate, isPending, isSuccess: isDeleteSuccess } = useDeleteBook()

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success('Book deleted successfully')
        }
    }, [isDeleteSuccess, router])

    const goToPage = (page: number) => {
        router.push(`/books?page=${page}`)
    }

    const totalPages = data?.page.totalPages ?? 0

    let mainComponent = null

    if (isLoading) {
        mainComponent = <LoadingSkeleton numItems={12} />
    } else if (error) {
        mainComponent = <ErrorState message="Error fetching books" />
    } else if (!data?.content?.length) {
        mainComponent = <EmptyState title="No books found" description="Try creating one." />
    } else {
        mainComponent = (
            <>
                {data.content.map((book) => (
                    <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-all">
                        <CardHeader className="px-6">
                            <CardTitle className="leading-tight line-clamp-2">{book.title}</CardTitle>
                            <CardDescription>
                                <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" /><p>{book.publishingYear ?? '...'}</p>
                                </span>
                                <span className="flex items-center">
                                    <Tag className="h-4 w-4 mr-2" /><p>{book.category ?? '...'}</p>
                                </span>
                                <span className="flex items-center">
                                    <UserRoundPen className="h-4 w-4 mr-2" /><p>{book.author.name ?? '...'}</p>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6">
                            <div className="flex gap-2">
                                <Button asChild size="sm" className="flex-1">
                                    <Link href={`/books/${book.id}`}>
                                        <Pen className="h-4 w-4 mr-2" /> Edit
                                    </Link>
                                </Button>
                                <Button size="sm" variant="destructive" className="flex-1" disabled={isPending} onClick={() => mutate(book.id!)} >
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
                <h1 className="text-3xl font-bold tracking-tight">Books</h1>
                <Button asChild>
                    <Link href="/books/create">+ New Book</Link>
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

export default function BooksPage() {
    return (
        <Suspense fallback={<LoadingSkeleton numItems={12} />}>
            <BooksContent />
        </Suspense>
    )
}