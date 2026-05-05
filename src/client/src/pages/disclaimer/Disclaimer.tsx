import { t } from "i18next"
import { Button } from "@/components/ui/button.tsx"
import { LucideHome } from "lucide-react"
import { Link } from "react-router-dom"
import { H1, P } from "@/components/ui/typography.tsx"

export default function Disclaimer() {
    return (
        <section className="mx-auto flex h-[70vh] w-[70vw] flex-col items-center justify-center space-y-8">
            {" "}
            <H1>{t("common.disclaimer.label")}</H1>
            <P className={"text-center"}>{t("common.disclaimer.value", { projectName: t("projectName"), coreName: t("coreName") })}</P>
            <Button asChild>
                <Link to={"/"}>
                    <LucideHome />
                    {t("common.disclaimer.button")}
                </Link>
            </Button>
        </section>
    )
}
