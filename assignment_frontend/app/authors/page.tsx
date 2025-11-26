'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

interface Author {
    id: number
    name: string
}

interface PageInfo {
    size: number
    number: number
    totalElements: number
    totalPages: number
}

interface ApiResponse {
    content: Author[]
    page: PageInfo
}

async function fetchAuthors(page: number): Promise<ApiResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        size: '10',
    })
    const API_BASE = typeof window !== 'undefined' ? 'http://localhost:8080' : '/api'
    const res = await fetch(`${API_BASE}/api/authors?${params}`)
    if (!res.ok) {
        throw new Error('Failed to fetch authors')
    }
    return res.json()
}

export default function AuthorsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [data, setData] = useState<ApiResponse>({
        content: [],
        page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
    })
    const [currentPage, setCurrentPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Sync currentPage with URL params
    useEffect(() => {
        const page = Number(searchParams.get('page')) || 0
        setCurrentPage(page)
    }, [searchParams])

    // Fetch data when currentPage changes
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError(null)
            try {
                const fetchedData = await fetchAuthors(currentPage)
                setData(fetchedData)
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message ?? 'Failed to load authors' : 'Failed to load authors')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [currentPage])

    const goToPage = (page: number) => {
        router.push(`/authors?page=${page}`)
    }

    const totalPages = data.page.totalPages

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Authors</h1>
                <Button asChild>
                    <Link href="/authors/create">+ New Author</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array.from({ length: 9 }, (_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="p-6 pb-4 space-y-2">
                                <Skeleton className="h-8 w-4/5" />
                                <Skeleton className="h-4 w-3/5" />
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="flex gap-2">
                                    <Skeleton className="h-10 flex-1" />
                                    <Skeleton className="h-10 w-20" />
                                    <Skeleton className="h-10 w-20" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : error ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 p-12 text-center">
                        <h3 className="text-lg font-semibold text-destructive">Error</h3>
                        <p className="text-muted-foreground max-w-md">{error}</p>
                    </div>
                ) : data.content.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 p-12 text-center">
                        <h3 className="text-lg font-semibold text-muted-foreground">No authors found</h3>
                        <p className="text-sm text-muted-foreground">
                            There are no authors in the library yet.
                        </p>
                    </div>
                ) : (
                    data.content.map((author) => (
                        <Card key={author.id} className="overflow-hidden hover:shadow-lg transition-all">
                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="leading-tight line-clamp-2">{author.name}</CardTitle>
                                <CardDescription className="sr-only">
                                    Author ID: {author.id}
                                </CardDescription>
                                <Badge variant="secondary" className="mt-2">
                                    ID {author.id}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className="flex gap-2">
                                    <Button asChild size="sm" className="flex-1">
                                        <Link href={`/authors/${author.id}`}>View</Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline" className="w-20">
                                        <Link href={`/authors/${author.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button asChild size="sm" variant="destructive" className="w-20">
                                        <Link href={`/authors/${author.id}`}>Delete</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <div className="flex items-baseline gap-1 text-sm font-medium">
                        Page
                        <span className="font-mono text-base">{currentPage + 1}</span>
                        of
                        <span className="font-mono text-base">{totalPages}</span>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage + 1 === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}