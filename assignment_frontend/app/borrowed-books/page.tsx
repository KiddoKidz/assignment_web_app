'use client'

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
import { toast } from 'sonner'
import { CalendarArrowDown, CalendarArrowUp, ChevronDownIcon, IdCard, Pen, Trash2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { useDeleteBorrowedBook, useBorrowedBooks } from '@/hooks/borrowedBook'
import { useDebounce } from '@/hooks/use-debounce'

import { LoadingSkeleton } from '@/components/list/LoadingGrid'
import { ErrorState } from '@/components/list/ErrorState'
import { EmptyState } from '@/components/list/EmptyState'
import { Pagination } from '@/components/list/Pagination'
import { useEffect, useState, Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { parseDateString, formatDate } from '@/lib/utils'


function BorrowedBooksContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const page = parseInt(searchParams.get('page') || '0', 10)
    const urlSearch = searchParams.get('search') || ''
    const urlBorrowDate = searchParams.get('borrowDate') || ''
    const [searchBorrowDate, setSearchBorrowDate] = useState<Date | undefined>(undefined)
    const [searchInput, setSearchInput] = useState(urlSearch)
    const debouncedSearch = useDebounce(searchInput, 500)
    const borrowDateStr = searchBorrowDate ? formatDate(searchBorrowDate) : ''

    useEffect(() => {
        setSearchInput(urlSearch)
    }, [urlSearch])

    useEffect(() => {
        if (urlBorrowDate) {
            const date = parseDateString(urlBorrowDate)
            if (date && !isNaN(date.getTime())) {
                setSearchBorrowDate(date)
            } else {
                setSearchBorrowDate(undefined)
            }
        } else {
            setSearchBorrowDate(undefined)
        }
    }, [urlBorrowDate])

    useEffect(() => {
        if (debouncedSearch !== urlSearch) {
            const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''
            const borrowParam = urlBorrowDate ? `&borrowDate=${urlBorrowDate}` : ''
            router.push(`/borrowed-books?page=0${searchParam}${borrowParam}`)
        }
    }, [debouncedSearch, urlSearch, urlBorrowDate, router])


    const { data, isLoading, error } = useBorrowedBooks(page, debouncedSearch, borrowDateStr)
    const { mutate, isPending, isSuccess: isDeleteSuccess } = useDeleteBorrowedBook()

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success('Borrowed Book deleted successfully')
        }
    }, [isDeleteSuccess, router])

    const goToPage = (n: number) => {
        const searchParam = urlSearch ? `&search=${encodeURIComponent(urlSearch)}` : ''
        const borrowParam = urlBorrowDate ? `&borrowDate=${urlBorrowDate}` : ''
        router.push(`/borrowed-books?page=${n}${searchParam}${borrowParam}`)
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
            <div className="flex items-center gap-4 justify-between">
                <Input
                    id="search"
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className='flex-1'
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-72 justify-between font-normal"
                        >
                            {searchBorrowDate ? formatDate(searchBorrowDate) : 'Select borrow date'}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={searchBorrowDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                                setSearchBorrowDate(date)
                                const dateStr = date ? formatDate(date) : ''
                                const searchParam = urlSearch ? `&search=${encodeURIComponent(urlSearch)}` : ''
                                router.replace(`/borrowed-books?borrowDate=${dateStr}&page=0${searchParam}`)
                            }}
                        />
                    </PopoverContent>
                </Popover>
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

export default function BorrowedBooksPage() {
    return (
        <Suspense fallback={<LoadingSkeleton numItems={12} />}>
            <BorrowedBooksContent />
        </Suspense>
    )
}

