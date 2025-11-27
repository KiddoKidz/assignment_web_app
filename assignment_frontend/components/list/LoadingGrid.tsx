'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingSkeletonProps {
    numItems?: number
}

export function LoadingSkeleton({
    numItems = 9,
}: LoadingSkeletonProps) {
    return (
        <>
            {Array.from({ length: numItems }, (_, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-6 pb-4 space-y-2">
                        <Skeleton className="h-8 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-20" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}