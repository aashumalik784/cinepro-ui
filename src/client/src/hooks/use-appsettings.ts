import React, { createContext, useContext } from "react"
import type { CountryISO3166_1, PrimaryTranslations, TMDBOptions } from "@lorenzopant/tmdb"
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"

countries.registerLocale(enLocale)

export const supportedRegions = (Object.keys(countries.getAlpha2Codes()) as CountryISO3166_1[]).map((code) => ({
    value: code,
    label: countries.getName(code, "en") ?? code,
}))

export type SupportedLocales = "en"

export const supportedLocales: {
    iso639: SupportedLocales
    label: string
    primaryTranslationTmdb: PrimaryTranslations
}[] = [
    {
        iso639: "en",
        label: "English",
        primaryTranslationTmdb: "en-US",
    },
] as const

export type AppSettings = {
    locale: SupportedLocales
    region: CountryISO3166_1 | undefined
    autoplayNext: boolean
    tmdbApiKey: string
    standalone: boolean
    tmdbOptions: TMDBOptions
    showSearch: boolean

    setLocale: (locale: SupportedLocales) => void
    setRegion: (region: CountryISO3166_1) => void
    setAutoplayNext: (value: boolean) => void
    setTmdbApiKey: (apiKey: string) => void
    setTmdbOptions: React.Dispatch<React.SetStateAction<TMDBOptions>>
    setShowSearch: (value: boolean) => void
}

export const AppSettingsContext = createContext<AppSettings | null>(null)


export function useAppSettings() {
    const ctx = useContext(AppSettingsContext)
    if (!ctx) {
        throw new Error("useAppSettings must be used within the AppSettingsProvider")
    }
    return ctx
}