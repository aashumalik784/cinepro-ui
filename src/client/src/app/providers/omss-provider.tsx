import React, { createContext, useEffect, useMemo, useState } from "react"
import { createOmssClient, type OmssClient, type OmssClientConfig } from "@omss/sdk"
import { usePersistentState } from "@/hooks/use-localstorage.ts"
import { useDebouncedValue } from "@/hooks/use-debounce.ts"

type OmssContextType = {
    client: OmssClient
    baseUrl: string
    setBaseUrl: (baseUrl: string) => void
    valid: boolean
}

const OmssContext = createContext<OmssContextType | null>(null)

export function OmssProvider({ children, options }: { children: React.ReactNode; options: OmssClientConfig }) {
    const [baseUrl, setBaseUrl] = usePersistentState<string>("app.omssUrl", import.meta.env.VITE_OMSS_API_URL ?? "")
    const [valid, setValid] = useState(false)
    const debouncedBaseUrl = useDebouncedValue(baseUrl, 500)

    const client = useMemo(() => {
        return createOmssClient({
            ...options,
            baseUrl: debouncedBaseUrl,
        })
    }, [debouncedBaseUrl, options])

    useEffect(() => {
        let cancelled = false

        async function validate() {
            try {
                const result = await client.getHealthStatus()
                const health = result.data

                const isValid = health?.spec === "omss" && health?.status === "operational"

                if (!cancelled) {
                    setValid((prev) => (prev !== isValid ? isValid : prev))
                }
            } catch {
                if (!cancelled) {
                    setValid((prev) => (prev ? false : prev))
                }
            }
        }

        void validate()

        return () => {
            cancelled = true
        }
    }, [client])

    const value = useMemo(
        () => ({
            client,
            baseUrl,
            setBaseUrl,
            valid,
        }),
        [client, baseUrl, setBaseUrl, valid]
    )

    return <OmssContext.Provider value={value}>{children}</OmssContext.Provider>
}

export { OmssContext }
