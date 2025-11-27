'use client'

import { Button } from '@/components/ui/button'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between border-t pt-6">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                Previous
            </Button>
            <div className="flex items-baseline gap-1 text-sm font-medium">
                Page{' '}
                <span className="font-mono text-base">{currentPage + 1}</span> of{' '}
                <span className="font-mono text-base">{totalPages}</span>
            </div>
            <Button
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
            >
                Next
            </Button>
        </div>
    )
}