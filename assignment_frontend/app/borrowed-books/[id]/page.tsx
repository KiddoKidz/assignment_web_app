'use client'

import { useBorrowedBookForm } from '@/hooks/borrowedBook'
import { getBorrowedBookById, updateBorrowedBook } from '@/services/borrowedBook.service'
import type { BorrowedBookInput } from '@/schemas/borrowedBook'

import { useParams, useRouter } from 'next/navigation'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { borrowedBookKeys } from '@/lib/queryKeys'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,

} from '@/components/ui/card'

import { toast } from 'sonner'
import { getAllMembers } from '@/services/member.service'
import type { MembersPageResponse } from '@/schemas/member'
import { Controller } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BooksPageResponse } from '@/schemas/book'
import { getAllBooks } from '@/services/book.service'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { formatDate, parseDateString } from '@/lib/utils'

export default function UpdateBorrowedBookPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const borrowedBookId = Number(id)

    const queryClient = useQueryClient()

    const form = useBorrowedBookForm()

    const {
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset
    } = form

    const { data: borrowedBook } = useQuery({
        queryKey: borrowedBookKeys.details(borrowedBookId),
        queryFn: () => getBorrowedBookById(borrowedBookId),
    })

    useEffect(() => {
        if (borrowedBook) {
            reset({
                bookId: borrowedBook.book.id,
                memberId: borrowedBook.member.id,
                borrowDate: formatDate(borrowedBook.borrowDate),
                returnDate: borrowedBook.returnDate ? formatDate(borrowedBook.returnDate) : undefined,
            })
        }
    }, [borrowedBook, reset])


    const updateMutation = useMutation({
        mutationFn: (data: BorrowedBookInput) => updateBorrowedBook(borrowedBookId, data),
        onSuccess: () => {
            toast.success("BorrowedBook updated successfully")
            queryClient.invalidateQueries({ queryKey: borrowedBookKeys.lists() })
            router.push("/borrowed-books")
        },
        onError: (error) => {
            console.error('Update mutation error:', error);
            toast.error("Failed to update borrowedBook")
        },
    })

    const onSubmit = (data: BorrowedBookInput) => {
        updateMutation.mutate(data)
    }

    const { data: membersData, fetchNextPage: fetchNextPageMember, hasNextPage: hasNextPageMember, isFetchingNextPage: isFetchingNextPageMember } = useInfiniteQuery<MembersPageResponse>({
        initialPageParam: 0,
        queryKey: ['members', { borrowedBookId }],
        queryFn: ({ pageParam }) => getAllMembers(pageParam as number),
        getNextPageParam: (lastPage: MembersPageResponse) => {
            const nextPage = lastPage.page.number + 1;
            return nextPage < lastPage.page.totalPages ? nextPage : undefined;
        },
    })

    const { data: booksData, fetchNextPage: fetchNextPageBook, hasNextPage: hasNextPageBook, isFetchingNextPage: isFetchingNextPageBook } = useInfiniteQuery<BooksPageResponse>({
        initialPageParam: 0,
        queryKey: ['books', { borrowedBookId }],
        queryFn: ({ pageParam }) => getAllBooks(pageParam as number),
        getNextPageParam: (lastPage: BooksPageResponse) => {
            const nextPage = lastPage.page.number + 1;
            return nextPage < lastPage.page.totalPages ? nextPage : undefined;
        },
    })

    const allMembers = useMemo(() => {
        const flatMembers = membersData?.pages?.flatMap((page) => page.content) ?? [];
        const currentMember = borrowedBook?.member;
        if (currentMember && !flatMembers.some((member) => member.id === currentMember.id)) {
            return [currentMember, ...flatMembers];
        }
        return flatMembers;
    }, [membersData, borrowedBook?.member]);

    const allBooks = useMemo(() => {
        const flatBooks = booksData?.pages?.flatMap((page) => page.content) ?? [];
        const currentBook = borrowedBook?.book;
        if (currentBook && !flatBooks.some((book) => book.id === currentBook.id)) {
            return [currentBook, ...flatBooks];
        }
        return flatBooks;
    }, [booksData, borrowedBook?.book]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold tracking-tight">Update Borrowed Book</h1>
            <Card className="w-full">
                <CardContent className="space-y-6">
                    <form id="borrowedBook-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="memberId">Member</Label>
                            <Controller
                                name="memberId"
                                control={form.control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => value && field.onChange(Number(value))}
                                        value={String(field.value || '')}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allMembers.map((member) => (
                                                <SelectItem key={member.id} value={String(member.id)}>
                                                    {member.name}
                                                </SelectItem>
                                            ))}
                                            {hasNextPageMember && (
                                                <SelectItem
                                                    value="load_more"
                                                    onMouseEnter={() => fetchNextPageMember()}
                                                    disabled={isFetchingNextPageMember}
                                                >
                                                    {isFetchingNextPageMember ? "Loading..." : "Load more..."}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.bookId && (
                                <p className="text-sm text-destructive">{errors.bookId?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bookId">Book</Label>
                            <Controller
                                name="bookId"
                                control={form.control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => value && field.onChange(Number(value))}
                                        value={String(field.value || '')}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select book" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allBooks.map((book) => (
                                                <SelectItem key={book.id} value={String(book.id)}>
                                                    {book.title}
                                                </SelectItem>
                                            ))}
                                            {hasNextPageBook && (
                                                <SelectItem
                                                    value="load_more"
                                                    onMouseEnter={() => fetchNextPageBook()}
                                                    disabled={isFetchingNextPageBook}
                                                >
                                                    {isFetchingNextPageBook ? "Loading..." : "Load more..."}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.bookId && (
                                <p className="text-sm text-destructive">{errors.bookId?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="borrowDate">Borrow Date</Label>
                            <Controller
                                name="borrowDate"
                                control={form.control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {field.value || "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0 bg-white shadow-md rounded-md" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? parseDateString(field.value) : undefined}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    field.onChange(date ? formatDate(date) : '')
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.borrowDate && (
                                <p className="text-sm text-destructive">{errors.borrowDate?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="returnDate">Return Date</Label>
                            <Controller
                                name="returnDate"
                                control={form.control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {field.value || "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0 bg-white shadow-md rounded-md" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? parseDateString(field.value) : undefined}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    field.onChange(date ? formatDate(date) : '')
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            {errors.returnDate && (
                                <p className="text-sm text-destructive">{errors.returnDate?.message}</p>
                            )}
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/borrowed-books")}
                        disabled={isSubmitting || updateMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="borrowedBook-form"
                        disabled={!isValid || isSubmitting || updateMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting || updateMutation.isPending ? "Creating..." : "Update Borrowed Book"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
