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

import { useMemberForm } from '@/hooks/member'
import { getMemberById, updateMember } from '@/services/member.service'
import type { Member } from '@/schemas/member'

import { memberKeys } from '@/lib/queryKeys'
import { toast } from 'sonner'

export default function UpdateMemberPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const memberId = Number(id)

    const queryClient = useQueryClient()

    const form = useMemberForm()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset,
    } = form

    const { data: member } = useQuery({
        queryKey: memberKeys.details(memberId),
        queryFn: () => getMemberById(memberId),
    })

    useEffect(() => {
        if (member) {
            reset(member)
        }
    }, [member, reset])


    const updateMutation = useMutation({
        mutationFn: (data: Member) => updateMember(memberId, data),
        onSuccess: () => {
            toast.success('Member updated successfully')
            queryClient.invalidateQueries({ queryKey: memberKeys.lists() })
            router.push('/members')
        },
        onError: () => {
            toast.error('Failed to update member')
        },
    })

    const onSubmit = (data: Member) => {
        updateMutation.mutate(data)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <h1 className="text-3xl font-bold tracking-tight">Edit Member</h1>
            <Card className="w-full">
                <CardContent className="space-y-6">
                    <form
                        id="member-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
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
                                {...register('name')}
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
                                className={
                                    errors.email
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                }
                                {...register('email')}
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
                                {...register('phone')}
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
                        onClick={() => router.back()}
                        disabled={isSubmitting || updateMutation.isPending}
                        className="flex-1 sm:w-auto"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        form="member-form"
                        disabled={!isValid || isSubmitting || updateMutation.isPending}
                        className="flex-1 sm:w-auto"
                    >
                        {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Update Member'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}