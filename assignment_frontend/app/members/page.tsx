'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, Pen, Phone, Trash2 } from 'lucide-react'
import { useDeleteMember } from '@/hooks/member'

import { memberKeys } from '@/lib/queryKeys'
import { getAllMembers } from '@/services/member.service'
import type { MembersPageResponse } from '@/schemas/member'
import { LoadingSkeleton } from '@/components/list/LoadingGrid'
import { ErrorState } from '@/components/list/ErrorState'
import { EmptyState } from '@/components/list/EmptyState'
import { Pagination } from '@/components/list/Pagination'
import { useEffect } from 'react'


export default function MembersPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const page = Number(searchParams.get('page')) || 0

    const { data, isLoading, error } = useQuery<MembersPageResponse>({
        queryKey: memberKeys.all({ page, limit: 12 }),
        queryFn: () => getAllMembers(page, 10),
    })
    const { mutate, isPending, isSuccess: isDeleteSuccess } = useDeleteMember()

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success('Member deleted successfully')
        }
    }, [isDeleteSuccess, router])

    const goToPage = (page: number) => {
        router.push(`/members?page=${page}`)
    }

    const totalPages = data?.page.totalPages ?? 0

    let mainComponent = null

    if (isLoading) {
        mainComponent = <LoadingSkeleton numItems={9} />
    } else if (error) {
        mainComponent = <ErrorState message="Error fetching members" />
    } else if (!data?.content?.length) {
        mainComponent = <EmptyState title="No members found" description="Try creating one." />
    } else {
        mainComponent = (
            <>
                {data.content.map((member) => (
                    <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-all">
                        <CardHeader className="px-6">
                            <CardTitle className="leading-tight line-clamp-2">{member.name}</CardTitle>
                            <CardDescription>
                                <span className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2" /><p>{member.email || '...'}</p>
                                </span>
                                <span className="flex items-center">
                                    <Phone className="h-4 w-4 mr-2" /><p>{member.phone || '...'}</p>
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6">
                            <div className="flex gap-2">
                                <Button asChild size="sm" className="flex-1">
                                    <Link href={`/members/${member.id}`}>
                                        <Pen className="h-4 w-4 mr-2" /> Edit
                                    </Link>
                                </Button>
                                <Button size="sm" variant="destructive" className="flex-1" disabled={isPending} onClick={() => mutate(member.id!)} >
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
                <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                <Button asChild>
                    <Link href="/members/create">+ New Member</Link>
                </Button>
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