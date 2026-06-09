import {
  containerStyles,
  timePickerFieldStyles,
  timePickerStyles,
} from "@/components/ui/Tables/TimeRangePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Checkbox, FormControlLabel } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { format, parse } from "date-fns";
import { GetActivityHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const InactiveTimeAccordionContent = ({
  searchParams,
  setSearchParams,
}: {
  searchParams: GetActivityHistoryRequest;
  setSearchParams: Dispatch<SetStateAction<GetActivityHistoryRequest>>;
}) => {
  // Estado local para manejar checkbox
  const [isCheckedTimeRange, setIsCheckedTimeRange] = useState(
    !!searchParams.inactivePeriodStart || !!searchParams.inactivePeriodEnd
  );

  const [isCheckedTime, setisCheckedTime] = useState(
    !!searchParams.minInactiveHours
  );

  // Estado local para manejar las horas
  const [timeFrom, setTimeFrom] = useState<Date | null>(
    searchParams.inactivePeriodStart
      ? parse(searchParams?.inactivePeriodStart, "HH:mm", new Date())
      : null
  );
  const [timeTo, setTimeTo] = useState<Date | null>(
    searchParams.inactivePeriodEnd
      ? parse(searchParams?.inactivePeriodEnd, "HH:mm", new Date())
      : null
  );

  const [time, setTime] = useState<Date | null>(() => {
    if (!searchParams.minInactiveHours) return null;

    const decimalTime = parseFloat(searchParams.minInactiveHours);
    const hours = Math.floor(decimalTime); // Parte entera es la hora
    const minutes = Math.round((decimalTime - hours) * 60); // Parte decimal convertida a minutos

    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Ajusta la fecha con horas y minutos

    return date;
  });

  // Función que maneja el cambio del checkbox de fecha
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "timeRange" | "time"
  ) => {
    const checked = e.target.checked;

    switch (field) {
      case "timeRange":
        setIsCheckedTimeRange(checked);

        if (!checked) {
          // Reinicia el estado de las fechas
          setTimeFrom(null);
          setTimeTo(null);

          // Actualiza searchParams solo si es necesario (es decir, si alguno de los valores no es undefined)
          if (
            searchParams.inactivePeriodStart !== undefined ||
            searchParams.inactivePeriodEnd !== undefined
          ) {
            setSearchParams({
              ...searchParams,
              inactivePeriodStart: undefined,
              inactivePeriodEnd: undefined,
            });
          }
        }
        break;
      case "time":
        setisCheckedTime(checked);

        if (!checked) {
          // Reinicia el estado de la hora
          setTime(null);

          // Actualiza searchParams solo si es necesario (es decir, si alguno de los valores no es undefined)
          if (searchParams.minInactiveHours !== undefined) {
            setSearchParams({
              ...searchParams,
              minInactiveHours: undefined,
            });
          }
        }
        break;
      default:
        break;
    }
  };

  // Función que actualiza el estado local de las horas y searchParams
  const handleTimeChange = (date: Date | null | undefined, field: string) => {
    if (field === "from") {
      setTimeFrom(date!);

      // Actualiza searchParams solo si es necesario (es decir, si el valor no es undefined)
      if (date) {
        const timeString = format(date, "HH:mm");
        setSearchParams({ ...searchParams, inactivePeriodStart: timeString });
      } else {
        setSearchParams({ ...searchParams, inactivePeriodStart: undefined });
      }
    } else {
      setTimeTo(date!);

      // Actualiza searchParams solo si es necesario (es decir, si el valor no es undefined)
      if (date) {
        const timeString = format(date, "HH:mm");
        setSearchParams({ ...searchParams, inactivePeriodEnd: timeString });
      } else {
        setSearchParams({ ...searchParams, inactivePeriodEnd: undefined });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 px-3 py-1">
      {/* By time range */}
      <div className="grid grid-cols-6 gap-1 md:gap-4">
        <div className="col-span-6 md:col-span-1">
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedTimeRange}
                onChange={(e) => handleCheckboxChange(e, "timeRange")}
                name="Por periodo"
                color="primary"
              />
            }
            label="Por periodo"
          />
        </div>
        <div
          className={`${isCheckedTimeRange ? "col-span-6 lg:col-span-3 md:col-span-5" : "hidden"}`}
        >
          {isCheckedTimeRange && (
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

      {/* Hora */}
      <div className="grid grid-cols-6 gap-1 md:gap-4">
        <div className="col-span-6 md:col-span-1">
          <FormControlLabel
            control={
              <Checkbox
                checked={isCheckedTime}
                onChange={(e) => handleCheckboxChange(e, "time")}
                name="Por horas"
                color="primary"
              />
            }
            label="Por horas"
          />
        </div>
        <div
          className={`${isCheckedTime ? "col-span-6 lg:col-span-3 md:col-span-5" : "hidden"}`}
        >
          {isCheckedTime && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div style={containerStyles}>
                <TimePicker
                  label="Hora"
                  value={time}
                  onChange={(date) => {
                    if (date) {
                      const hours = date.getHours(); // Obtiene la hora
                      const minutes = date.getMinutes(); // Obtiene los minutos
                      const decimalTime = hours + minutes / 60; // Convierte a formato decimal

                      setTime(date);
                      setSearchParams({
                        ...searchParams,
                        minInactiveHours: decimalTime.toFixed(2), // Redondea a 2 decimales
                      });
                    } else {
                      setSearchParams({
                        ...searchParams,
                        minInactiveHours: undefined,
                      });
                    }
                  }}
                  ampm={false} // Fuerza formato de 24 horas
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

export default InactiveTimeAccordionContent;
