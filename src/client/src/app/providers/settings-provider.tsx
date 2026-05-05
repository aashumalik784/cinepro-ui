import React, { useEffect, useMemo, useState } from "react"
import type { CountryISO3166_1, Timezone, TMDBOptions } from "@lorenzopant/tmdb"
import { getCountry } from "@/lib/tmdb.utils"
import { usePersistentState } from "@/hooks/use-localstorage"
import { AppSettingsContext, supportedLocales, type SupportedLocales } from "@/hooks/use-appsettings"

const DEFAULT_TMDB_OPTIONS: TMDBOptions = {
    language: "en-US",
    region: undefined,
    images: {
        secure_images_url: true,
        autocomplete_paths: true,
        default_image_sizes: {
            posters: "original",
            backdrops: "original",
            logos: "original",
        },
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
    cache: true,
}

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
    const standalone = import.meta.env.VITE_STANDALONE === "true"

    const [locale, setLocale] = usePersistentState<SupportedLocales>("app.locale", "en")
    const [region, setRegion] = usePersistentState<CountryISO3166_1 | undefined>("app.region", getCountry())
    const [showSearch, setShowSearch] = usePersistentState<boolean>("app.showSearch", false)
    const [autoplayNext, setAutoplayNext] = usePersistentState<boolean>("app.autoplayNext", true)
    const [tmdbApiKey, setTmdbApiKey] = usePersistentState<string>("app.tmdbApiKey", import.meta.env.VITE_TMDB_API_KEY)

    /**
     * -----------------------------
     * Derived TMDB options
     * -----------------------------
     */
    const [tmdbOptions, setTmdbOptions] = useState<TMDBOptions>(() => ({
        ...DEFAULT_TMDB_OPTIONS,
        region,
    }))

    useEffect(() => {
        const localeConfig = supportedLocales.find((l) => l.iso639 === locale)

        setTmdbOptions((prev) => ({
            ...prev,
            language: localeConfig?.primaryTranslationTmdb ?? "en-US",
            region,
        }))
    }, [locale, region])

    /**
     * -----------------------------
     * Context value
     * -----------------------------
     */
    const value = useMemo(
        () => ({
            locale,
            region,
            autoplayNext,
            tmdbApiKey,
            tmdbOptions,
            standalone,
            showSearch,

            setLocale,
            setRegion,
            setAutoplayNext,
            setTmdbApiKey,
            setTmdbOptions,
            setShowSearch,
        }),
        [locale, region, autoplayNext, tmdbApiKey, tmdbOptions, standalone, showSearch, setLocale, setRegion, setAutoplayNext, setTmdbApiKey, setShowSearch]
    )

    return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}
