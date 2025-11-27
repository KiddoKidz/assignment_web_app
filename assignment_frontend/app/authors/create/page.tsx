'use client'

import { useAuthorForm } from '@/hooks/author'
import { createAuthor } from '@/services/author.service'
import type { Author } from '@/schemas/author'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authorKeys } from '@/lib/queryKeys'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,

} from '@/components/ui/card'

import { toast } from 'sonner'

export default function CreateAuthorPage() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const form = useAuthorForm()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = form

    const createMutation = useMutation({
        mutationFn: (data: Author) => createAuthor(data),
        onSuccess: () => {
            toast.success("Author created successfully")
            queryClient.invalidateQueries({ queryKey: authorKeys.lists() })
            router.push("/authors")
        },
        onError: () => {
            toast.error("Failed to create author")
        },
    })

    const onSubmit = (data: Author) => {
        createMutation.mutate(data)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold tracking-tight">Create Author</h1>
            <Card className="w-full">
                <CardContent className="space-y-6">
                    <form id="author-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                {...register("name")}
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
                        onClick={() => router.push("/authors")}
                        disabled={isSubmitting || createMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="author-form"
                        disabled={!isValid || isSubmitting || createMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting || createMutation.isPending ? "Creating..." : "Create Author"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

