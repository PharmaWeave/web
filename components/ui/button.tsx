import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover-lift",
  {
    variants: {
      variant: {
        default: "gradient-primary text-white shadow-lg hover:shadow-xl border-0 font-semibold",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl focus-visible:ring-red-500/20",
        outline:
          "border-2 border-primary bg-transparent text-primary shadow-md hover:gradient-primary hover:text-white hover:border-transparent font-semibold",
        secondary: "gradient-accent text-white shadow-lg hover:shadow-xl border-0 font-semibold",
        ghost: "hover:bg-primary/10 hover:text-primary text-foreground font-medium",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        success: "gradient-success text-white shadow-lg hover:shadow-xl border-0 font-semibold",
        warning: "gradient-warning text-white shadow-lg hover:shadow-xl border-0 font-semibold",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
