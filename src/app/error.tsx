'use client'

export default function Error({error, reset}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-bold">앗! 문제가 발생했습니다.</h2>
            <p className="text-muted-foreground">{error.message}</p>
        </div>
    )
}