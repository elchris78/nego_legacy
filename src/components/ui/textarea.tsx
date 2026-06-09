import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    isError?: boolean;
  }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isError, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-[#4197CB] focus:border-[#4197CB] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#E3E1E6] disabled:text-gray-500",
          isError ? "border-red-500 bg-red-100" : "border-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
