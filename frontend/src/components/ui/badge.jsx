import React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = ({ variant, className }) => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive/15 text-red-600 dark:text-red-400 hover:bg-destructive/20",
    outline: "text-foreground",
    success: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
    warning: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
    info: "border-transparent bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
  }

  return cn(base, variants[variant || "default"], className)
}

function Badge({ className, variant, ...props }) {
  return (
    <div className={badgeVariants({ variant, className })} {...props} />
  )
}

export { Badge, badgeVariants }
