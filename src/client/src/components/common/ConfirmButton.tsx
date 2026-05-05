import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LucideArrowRight, LucideXCircle } from "lucide-react"

export default function ConfirmButton({
    trigger,
    title,
    description,
    onConfirm,
    variant = "destructive",
}: {
    trigger: React.ReactNode
    title: string
    description: string
    onConfirm: () => void
    variant?: "default" | "destructive"
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel><LucideXCircle/>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className={variant === "destructive" ? "text-destructive-foreground bg-destructive" : ""}>
                        Continue<LucideArrowRight/>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
