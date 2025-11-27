'use client'

import { useMemberForm } from '@/hooks/member'
import { createMember } from '@/services/member.service'
import type { Member } from '@/schemas/member'

import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { memberKeys } from '@/lib/queryKeys'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,

} from '@/components/ui/card'

import { toast } from 'sonner'

export default function CreateMemberPage() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const form = useMemberForm()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = form

    const createMutation = useMutation({
        mutationFn: (data: Member) => createMember(data),
        onSuccess: () => {
            toast.success("Member created successfully")
            queryClient.invalidateQueries({ queryKey: memberKeys.lists() })
            router.push("/members")
        },
        onError: () => {
            toast.error("Failed to create member")
        },
    })

    const onSubmit = (data: Member) => {
        createMutation.mutate(data)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold tracking-tight">Create Member</h1>
            <Card className="w-full">
                <CardContent className="space-y-6">
                    <form id="member-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter member name"
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
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="Enter member email"
                                type='email'
                                className={
                                    errors.email
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                placeholder="Enter member phone"
                                className={
                                    errors.phone
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone?.message}</p>
                            )}
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 pt-2 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/members")}
                        disabled={isSubmitting || createMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="member-form"
                        disabled={!isValid || isSubmitting || createMutation.isPending}
                        className="w-full sm:w-auto"
                    >
                        {isSubmitting || createMutation.isPending ? "Creating..." : "Create Member"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

