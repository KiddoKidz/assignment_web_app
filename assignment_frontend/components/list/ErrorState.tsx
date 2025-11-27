'use client'

interface ErrorStateProps {
    title?: string
    message: string
}

export function ErrorState({
    title = 'Error',
    message
}: ErrorStateProps) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center gap-4 p-12 text-center">
            <h3 className="text-lg font-semibold text-destructive">{title}</h3>
            <p className="text-muted-foreground max-w-md">{message}</p>
        </div>
    )
}