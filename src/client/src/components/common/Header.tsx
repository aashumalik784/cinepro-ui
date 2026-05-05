import { Button } from "@/components/ui/button"
import { SearchDialog } from "@/components/common/SearchDialog.tsx"
import { LucideSearch, Star } from "lucide-react"
import { Kbd } from "@/components/ui/kbd"
import { SidebarTrigger } from "@/components/ui/sidebar.tsx"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAppSettings } from "@/hooks/use-appsettings.ts"

export default function Header() {
    const { t } = useTranslation()
    const { setShowSearch, showSearch } = useAppSettings()

    return (
        <header className="relative flex h-16 items-center border-b border-border backdrop-blur-sm">
            <SidebarTrigger className="z-10 ml-4" />

            <div className="absolute left-1/2 w-full max-w-[70%] -translate-x-1/2 px-2 sm:max-w-md md:max-w-lg lg:max-w-xl">
                <Button variant="outline" className="flex w-full items-center justify-start text-sm text-muted-foreground" onClick={() => setShowSearch(!showSearch)}>
                    <LucideSearch className="mr-2 h-4 w-4 shrink-0" />

                    <span className="hidden sm:inline">{t("header.searchPlaceholder")}</span>

                    <div className="flex-1" />

                    <span className="hidden items-center gap-1 md:flex">
                        <Kbd>⌘</Kbd>+<Kbd>J</Kbd>
                    </span>
                </Button>

                <SearchDialog />
            </div>

            <Button variant="ghost" className="z-10 mr-4 ml-auto" asChild>
                <Link to={t("common.opensource.git-url")} target="_blank" rel="noopener noreferrer">
                    <Star />
                    <span className="ml-1 hidden sm:inline">
                        {t("header.githubButton", {
                            platform: t("common.opensource.git-platform"),
                        })}
                    </span>
                </Link>
            </Button>
        </header>
    )
}
