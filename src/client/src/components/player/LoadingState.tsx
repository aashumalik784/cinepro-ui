import { Spinner } from "@/components/ui/spinner"

export function LoadingState({ message = "Loading media..." }: { message?: string }) {
    return (
        <div className="flex min-h-100 w-full flex-col items-center justify-center h-screen gap-4 rounded-xl bg-background/80 backdrop-blur-sm">
            <Spinner className="h-12 w-12 text-primary" />
            <p className="animate-pulse text-muted-foreground">{message}</p>
        </div>
    )
}
