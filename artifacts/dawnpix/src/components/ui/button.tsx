import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-bold font-display ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_4px_0_0_hsl(var(--primary)/0.6)] hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_hsl(var(--primary)/0.6)] active:translate-y-[2px] active:shadow-[0_0px_0_0_hsl(var(--primary)/0.6)]",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_4px_0_0_hsl(var(--secondary)/0.6)] hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_hsl(var(--secondary)/0.6)] active:translate-y-[2px] active:shadow-[0_0px_0_0_hsl(var(--secondary)/0.6)]",
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary/5",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_4px_0_0_hsl(var(--destructive)/0.6)]",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4 text-sm",
        lg: "h-16 px-8 text-xl rounded-3xl",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
