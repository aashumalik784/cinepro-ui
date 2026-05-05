import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { LucideCog, LucideFilm, LucideHome, LucideTv } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useHistory } from "@/hooks/use-history"
import { Badge } from "@/components/ui/badge.tsx"

export default function SideBar() {
    const { open } = useSidebar()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const { history } = useHistory()

    const isActive = (path: string) => location.pathname === path

    return (
        <Sidebar side="left" variant="inset" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div onClick={() => navigate("/")} className="cursor-pointer text-lg font-semibold">
                            <div className="flex items-center gap-2">
                                <img src="/favicon.svg" alt="Logo" className="h-14" />

                                <h1
                                    aria-hidden={!open}
                                    className={
                                        "overflow-hidden text-2xl font-bold whitespace-nowrap text-primary transition-all duration-300 ease-in-out " +
                                        (open ? "max-w-50 translate-x-0 scale-100 opacity-100" : "pointer-events-none max-w-0 -translate-x-2 scale-95 opacity-0")
                                    }
                                >
                                    {t("projectName")}
                                </h1>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Pages */}
                <SidebarGroup>
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>

                    <SidebarGroupContent className="flex flex-col gap-2">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="mb-0 min-w-8 bg-primary font-semibold hover:bg-primary active:bg-primary">
                                    <Link to="/">
                                        <LucideHome />
                                        <span>{t("common.home")}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={`mb-0 min-w-8 font-semibold ${isActive("/movies") ? "bg-secondary text-secondary-foreground" : ""}`}>
                                    <Link to="/movies">
                                        <LucideFilm />
                                        {t("common.movie.plural")}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={`mb-0 min-w-8 font-semibold ${isActive("/shows") ? "bg-secondary text-secondary-foreground" : ""}`}>
                                    <Link to="/shows">
                                        <LucideTv />
                                        {t("common.tvShow.plural")}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Watch History */}
                <SidebarGroup>
                    <SidebarGroupLabel>{t("watchhistory.title")}</SidebarGroupLabel>

                    <SidebarGroupContent>
                        {!open ? null : history.length === 0 ? (
                            <div className="px-2 py-2 text-sm text-muted-foreground text-center">{t("watchhistory.empty")}</div>
                        ) : (
                            <SidebarMenu>
                                {history.map((entry) => {
                                    const key = entry.kind === "movie" ? `movie-${entry.item.id}` : `episode-${entry.item.show_id}-${entry.item.season_number}-${entry.item.episode_number}`

                                    const label = entry.kind === "movie" ? entry.item.title : `${entry.item.tvshowtitle} S${entry.item.season_number}E${entry.item.episode_number}`

                                    return (
                                        <SidebarMenuItem key={key}>
                                            <SidebarMenuButton
                                                onClick={() => {
                                                    if (entry.kind === "movie") {
                                                        navigate(`/movie/${entry.item.id}`)
                                                    } else {
                                                        navigate(`/show/${entry.item.show_id}`)
                                                    }
                                                }}
                                            >
                                                {label}
                                                <Badge className="ml-auto">{t("common."+entry.kind+".singular")}</Badge>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className={`mb-0 min-w-8 font-semibold ${isActive("/settings") ? "bg-secondary text-secondary-foreground" : ""}`}>
                            <Link to="/settings">
                                <LucideCog />
                                {t("common.settings")}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
