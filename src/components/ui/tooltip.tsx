"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-visible rounded-3xl bg-white px-4 py-3 text-[#4a9ed8] text-base border-2 border-gray-500 shadow-lg max-w-xs -translate-x-2",
      "relative after:absolute after:w-4 after:h-4 after:bg-white after:border-2 after:border-gray-500",
      "after:rotate-[135deg] after:border-r-0 after:border-t-0 after:left-[-5px] after:top-[15px]",
      "data-[side=right]:after:left-[-5px] data-[side=right]:after:right-auto",
      "data-[side=left]:after:left-auto data-[side=left]:after:right-[-5px] data-[side=left]:after:border-l-0 data-[side=left]:after:border-b-0 data-[side=left]:after:rotate-[-45deg]",
      "data-[side=top]:after:top-auto data-[side=top]:after:bottom-[-5px] data-[side=top]:after:left-6 data-[side=top]:after:translate-x-0 data-[side=top]:after:rotate-[-135deg]",
      "data-[side=bottom]:after:bottom-auto data-[side=bottom]:after:top-[-5px] data-[side=bottom]:after:left-6 data-[side=bottom]:after:translate-x-0 data-[side=bottom]:after:rotate-[45deg]",
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

