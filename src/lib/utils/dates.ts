import { format, FormatOptions } from "date-fns";
import { es } from "date-fns/locale";

// Function to transform date to "dd/MM/yyyy" format
export const transformDate = (
  date: string,
  formatDate: string = "dd/MM/yyyy",
  options?: FormatOptions
) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, formatDate, {
      ...options,
      locale: es,
    });
  }
};

// Function to transform time to "HH:mm:ss" format
export const transformToTime = (
  date: string,
  formatTime: string = "HH:mm:ss",
  options?: FormatOptions
) => {
  if (date) {
    const newDate = new Date(date);
    return format(newDate, formatTime, {
      ...options,
      locale: es,
    });
  }
};

// Function to transform range date to "dd/MM/yyyy" format
export const transformRangeDate = (
  startDate: string,
  endDate: string,
  formatDate: string = "dd/MM/yyyy",
  options?: FormatOptions
) => {
  if (!startDate && !endDate) return;
  const start = transformDate(startDate, formatDate, options);
  const end = transformDate(endDate, formatDate, options);
  return `${start} - ${end}`;
};
