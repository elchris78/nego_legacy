"use client";

import { useEffect, useState } from "react";
import { addDays, format, isSameDay } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
import CalendarClockMaterial from "../icons/CalendarClockMaterial";

interface Props {
  searchParams?: any;
  onStartDateChange: (date: string | undefined) => void;
  onEndDateChange: (date: string | undefined) => void;
}

type DateRangePickerProps = Props & React.HTMLAttributes<HTMLDivElement>;

function transformDate(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Obtener la fecha en UTC
  const year = parsedDate.getUTCFullYear();
  const month = (parsedDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Meses van de 0 a 11
  const day = parsedDate.getUTCDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function DatePickerWithRange({
  className,
  searchParams,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps): JSX.Element {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    onStartDateChange(transformDate(date?.from));
    onEndDateChange(transformDate(date?.to));
  }, [date]);

  // Limpiar fechas si no hay valores en los parámetros de búsqueda
  useEffect(() => {
    if (!searchParams?.startDate) {
      setDate((prev) => ({ to: prev?.to, from: undefined }));
    }
    if (!searchParams?.endDate) {
      setDate((prev) => ({ from: prev?.from, to: undefined }));
    }
  }, [searchParams?.startDate, searchParams?.endDate]);

  // Función para manejar la selección
  const handleSelect = (range: DateRange | undefined) => {
    // Si ya existe un rango completo seleccionado, validar cuál fecha camabió, para asignarla a la fecha de inicio
    if (date?.from && date?.to && range?.from && range?.to) {
      const fromChanged = !isSameDay(date.from, range.from);
      const toChanged = !isSameDay(date.to, range.to);

      if (fromChanged) {
        setDate({ from: range.from, to: undefined });
        return;
      }

      if (toChanged) {
        setDate({ from: range.to, to: undefined });
        return;
      }

      return;
    } else {
      setDate(range);
    }
  };

  return (
    <div className={cn("grid gap-2 h-auto", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto h-full justify-start text-left font-normal gap-2 text-[#5B6670] border-gray-300",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarClockMaterial color="#5B6670" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                <>{format(date.from, "LLL dd, y")} - dd/mm/aa</>
              )
            ) : (
              <span className="font-normal text-gray-700">
                dd/mm/aa - dd/mm/aa
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          side="bottom"
          avoidCollisions={false}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={es}
            disabled={date?.from ? [(day) => isSameDay(day, date.from!)] : []}
            classNames={{
              day_selected:
                "bg-[#4197cb] text-white hover:!bg-[#51a1d3] hover:text-white",
              day_range_start:
                "bg-[#4197cb] text-white hover:!bg-[#51a1d3] hover:text-white",
              day_range_end:
                "bg-[#4197cb] text-white hover:!bg-[#51a1d3] hover:text-white",
              day_range_middle:
                "bg-[#cae8f8] !text-stone-700 rounded-none hover:bg-[#a0d7f5] hover:!text-stone-900",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
