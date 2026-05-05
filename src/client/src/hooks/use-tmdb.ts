import { createContext, useContext } from "react"
import { TMDB } from "@lorenzopant/tmdb"

type TmdbContextType = { tmdb: TMDB }

export const TmdbContext = createContext<TmdbContextType | undefined>(undefined)

export function useTmdb() {
    const context = useContext(TmdbContext)
    if (!context) {
        throw new Error("useTmdb must be used within a TmdbProvider")
    }
    return context.tmdb
}
