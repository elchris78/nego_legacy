import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isBefore } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  startDateTime: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangePicker({
  startDateTime: startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  // Convertir fechas a objetos Date sin horas para evitar errores de conversión
  const toLocalDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const date = parseISO(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  return (
    <div className="flex flex-col items-center w-full rounded-lg bg-gray-100 shadow-sm">
      <div className="flex flex-row gap-1 w-full rounded-lg border border-[#bdc3c7] p-2">
        {/* Selección de fecha Desde */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex justify-start items-center space-x-1 w-full h-[30px] text-sm px-2 cursor-pointer"
              aria-label="Seleccionar fecha de inicio"
            >
              
              <CalendarDays size={20} className="text-gray-500" />
              <span>
                {startDate
                  ? format(toLocalDate(startDate)!, "dd/MM/yyyy", { locale: es })
                  : "Seleccionar"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 shadow-lg rounded-md">
            <Calendar
              mode="single"
              locale={es}
              selected={toLocalDate(startDate)}
              onSelect={(date) => {
                if (date) {
                  onStartDateChange(format(date, "yyyy-MM-dd"));
                  // Si la fecha final es menor que la nueva fecha inicial, reiniciarla
                  if (endDate && isBefore(toLocalDate(endDate)!, date)) {
                    onEndDateChange("");
                  }
                }
              }}
              showOutsideDays
            />
          </PopoverContent>
        </Popover>

        {/* Selección de fecha Hasta */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex justify-start items-center space-x-1 w-full h-[30px] text-sm px-2 cursor-pointer"
              aria-label="Seleccionar fecha de fin"
              disabled={!startDate} // Deshabilitar si no hay fecha de inicio
            >
              <CalendarDays size={16} className="text-gray-500" />
              <span>
                {endDate
                  ? format(toLocalDate(endDate)!, "dd/MM/yyyy", { locale: es })
                  : "Seleccionar"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 shadow-lg rounded-md">
            <Calendar
              mode="single"
              locale={es}
              selected={toLocalDate(endDate)}
              onSelect={(date) => {
                if (date && startDate && isBefore(date, toLocalDate(startDate)!)) {
                  // Si la fecha "Hasta" es menor que "Desde", reiniciar
                  onEndDateChange("");
                } else if (date) {
                  onEndDateChange(format(date, "yyyy-MM-dd"));
                }
              }}
              showOutsideDays
              fromDate={toLocalDate(startDate) || new Date()} // Bloquea fechas anteriores a la de inicio
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
