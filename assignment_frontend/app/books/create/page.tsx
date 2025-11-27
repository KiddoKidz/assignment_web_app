'use client'

import { useBookForm } from '@/hooks/book'
import { createBook } from '@/services/book.service'
import type { BookInput } from '@/schemas/book'

import { useRouter } from 'next/navigation'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export default function CreateBookPage() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const form = useBookForm()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = form

    const createMutation = useMutation({
        mutationFn: (data: BookInput) => createBook(data),
        onSuccess: () => {
            toast.success("Book created successfully")
            queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
            router.push("/books")
        },
        onError: () => {
            toast.error("Failed to create book")
        },
    })

    const onSubmit = (data: BookInput) => {
        createMutation.mutate(data)
    }

    const { data: authorsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<AuthorsPageResponse>({
        initialPageParam: 0,
        queryKey: ['authors'],
        queryFn: ({ pageParam }) => getAllAuthors(pageParam as number),
        getNextPageParam: (lastPage: AuthorsPageResponse) => {
            const nextPage = lastPage.page.number + 1;
            return nextPage < lastPage.page.totalPages ? nextPage : undefined;
        },
    })

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold tracking-tight">Create Book</h1>
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
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        value={String(field.value)}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select author" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {authorsData?.pages.map((page) =>
                                                page.content.map((author) => (
                                                    <SelectItem key={author.id} value={String(author.id)}>
                                                        {author.name}
                                                    </SelectItem>
                                                ))
                                            )}
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
                        disabled={isSubmitting || createMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="book-form"
                        disabled={!isValid || isSubmitting || createMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting || createMutation.isPending ? "Creating..." : "Create Book"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

