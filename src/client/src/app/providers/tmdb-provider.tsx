import React, { useMemo } from "react"
import { TMDB, type TMDBOptions } from "@lorenzopant/tmdb"
import { TmdbContext } from "@/hooks/use-tmdb"

interface TMDBProviderProps {
    apiKey: string
    options?: TMDBOptions
    children: React.ReactNode
}

export function TMDBProvider({ apiKey, options, children }: TMDBProviderProps) {
    const tmdb = useMemo(() => new TMDB(apiKey, { ...options }), [apiKey, options])
    return <TmdbContext.Provider value={{ tmdb }}>{children}</TmdbContext.Provider>
}

