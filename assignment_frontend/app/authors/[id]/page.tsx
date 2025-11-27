'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,

} from '@/components/ui/card'

import { useAuthorForm } from '@/hooks/author'
import { getAuthorById, updateAuthor } from '@/services/author.service'
import type { Author } from '@/schemas/author'

import { authorKeys } from '@/lib/queryKeys'
import { toast } from 'sonner'

export default function UpdateAuthorPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const authorId = Number(id)

    const queryClient = useQueryClient()

    const form = useAuthorForm()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset,
    } = form

    const { data: author } = useQuery({
        queryKey: authorKeys.details(authorId),
        queryFn: () => getAuthorById(authorId),
    })

    useEffect(() => {
        if (author) {
            reset(author)
        }
    }, [author, reset])


    const updateMutation = useMutation({
        mutationFn: (data: Author) => updateAuthor(authorId, data),
        onSuccess: () => {
            toast.success('Author updated successfully')
            queryClient.invalidateQueries({ queryKey: authorKeys.lists() })
            router.push('/authors')
        },
        onError: () => {
            toast.error('Failed to update author')
        },
    })

    const onSubmit = (data: Author) => {
        updateMutation.mutate(data)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold tracking-tight">Edit Author</h1>
            <Card className="w-full">
                <CardContent className="space-y-6">
                    <form
                        id="author-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter author name"
                                className={
                                    errors.name
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting || updateMutation.isPending}
                        className="flex-1 sm:w-auto"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        form="author-form"
                        disabled={!isValid || isSubmitting || updateMutation.isPending}
                        className="flex-1 sm:w-auto"
                    >
                        {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Update Author'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}