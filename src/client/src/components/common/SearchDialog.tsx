import { useEffect, useState } from "react"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { useTmdb } from "@/hooks/use-tmdb"
import type { MultiSearchResultItem } from "@lorenzopant/tmdb"
import { useNavigate, useSearchParams } from "react-router-dom"
import { LucideClapperboard, LucideFilter, LucidePlay, LucideTv } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAppSettings } from "@/hooks/use-appsettings.ts"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"

type MediaFilter = "all" | "movie" | "tv"

export function SearchDialog() {
    const tmdb = useTmdb()
    const {showSearch, setShowSearch} = useAppSettings()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [query, setQuery] = useState("")
    const [results, setResults] = useState<MultiSearchResultItem[]>([])
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    const [filter, setFilter] = useState<MediaFilter>("all")

    useEffect(() => {
        const q = searchParams.get("q")
        const f = searchParams.get("type") as MediaFilter | null

        if (q) {
            // eslint-disable-next-line
            setQuery(q)
            setShowSearch(true)
        }

        if (f === "movie" || f === "tv" || f === "all") {
            setFilter(f)
        }
    }, [searchParams, setShowSearch])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nav = navigator as Navigator & { userAgentData?: { platform: string } }

            const platform = nav.userAgentData?.platform ?? navigator.userAgent ?? ""
            const isMac = platform.toLowerCase().includes("mac")

            const modKey = isMac ? e.metaKey : e.ctrlKey

            if (modKey && e.key.toLowerCase() === "j") {
                e.preventDefault()
                setShowSearch(!open)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [showSearch, setShowSearch])

    useEffect(() => {
        if (!showSearch) return

        const params = new URLSearchParams(searchParams)

        if (query) {
            params.set("q", query)
        } else {
            params.delete("q")
        }

        if (filter !== "all") {
            params.set("type", filter)
        } else {
            params.delete("type")
        }

        setSearchParams(params, { replace: true })
    }, [query, filter, showSearch, setSearchParams, searchParams])

    // debounce search
    useEffect(() => {
        if (!query) {
            // eslint-disable-next-line
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await tmdb.search.multi({
                    query,
                    language: "en-US",
                })
                setResults(res.results ?? [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [query, tmdb])

    const handleSelect = (item: MultiSearchResultItem) => {
        setShowSearch(false)
        setQuery("")
        setSearchParams({}, { replace: true })

        if (item.media_type === "movie") {
            navigate(`/movie/${item.id}`)
        } else if (item.media_type === "tv") {
            navigate(`/show/${item.id}`)
        }
    }

    // group results
    const filteredResults = results.filter((r) => {
        if (filter === "all") return true
        return r.media_type === filter
    })

    const movies = filteredResults.filter((r) => r.media_type === "movie")
    const tv = filteredResults.filter((r) => r.media_type === "tv")

    const renderItem = (item: MultiSearchResultItem) => {
        let title = ""
        let subtitle = ""
        let image: string | undefined = ""
        let rating: number | null = null
        let icon = null

        if (item.media_type === "movie") {
            title = item.title
            subtitle = item.release_date || t("searchdialog.fallbackDate")
            image = item.poster_path
            rating = item.vote_average
            icon = <LucidePlay className="h-4 w-4" />
        }

        if (item.media_type === "tv") {
            title = item.name
            subtitle = item.first_air_date || t("searchdialog.fallbackDate")
            image = item.poster_path
            rating = item.vote_average
            icon = <LucideTv className="h-4 w-4" />
        }

        return (
            <CommandItem key={`${item.media_type}-${item.id}`} value={`${title}-${item.media_type}-${item.id}`} onSelect={() => handleSelect(item)} className="flex items-center gap-3">
                {image ? (
                    <img src={image} alt={title} className="h-14 w-10 shrink-0 rounded-md object-cover" />
                ) : (
                    <div className="flex h-14 w-10 items-center justify-center rounded-md bg-muted">{icon}</div>
                )}
                <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">{title}</span>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{subtitle}</span>

                        {rating !== null && <span className="flex items-center gap-1">⭐ {rating.toFixed(1)}</span>}
                    </div>
                </div>
            </CommandItem>
        )
    }

    return (
        <CommandDialog
            open={showSearch}
            onOpenChange={(o) => {
                setShowSearch(o)
                if (!o) {
                    setSearchParams({}, { replace: true })
                }
            }}
            className="max-h-[80vh] w-[95vw] max-w-180 transition-transform sm:w-150 sm:scale-[1.05] md:w-180 md:scale-[1.20]"
        >
            <Command>
                <div className="px-2 pt-2">
                    <InputGroup>
                        <InputGroupInput placeholder={t("searchdialog.placeholder")} value={query} onChange={(e) => setQuery(e.target.value)} />

                        <InputGroupAddon align="inline-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 pr-1">
                                        <LucideFilter className={`h-4 w-4 ${filter !== "all" ? "text-primary" : "text-muted-foreground"}`} />{" "}
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setFilter("all")}>
                                        <LucidePlay className="mr-2 h-4 w-4" />
                                        All
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => setFilter("movie")} className={filter === "movie" ? "text-primary" : ""}>
                                        <LucideClapperboard className="mr-2 h-4 w-4" />
                                        Movies
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => setFilter("tv")} className={filter === "tv" ? "text-primary" : ""}>
                                        <LucideTv className="mr-2 h-4 w-4" />
                                        TV Shows
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </InputGroupAddon>
                    </InputGroup>
                </div>{" "}
                <CommandList>
                    {loading && (
                        <div className="space-y-2 p-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    )}

                    {!loading && query.length === 0 && <CommandEmpty>{t("searchdialog.emptyIdle")}</CommandEmpty>}

                    {!loading && query.length > 0 && results.length === 0 && (
                        <CommandEmpty>
                            {t("searchdialog.emptyNoResults")} <span className="text-muted-foreground italic">{t("searchdialog.quoteAuthor")}</span>
                        </CommandEmpty>
                    )}

                    {!loading && movies.length > 0 && <CommandGroup heading={t("common.movie.plural")}>{movies.map(renderItem)}</CommandGroup>}

                    {!loading && tv.length > 0 && <CommandGroup heading={t("common.tvShow.plural")}>{tv.map(renderItem)}</CommandGroup>}
                </CommandList>
            </Command>
        </CommandDialog>
    )
}
