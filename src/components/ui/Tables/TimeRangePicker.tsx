"use client";

import { useEffect, useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { GetActivityCompanyHistoryRequest } from "@/lib/services/userActivity/userActivityTypes";

export const timePickerStyles = {
  "& .MuiInputBase-root": {
    fontSize: "0.875rem", // Reducir el tamaño del texto
    height: "42px", // Ajustar la altura del campo
    borderRadius: "6px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem", // Reducir el tamaño del label
    transform: "translate(14px, 12px) scale(1)", // Ajustar posición inicial del label
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -6px) scale(0.75)", // Ajustar posición cuando el label se desplaza
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.25rem", // Reducir el tamaño del ícono
  },
};

export const containerStyles = {
  display: "flex",
  alignItems: "center",
  spaceX: "2",
  width: "100%", // Asegurar que el contenedor ocupe todo el espacio
};

export const timePickerFieldStyles = {
  width: "100%", // Asegura que cada TimePicker ocupe todo el espacio disponible
};

const formatTime = (time: Date | null) => {
  return time
    ? time.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "";
};

interface Props {
  searchParams?: GetActivityCompanyHistoryRequest;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export const TimeRangePicker = ({
  searchParams,
  onStartTimeChange,
  onEndTimeChange,
}: Props) => {
  const [timeFrom, setTimeFrom] = useState<Date | null>(null);
  const [timeTo, setTimeTo] = useState<Date | null>(null);

  useEffect(() => {
    const timeString = formatTime(timeFrom);
    onStartTimeChange(timeString);
  }, [timeFrom]);

  useEffect(() => {
    const timeString = formatTime(timeTo);
    onEndTimeChange(timeString);
  }, [timeTo]);

  useEffect(() => {
    if (!searchParams?.startTime) {
      setTimeFrom(null);
    }
    if (!searchParams?.endTime) {
      setTimeTo(null);
    }
  }, [searchParams?.startTime, searchParams?.endTime]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={containerStyles}>
        <TimePicker
          label="Desde"
          value={timeFrom}
          onChange={setTimeFrom}
          sx={{ ...timePickerStyles, ...timePickerFieldStyles }}
        />
        <span>-</span>
        <TimePicker
          label="Hasta"
          value={timeTo}
          onChange={setTimeTo}
          minTime={timeFrom || undefined}
          sx={{ ...timePickerStyles, ...timePickerFieldStyles }}
        />
      </div>
    </LocalizationProvider>
  );
};
