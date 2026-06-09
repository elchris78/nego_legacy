"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  containerStyles,
  timePickerFieldStyles,
  timePickerStyles,
} from "@/components/ui/Tables/TimeRangePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox, FormControlLabel } from "@mui/material";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Dispatch, SetStateAction, useState } from "react";
import { es } from "date-fns/locale";
import { format, isSameDay, parse } from "date-fns";
import { GetActivityHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CalendarClockMaterial from "@/components/ui/icons/CalendarClockMaterial";

function transformDate(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Obtener la fecha en la zona horaria local
  const year = parsedDate.getFullYear();
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Meses van de 0 a 11
  const day = parsedDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const LoginAccordionContent = ({
  searchParams,
  setSearchParams,
}: {
  searchParams: GetActivityHistoryRequest;
  setSearchParams: Dispatch<SetStateAction<GetActivityHistoryRequest>>;
}) => {
  // Estado local para manejar los checkboxes
  const [isCheckedDate, setIsCheckedDate] = useState(
    !!searchParams.loginStartDate
  );
  const [isCheckedTime, setIsCheckedTime] = useState(
    !!searchParams.loginStartTime || !!searchParams.loginEndTime
  );

  // Estado local para manejar las fechas
  const [date, setDate] = useState<DateRange | undefined>({
    from: searchParams.loginStartDate
      ? parse(searchParams?.loginStartDate, "yyyy-MM-dd", new Date())
      : undefined,
    to: searchParams.loginEndDate
      ? parse(searchParams?.loginEndDate, "yyyy-MM-dd", new Date())
      : undefined,
  });

  // Estado local para manejar las horas
  const [timeFrom, setTimeFrom] = useState<Date | null>(
    searchParams.loginStartTime
      ? parse(searchParams?.loginStartTime, "HH:mm", new Date())
      : null
  );
  const [timeTo, setTimeTo] = useState<Date | null>(
    searchParams.loginEndTime
      ? parse(searchParams?.loginEndTime, "HH:mm", new Date())
      : null
  );

  // Función que maneja el cambio del checkbox de fecha
  const handleDateCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "date" | "time"
  ) => {
    const checked = e.target.checked;

    switch (field) {
      case "date":
        setIsCheckedDate(checked);

        if (!checked) {
          // Reinicia el estado de las fechas
          setDate({ from: undefined, to: undefined });

          // Actualiza searchParams solo si es necesario (es decir, si alguno de los valores no es undefined)
          if (
            searchParams.loginStartDate !== undefined ||
            searchParams.loginEndDate !== undefined
          ) {
            setSearchParams({
              ...searchParams,
              loginStartDate: undefined,
              loginEndDate: undefined,
            });
          }
        }
        break;
      case "time":
        setIsCheckedTime(checked);

        if (!checked) {
          // Reinicia el estado de las horas
          setTimeFrom(null);
          setTimeTo(null);

          // Actualiza searchParams solo si es necesario (es decir, si alguno de los valores no es undefined)
          if (
            searchParams.loginStartTime !== undefined ||
            searchParams.loginEndTime !== undefined
          ) {
            setSearchParams({
              ...searchParams,
              loginStartTime: undefined,
              loginEndTime: undefined,
            });
          }
        }
        break;
      default:
        break;
    }
  };

  // Función que actualiza el estado local de las fechas y searchParams
  const handleDateChange = (range: DateRange | undefined) => {
    const newRange = handleSelect(range);
    setDate(newRange);

    // Si se seleccionó al menos la fecha "from", se actualizan ambos parámetros
    if (newRange && newRange.from) {
      const startDate = transformDate(newRange.from);
      const endDate = newRange.to ? transformDate(newRange.to) : undefined;

      setSearchParams((prev) => ({
        ...prev,
        loginStartDate: startDate,
        loginEndDate: endDate,
      }));
    } else {
      // Si se borra la selección, se limpian los parámetros de fecha
      setSearchParams((prev) => ({
        ...prev,
        loginStartDate: undefined,
        loginEndDate: undefined,
      }));
    }
  };

  // Función para manejar la selección de fechas
  const handleSelect = (
    range: DateRange | undefined
  ):
    | {
        from: Date | undefined;
        to: Date | undefined;
      }
    | undefined => {
    // Si ya existe un rango completo seleccionado, validar cuál fecha camabió, para asignarla a la fecha de inicio
    if (date?.from && date?.to && range?.from && range?.to) {
      const fromChanged = !isSameDay(date.from, range.from);
      const toChanged = !isSameDay(date.to, range.to);

      if (fromChanged) {
        return { from: range.from, to: undefined };
      }

      if (toChanged) {
        return { from: range.to, to: undefined };
      }

      return;
    } else {
      return { from: range?.from, to: range?.to };
    }
  };

  // Función que actualiza el estado local de las horas y searchParams
  const handleTimeChange = (date: Date | null | undefined, field: string) => {
    if (field === "from") {
      setTimeFrom(date!);

      // Actualiza searchParams solo si es necesario (es decir, si el valor no es undefined)
      if (date) {
        const timeString = format(date, "HH:mm");
        setSearchParams({ ...searchParams, loginStartTime: timeString });
      } else {
        setSearchParams({ ...searchParams, loginStartTime: undefined });
      }
    } else {
      setTimeTo(date!);

      // Actualiza searchParams solo si es necesario (es decir, si el valor no es undefined)
      if (date) {
        const timeString = format(date, "HH:mm");
        setSearchParams({ ...searchParams, loginEndTime: timeString });
      } else {
        setSearchParams({ ...searchParams, loginEndTime: undefined });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 px-3">
      {/* Date */}
      <div className="grid grid-cols-6 gap-1 md:gap-4">
        <div className="col-span-6 md:col-span-1">
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedDate}
                onChange={(e) => handleDateCheckboxChange(e, "date")}
                name="Fecha"
                color="primary"
              />
            }
            label="Fecha"
          />
        </div>
        <div
          className={`${isCheckedDate ? "col-span-6 lg:col-span-3 md:col-span-5" : "hidden"}`}
        >
          {isCheckedDate && (
            <div className="grid gap-2 h-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-auto h-full justify-start text-left font-normal gap-2 text-[#5B6670]",
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
                    onSelect={handleDateChange}
                    numberOfMonths={2}
                    disabled={
                      date?.from ? [(day) => isSameDay(day, date.from!)] : []
                    }
                    locale={es}
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
          )}
        </div>
      </div>

      {/* Time */}
      <div className="grid grid-cols-6 gap-1 md:gap-4">
        <div className="col-span-6 md:col-span-1">
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedTime}
                onChange={(e) => handleDateCheckboxChange(e, "time")}
                name="Hora"
                color="primary"
              />
            }
            label="Hora"
          />
        </div>
        <div
          className={`${isCheckedTime ? "col-span-6 lg:col-span-3 md:col-span-5" : "hidden"}`}
        >
          {isCheckedTime && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div style={containerStyles}>
                <TimePicker
                  label="Desde"
                  value={timeFrom}
                  onChange={(date) => handleTimeChange(date, "from")}
                  sx={{ ...timePickerStyles, ...timePickerFieldStyles }}
                />
                <span>-</span>
                <TimePicker
                  label="Hasta"
                  value={timeTo}
                  onChange={(date) => handleTimeChange(date, "to")}
                  minTime={timeFrom || undefined}
                  sx={{ ...timePickerStyles, ...timePickerFieldStyles }}
                />
              </div>
            </LocalizationProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginAccordionContent;
