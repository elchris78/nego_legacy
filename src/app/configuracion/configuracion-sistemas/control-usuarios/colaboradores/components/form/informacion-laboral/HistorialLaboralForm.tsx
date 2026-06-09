"use client";

import { useEffect } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useColaboradorFormContext } from "../ColaboradorFormContext";

const HistorialLaboralForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { historialLaboralForm } = useColaboradorFormContext();
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = historialLaboralForm;

  // Validación de fechas: La fecha de fin no puede ser menor a la fecha de inicio
  useEffect(() => {
    register("periodoUltimoTrabajo", {
      validate: (value) => {
        if (value?.from && value?.to) {
          const fromDate = new Date(value.from);
          const toDate = new Date(value.to);
          if (toDate < fromDate) {
            return "La fecha de fin no puede ser menor a la fecha de inicio";
          }
        }
        return true;
      },
    });
  }, [register]);

  // Validación de fechas: La fecha de fin no puede ser menor a la fecha de inicio
  useEffect(() => {
    register("periodoPenultimoTrabajo", {
      validate: (value) => {
        if (value?.from && value?.to) {
          const fromDate = new Date(value.from);
          const toDate = new Date(value.to);
          if (toDate < fromDate) {
            return "La fecha de fin no puede ser menor a la fecha de inicio";
          }
        }
        return true;
      },
    });
  }, [register]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Último trabajo */}
      <div>
        <LabelTooltip
          label="Último trabajo"
          tooltip="Nombre de la empresa, institución o lugar donde el colaborador laboró más recientemente."
          htmlFor="ultimoTrabajo"
        />
        <Input
          id="ultimoTrabajo"
          type="text"
          placeholder="Ingrese nombre del trabajo"
          disabled={mode === "view"}
          isError={!!errors.ultimoTrabajo}
          {...register("ultimoTrabajo")}
        />
        {errors.ultimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.ultimoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Periodo último trabajo (Fecha inicial) */}
      <div>
        <LabelTooltip
          label="Periodo último de trabajo (Fecha inicial)"
          tooltip="Rango de fechas que indica el inicio y fin del último empleo desempeñado por el colaborador."
          htmlFor="periodo-ultimo-trabajo"
        />
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              disabled={mode === "view"}
              format="DD/MM/YYYY"
              maxDate={dayjs(new Date())}
              value={
                watch("periodoUltimoTrabajo")?.from
                  ? dayjs(watch("periodoUltimoTrabajo").from)
                  : null
              }
              onChange={(newValue) => {
                setValue(
                  "periodoUltimoTrabajo",
                  {
                    from: newValue ? newValue.format("YYYY-MM-DD") : "",
                    to: watch("periodoUltimoTrabajo")?.to || "",
                  },
                  { shouldValidate: true }
                );
              }}
              sx={{
                marginTop: "4px",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "4vh",
                  backgroundColor: mode === "view" ? "#E3E1E6" : "white",
                  color: mode === "view" ? "#949DA4" : "#5D6D7E",
                  flexDirection: "row-reverse",
                  textTransform: "lowercase",
                },
                "& input": {
                  textTransform: "lowercase",
                },
              }}
              slotProps={{
                textField: {
                  placeholder: "Ingrese fecha de inicio",
                  error: !!errors.periodoUltimoTrabajo,
                },
                inputAdornment: {
                  style: {
                    display: "none",
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>
        {errors.periodoUltimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.periodoUltimoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Periodo último trabajo (Fecha final) */}
      <div>
        <LabelTooltip
          label="Periodo último de trabajo (Fecha final)"
          tooltip="Rango de fechas que indica el inicio y fin del último empleo desempeñado por el colaborador."
          htmlFor="periodo-ultimo-trabajo"
        />
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              disabled={mode === "view"}
              format="DD/MM/YYYY"
              maxDate={dayjs(new Date())}
              value={
                watch("periodoUltimoTrabajo")?.to
                  ? dayjs(watch("periodoUltimoTrabajo").to)
                  : null
              }
              onChange={(newValue) => {
                setValue(
                  "periodoUltimoTrabajo",
                  {
                    from: watch("periodoUltimoTrabajo")?.from || "",
                    to: newValue ? newValue.format("YYYY-MM-DD") : "",
                  },
                  { shouldValidate: true }
                );
              }}
              sx={{
                marginTop: "4px",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "4vh",
                  backgroundColor: mode === "view" ? "#E3E1E6" : "white",
                  color: mode === "view" ? "#949DA4" : "#5D6D7E",
                  flexDirection: "row-reverse",
                  textTransform: "lowercase",
                },
                "& input": {
                  textTransform: "lowercase",
                },
              }}
              slotProps={{
                textField: {
                  placeholder: "Ingrese fecha de fin",
                  error: !!errors.periodoUltimoTrabajo,
                },
                inputAdornment: {
                  style: {
                    display: "none",
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>
        {errors.periodoUltimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.periodoUltimoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Último puesto de trabajo */}
      <div>
        <LabelTooltip
          label="Puesto último de trabajo"
          tooltip="Nombre del cargo, función o puesto desempeñado por el colaborador en su último empleo."
          htmlFor="ultimoPuestoTrabajo"
        />
        <Input
          id="ultimoPuestoTrabajo"
          type="text"
          placeholder="Ingrese el último puesto de trabajo"
          disabled={mode === "view"}
          isError={!!errors.ultimoPuestoTrabajo}
          {...register("ultimoPuestoTrabajo")}
        />
        {errors.ultimoPuestoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.ultimoPuestoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Observaciones último trabajo */}
      <div>
        <LabelTooltip
          label="Observaciones último trabajo"
          tooltip="Campo de texto para registrar comentarios adicionales, logros, motivos de salida o información relevante sobre el último trabajo."
          htmlFor="observacionesUltimoTrabajo"
        />
        <Input
          id="observacionesUltimoTrabajo"
          type="text"
          placeholder="Ingrese observaciones sobre el último trabajo"
          disabled={mode === "view"}
          isError={!!errors.observacionesUltimoTrabajo}
          {...register("observacionesUltimoTrabajo")}
        />
        {errors.observacionesUltimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.observacionesUltimoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Penúltimo trabajo */}
      <div>
        <LabelTooltip
          label="Penúltimo trabajo"
          tooltip="Nombre de la empresa o institución en la que el colaborador laboró antes de su último empleo."
          htmlFor="penultimoTrabajo"
        />
        <Input
          id="penultimoTrabajo"
          type="text"
          placeholder="Ingrese nombre del trabajo"
          disabled={mode === "view"}
          isError={!!errors.penultimoTrabajo}
          {...register("penultimoTrabajo")}
        />
        {errors.penultimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.penultimoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Periodo penúltimo trabajo (fecha inicial) */}
      <div>
        <LabelTooltip
          label="Periodo penúltimo trabajo (Fecha inicial)"
          tooltip="Rango de fechas correspondiente al inicio y fin del penúltimo empleo del colaborador."
          htmlFor="periodo-penultimo-trabajo"
        />
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              disabled={mode === "view"}
              format="DD/MM/YYYY"
              maxDate={dayjs(new Date())}
              value={
                watch("periodoPenultimoTrabajo")?.from
                  ? dayjs(watch("periodoPenultimoTrabajo").from)
                  : null
              }
              onChange={(newValue) => {
                setValue(
                  "periodoPenultimoTrabajo",
                  {
                    from: newValue ? newValue.format("YYYY-MM-DD") : "",
                    to: watch("periodoPenultimoTrabajo")?.to || "",
                  },
                  { shouldValidate: true }
                );
              }}
              sx={{
                marginTop: "4px",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "4vh",
                  backgroundColor: mode === "view" ? "#E3E1E6" : "white",
                  color: mode === "view" ? "#949DA4" : "#5D6D7E",
                  flexDirection: "row-reverse",
                  textTransform: "lowercase",
                },
                "& input": {
                  textTransform: "lowercase",
                },
              }}
              slotProps={{
                textField: {
                  placeholder: "Ingrese fecha de inicio",
                  error: !!errors.periodoPenultimoTrabajo,
                },
                inputAdornment: {
                  style: {
                    display: "none",
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>
        {errors.periodoPenultimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.periodoPenultimoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Periodo penúltimo trabajo (fecha final) */}
      <div>
        <LabelTooltip
          label="Periodo penúltimo trabajo (Fecha final)"
          tooltip="Rango de fechas correspondiente al inicio y fin del penúltimo empleo del colaborador."
          htmlFor="periodo-penultimo-trabajo"
        />
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              disabled={mode === "view"}
              format="DD/MM/YYYY"
              maxDate={dayjs(new Date())}
              value={
                watch("periodoPenultimoTrabajo")?.to
                  ? dayjs(watch("periodoPenultimoTrabajo").to)
                  : null
              }
              onChange={(newValue) => {
                setValue(
                  "periodoPenultimoTrabajo",
                  {
                    from: watch("periodoPenultimoTrabajo")?.from || "",
                    to: newValue ? newValue.format("YYYY-MM-DD") : "",
                  },
                  { shouldValidate: true }
                );
              }}
              sx={{
                marginTop: "4px",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "4vh",
                  backgroundColor: mode === "view" ? "#E3E1E6" : "white",
                  color: mode === "view" ? "#949DA4" : "#5D6D7E",
                  flexDirection: "row-reverse",
                  textTransform: "lowercase",
                },
                "& input": {
                  textTransform: "lowercase",
                },
              }}
              slotProps={{
                textField: {
                  placeholder: "Ingrese fecha de inicio",
                  error: !!errors.periodoPenultimoTrabajo,
                },
                inputAdornment: {
                  style: {
                    display: "none",
                  },
                },
              }}
            />
          </LocalizationProvider>
        </div>
        {errors.periodoPenultimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.periodoPenultimoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Penúltimo puesto de trabajo */}
      <div>
        <LabelTooltip
          label="Puesto penúltimo de trabajo"
          tooltip="Nombre del cargo o función que desempeñó el colaborador en el penúltimo trabajo."
          htmlFor="penultimoPuestoTrabajo"
        />
        <Input
          id="penultimoPuestoTrabajo"
          type="text"
          placeholder="Ingrese el penúltimo puesto de trabajo"
          disabled={mode === "view"}
          isError={!!errors.penultimoPuestoTrabajo}
          {...register("penultimoPuestoTrabajo")}
        />
        {errors.penultimoPuestoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.penultimoPuestoTrabajo?.message}
          </span>
        )}
      </div>

      {/* Observaciones penúltimo trabajo */}
      <div>
        <LabelTooltip
          label="Observaciones penúltimo trabajo"
          tooltip="Campo de texto para registrar información complementaria sobre el penúltimo empleo, como responsabilidades, logros o causas de salida."
          htmlFor="observacionesPenultimoTrabajo"
        />
        <Input
          id="observacionesPenultimoTrabajo"
          type="text"
          placeholder="Ingrese observaciones sobre el penúltimo trabajo"
          disabled={mode === "view"}
          isError={!!errors.observacionesPenultimoTrabajo}
          {...register("observacionesPenultimoTrabajo")}
        />
        {errors.observacionesPenultimoTrabajo && (
          <span className="text-[#CF5459] text-xs">
            {errors.observacionesPenultimoTrabajo?.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default HistorialLaboralForm;
