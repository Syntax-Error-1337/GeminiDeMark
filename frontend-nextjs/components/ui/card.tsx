import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "outline"
}

export function Card({ className, variant = "default", ...props }: CardProps) {
    return (
        <div
            className={cn(
                "group relative rounded-xl transition-all duration-300",
                {
                    // Default Variant - Clean and simple
                    "bg-card border border-border shadow-md hover:shadow-lg":
                        variant === "default",

                    // Glass Variant - Subtle transparency
                    "bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl hover:border-border":
                        variant === "glass",

                    // Outline Variant - Minimal
                    "border border-border bg-transparent hover:bg-card/50":
                        variant === "outline",
                },
                className
            )}
            {...props}
        />
    )
}

// Simplified card header/footer/content for structured cards
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col space-y-1.5 p-6", className)}
            {...props}
        />
    )
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
            {...props}
        />
    )
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("p-6 pt-0", className)} {...props} />
    )
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
        />
    )
}
