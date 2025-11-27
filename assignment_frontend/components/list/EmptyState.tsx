'use client'

interface EmptyStateProps {
    title: string
    description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center gap-4 p-12 text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}