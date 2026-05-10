import { useMediaWatchContext } from "./providers/MediaWatchProvider"
import { Badge } from "@/components/ui/badge"

export function SourceSelector() {
    const { state, selectSource } = useMediaWatchContext()
    const sources = state.media?.playback.sources || []
    const selectedSource = state.media?.playback.selectedSource

    if (sources.length === 0) return null

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Sources</h4>
            <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                    <button
                        key={`${source.provider.id}-${idx}`}
                        onClick={() => selectSource(source)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all ${
                            selectedSource?.url === source.url ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/50 hover:bg-secondary"
                        }`}
                    >
                        <span className="text-sm font-semibold">{source.provider.name}</span>
                        <Badge variant="outline" className="h-4 bg-background/20 py-0 text-[10px]">
                            {source.quality}
                        </Badge>
                    </button>
                ))}
            </div>
        </div>
    )
}
