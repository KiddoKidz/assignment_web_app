'use client'

import { useBookForm } from '@/hooks/book'
import { getBookById, updateBook } from '@/services/book.service'
import { BookResponse, type BookInput } from '@/schemas/book'

import { useParams, useRouter } from 'next/navigation'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookKeys } from '@/lib/queryKeys'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,

} from '@/components/ui/card'

import { toast } from 'sonner'
import { getAllAuthors } from '@/services/author.service'
import type { AuthorsPageResponse } from '@/schemas/author'
import { Controller } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useMemo } from 'react'

export default function UpdateBookPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const bookId = Number(id)

    const queryClient = useQueryClient()

    const form = useBookForm()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset,
    } = form

    const { data: book } = useQuery<BookResponse>({
        queryKey: bookKeys.details(bookId),
        queryFn: () => getBookById(bookId),
    })

    useEffect(() => {
        if (book) {
            reset({
                title: book.title,
                category: book.category,
                publishingYear: book.publishingYear,
                authorId: Number(book.author.id)
            })
        }
    }, [book, reset])

    const updateMutation = useMutation({
        mutationFn: (data: BookInput) => updateBook(bookId, data),
        onSuccess: () => {
            toast.success("Book updated successfully")
            queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
            router.push("/books")
        },
        onError: () => {
            toast.error("Failed to update book")
        },
    })

    const onSubmit = (data: BookInput) => {
        updateMutation.mutate(data)
    }

    const { data: authorsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<AuthorsPageResponse>({
        initialPageParam: 0,
        queryKey: ['authors', { bookId }],
        queryFn: ({ pageParam }) => getAllAuthors(pageParam as number),
        getNextPageParam: (lastPage: AuthorsPageResponse) => {
            const nextPage = lastPage.page.number + 1;
            return nextPage < lastPage.page.totalPages ? nextPage : undefined;
        },
    })

    const allAuthors = useMemo(() => {
        const flatAuthors = authorsData?.pages?.flatMap((page) => page.content) ?? [];
        const currentAuthor = book?.author;
        if (currentAuthor && !flatAuthors.some((author) => author.id === currentAuthor.id)) {
            return [currentAuthor, ...flatAuthors];
        }
        return flatAuthors;
    }, [authorsData, book?.author]);


    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold tracking-tight">Update Book</h1>
            <Card className="w-full">
                <CardContent className="space-y-6">
                    <form id="book-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter book title"
                                className={
                                    errors.title
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...register("title")}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="publishingYear">Publishing Year</Label>
                            <Input
                                id="publishingYear"
                                type='number'
                                placeholder="Enter publishing year"
                                className={
                                    errors.publishingYear
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...register("publishingYear", { valueAsNumber: true })}
                            />
                            {errors.publishingYear && (
                                <p className="text-sm text-destructive">{errors.publishingYear?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="Enter book category"
                                className={
                                    errors.category
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...register("category")}
                            />
                            {errors.category && (
                                <p className="text-sm text-destructive">{errors.category?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="authorId">Author</Label>
                            <Controller
                                name="authorId"
                                control={form.control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => value && field.onChange(Number(value))}
                                        value={field.value !== null ? String(field.value) : ""}
                                    >
                                        <SelectTrigger className={`w-full ${errors.authorId ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                                            <SelectValue placeholder="Select author" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allAuthors.map((author) => (
                                                <SelectItem key={author.id} value={String(author.id)}>
                                                    {author.name}
                                                </SelectItem>
                                            ))}
                                            {hasNextPage && (
                                                <SelectItem
                                                    value="load_more"
                                                    onMouseEnter={() => fetchNextPage()}
                                                    disabled={isFetchingNextPage}
                                                >
                                                    {isFetchingNextPage ? "Loading..." : "Load more..."}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.authorId && (
                                <p className="text-sm text-destructive">{errors.authorId?.message}</p>
                            )}
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/books")}
                        disabled={isSubmitting || updateMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="book-form"
                        disabled={!isValid || isSubmitting || updateMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting || updateMutation.isPending ? "Creating..." : "Update Book"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

