'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Label } from '@/components/ui/label'

import { useAuthorForm } from '@/hooks/useAuthorForm'
import { getAuthorById, updateAuthor, deleteAuthor } from '@/services/author.service'
import type { Author } from '@/schemas/author'

import { toast } from 'sonner'

export default function AuthorPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const authorId = parseInt(id)

    const [data, setData] = useState<Author | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const form = useAuthorForm()

    const {
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
        reset,
    } = form

    useEffect(() => {
        if (id) {
            loadAuthor()
        }
    }, [id])

    const loadAuthor = async () => {
        setLoading(true)
        setError('')
        try {
            const authorData = await getAuthorById(authorId)
            setData(authorData)
            reset(authorData)
        } catch (err) {
            setError('Author not found')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data: Author) => {
        try {
            await updateAuthor(authorId, { name: data.name })
            toast.success('Author updated successfully')
            router.push('/authors')
        } catch (err) {
            toast.error('Failed to update author')
            setError('Failed to update author')
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this author? This action cannot be undone.')) {
            return
        }
        setIsDeleting(true)
        setError('')
        try {
            await deleteAuthor(authorId)
            toast.success('Author deleted successfully')
            router.push('/authors')
        } catch (err) {
            toast.error('Failed to delete author')
            setError('Failed to delete author')
        } finally {
            setIsDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Skeleton className="h-4 w-20" />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Skeleton className="h-4 w-24" />
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Card>
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-3/4" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="space-y-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/authors">Authors</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <span className="font-normal text-muted-foreground">Not Found</span>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Card>
                    <CardHeader>
                        <CardTitle>Author Not Found</CardTitle>
                        <CardDescription>The author you are looking for does not exist.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{error}</p>
                        <Button className="mt-4" asChild>
                            <Link href="/authors">Back to Authors</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/authors">Authors</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <span className="font-normal text-muted-foreground">
                            {watch('name') || data.name}
                        </span>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <CardTitle>Edit Author</CardTitle>
                    <CardDescription>
                        Update the author&apos;s name below or delete the author.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="id">ID</Label>
                                <Input id="id" value={data.id} readOnly className="bg-muted/50 cursor-not-allowed" />
                            </div>
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
                                    {...form.register('name')}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting || isDeleting}
                                className="w-full sm:w-auto"
                            >
                                Back
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isSubmitting || isDeleting}
                                className="w-full sm:w-auto"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Author'}
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting || isDeleting}
                                className="w-full sm:w-auto"
                            >
                                {isSubmitting ? 'Saving...' : 'Update Author'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}