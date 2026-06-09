import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import { Calendar } from "@/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover"

interface DatePickerProps {
  className?: string;
  tilte: string;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({ className, tilte, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate); 
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "border rounded px-3 py-2 mt-1 h-12 w-[15%] mb-4",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{tilte}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect} 
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
