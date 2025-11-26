'use client'

import { useAuthorForm } from '@/hooks/useAuthorForm'
import { createAuthor } from '@/services/author.service'
import type { Author } from '@/schemas/author'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { toast } from 'sonner'

export default function CreateAuthorPage() {
    const router = useRouter()

    const form = useAuthorForm()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = form

    const onSubmit = async (data: Author) => {
        try {
            await createAuthor(data)
            toast.success("Author created successfully")
            router.push("/authors")
            router.refresh()
        } catch (error) {
            toast.error("Failed to create author")
        }
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
                        <span className="font-normal text-muted-foreground">Create Author</span>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <CardTitle>Create Author</CardTitle>
                    <CardDescription>
                        Enter the new author&apos;s name below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/authors")}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                {isSubmitting ? "Creating..." : "Create Author"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
