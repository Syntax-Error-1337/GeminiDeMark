import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        const variants = {
            default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
            outline: "border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground",
            ghost: "hover:bg-secondary hover:text-secondary-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
        }

        const sizes = {
            default: "h-10 px-4 py-2 text-sm",
            sm: "h-8 px-3 text-xs rounded-md",
            lg: "h-12 px-8 text-base rounded-lg",
            icon: "h-10 w-10",
        }

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "active:scale-[0.98]",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
