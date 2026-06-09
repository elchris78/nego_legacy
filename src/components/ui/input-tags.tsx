"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CircleX } from "lucide-react";
import { type InputProps } from "./input";
import { cn } from "@/lib/utils";

type InputTagsProps = Omit<InputProps, "value" | "onChange"> & {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  validateRegex?: RegExp;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  (
    { className, value, onChange, disabled, isError, validateRegex, ...props },
    ref
  ) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div
        className={cn(
          "mt-1 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#4197CB] has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-neutral-300 min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950",
          disabled && "bg-[#E3E1E6] text-neutral-500 dark:bg-neutral-800",
          isError && "border-red-500",
          className
        )}
      >
        {value.map((item) => {
          const isInvalid = validateRegex && !validateRegex.test(item);

          return (
            <Badge
              key={item}
              variant="secondary"
              className={cn(
                "bg-[#DBEAFE] text-[#5D6D7E] hover:bg-[#d7e5fa] dark:bg-[#2A2A2A] dark:text-[#B7D4FF] dark:hover:bg-[#3C3C3C] transition-all",
                disabled &&
                  "bg-[#C1C5C8] text-white hover:bg-[#C1C5C8] hover:text-white",
                isInvalid &&
                  "bg-red-100 text-red-600 border border-red-400 hover:bg-red-200"
              )}
            >
              {item}
              <CircleX
                className={cn(
                  "ml-2 w-4 h-4 cursor-pointer",
                  disabled && "cursor-not-allowed text-white"
                )}
                onClick={() => {
                  if (disabled) return;
                  onChange(value.filter((i) => i !== item));
                }}
              />
            </Badge>
          );
        })}
        <input
          className={cn(
            "flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 disabled:bg-[#E3E1E6] placeholder:text-base"
          )}
          disabled={disabled}
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

InputTags.displayName = "InputTags";

export { InputTags };
