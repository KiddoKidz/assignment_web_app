'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Pen, Trash2 } from 'lucide-react'
import { useDeleteAuthor } from '@/hooks/author'

import { authorKeys } from '@/lib/queryKeys'
import { getAllAuthors } from '@/services/author.service'
import type { AuthorsPageResponse } from '@/schemas/author'
import { LoadingSkeleton } from '@/components/list/LoadingGrid'
import { ErrorState } from '@/components/list/ErrorState'
import { EmptyState } from '@/components/list/EmptyState'
import { Pagination } from '@/components/list/Pagination'
import { useEffect } from 'react'


export default function AuthorsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const page = Number(searchParams.get('page')) || 0

    const { data, isLoading, error } = useQuery<AuthorsPageResponse>({
        queryKey: authorKeys.all({ page, limit: 12 }),
        queryFn: () => getAllAuthors(page, 12),
    })
    const { mutate, isPending, isSuccess: isDeleteSuccess } = useDeleteAuthor()

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success('Author deleted successfully')
        }
    }, [isDeleteSuccess, router])

    const goToPage = (page: number) => {
        router.push(`/authors?page=${page}`)
    }

    const totalPages = data?.page.totalPages ?? 0

    let mainComponent = null

    if (isLoading) {
        mainComponent = <LoadingSkeleton numItems={12} />
    } else if (error) {
        mainComponent = <ErrorState message="Error fetching authors" />
    } else if (!data?.content?.length) {
        mainComponent = <EmptyState title="No authors found" description="Try creating one." />
    } else {
        mainComponent = (
            <>
                {data.content.map((author) => (
                    <Card key={author.id} className="overflow-hidden hover:shadow-lg transition-all">
                        <CardHeader className="px-6">
                            <CardTitle className="leading-tight line-clamp-2">{author.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6">
                            <div className="flex gap-2">
                                <Button asChild size="sm" className="flex-1">
                                    <Link href={`/authors/${author.id}`}>
                                        <Pen className="h-4 w-4 mr-2" /> Edit
                                    </Link>
                                </Button>
                                <Button size="sm" variant="destructive" className="flex-1" disabled={isPending} onClick={() => mutate(author.id!)} >
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
                <h1 className="text-3xl font-bold tracking-tight">Authors</h1>
                <Button asChild>
                    <Link href="/authors/create">+ New Author</Link>
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