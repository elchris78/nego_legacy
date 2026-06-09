import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import ComboBox from "@/components/ui/combobox";

const DatosLaboralesForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const {
    datosLaboralesForm,
    banksOptions,
    puestosOptions,
    departamentosOptions,
    colaboradoresOptions,
  } = useColaboradorFormContext();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch, // Watch for form values
  } = datosLaboralesForm;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Puesto */}
        <div>
          <LabelTooltip
            label="Puesto"
            tooltip="Nombre del cargo o función asignada al colaborador dentro de la organización. Seleccionable mediante lista desplegable con buscador."
            htmlFor="puestos-colaborador"
          />
          <ComboBox
            options={puestosOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.puesto}
            defaultValue={datosLaboralesForm.getValues("puesto") || undefined}
            onSelect={(value) => {
              setValue("puesto", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("puesto");
            }}
            disabled={mode === "view"}
            {...register("puesto")}
          />
        </div>

        {/* Departamento */}
        <div>
          <LabelTooltip
            label="Departamento"
            tooltip="Área organizacional a la que pertenece el colaborador. Determina su ubicación funcional dentro de la estructura de la empresa."
            htmlFor="departamentos-colaborador"
          />
          <ComboBox
            options={departamentosOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.departamento}
            defaultValue={
              datosLaboralesForm.getValues("departamento") || undefined
            }
            onSelect={(value) => {
              setValue("departamento", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("departamento");
            }}
            disabled={mode === "view"}
            {...register("departamento")}
          />
        </div>

        {/* Supervisor directo */}
        <div>
          <LabelTooltip
            label="Supervisor directo"
            tooltip="Persona responsable de la supervisión directa del colaborador. Seleccionable mediante lista desplegable con buscador"
            htmlFor="supervisores-colaborador"
          />
          <ComboBox
            options={colaboradoresOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.supervisorDirecto}
            defaultValue={
              datosLaboralesForm.getValues("supervisorDirecto") || undefined
            }
            onSelect={(value) => {
              setValue("supervisorDirecto", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("supervisorDirecto");
            }}
            disabled={mode === "view"}
            {...register("supervisorDirecto")}
          />
          {errors.supervisorDirecto && (
            <span className="text-[#CF5459] text-xs">
              {errors.supervisorDirecto?.message}
            </span>
          )}
        </div>

        {/* Fecha de contratación */}
        <div>
          <LabelTooltip
            label="Fecha de contratación"
            tooltip="Fecha en la que se formalizó la relación laboral entre el colaborador y la organización."
            htmlFor="fechaContratacion"
          />
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                disabled={mode === "view"}
                format="DD/MM/YYYY"
                maxDate={dayjs(new Date())}
                {...register("fechaContratacion", {
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true;
                      const date = dayjs(value);
                      const today = dayjs();

                      if (!date.isValid()) {
                        return "Fecha inválida";
                      }

                      if (date.isAfter(today)) {
                        return "La fecha no puede ser futura";
                      }

                      return true;
                    },
                  },
                })}
                sx={{
                  marginTop: "4px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "4.5vh",
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
                    placeholder: "Ingrese fecha de contratación",
                    error: !!errors.fechaContratacion,
                  },
                  inputAdornment: {
                    style: {
                      display: "none", // Oculta el icono de calendario
                    },
                  },
                }}
                value={
                  watch("fechaContratacion")
                    ? dayjs(watch("fechaContratacion"))
                    : null
                }
                onChange={(newValue) => {
                  setValue(
                    "fechaContratacion",
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                    { shouldValidate: true }
                  );
                }}
              />
            </LocalizationProvider>
          </div>
          {errors.fechaContratacion && (
            <span className="text-[#CF5459] text-xs">
              {errors.fechaContratacion?.message}
            </span>
          )}
        </div>

        {/* Fecha de ingreso */}
        <div>
          <LabelTooltip
            label="Fecha de ingreso"
            tooltip="Fecha efectiva en la que el colaborador comenzó o comenzará a desempeñar sus funciones laborales."
            htmlFor="fechaIngreso"
          />
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                disabled={mode === "view"}
                format="DD/MM/YYYY"
                maxDate={dayjs(new Date())}
                {...register("fechaIngreso", {
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true;
                      const date = dayjs(value);
                      const today = dayjs();

                      if (!date.isValid()) {
                        return "Fecha inválida";
                      }

                      if (date.isAfter(today)) {
                        return "La fecha no puede ser futura";
                      }

                      // Para fechaIngreso
                      const fechaFinValue = watch("fechaFin");
                      if (fechaFinValue) {
                        const fechaFin = dayjs(fechaFinValue);
                        if (fechaFin.isValid() && date.isAfter(fechaFin)) {
                          return "La fecha de ingreso debe ser anterior a la fecha de fin";
                        }
                      }

                      // Para fechaFin
                      const fechaIngresoValue = watch("fechaIngreso");
                      if (fechaIngresoValue) {
                        const fechaIngreso = dayjs(fechaIngresoValue);
                        if (
                          fechaIngreso.isValid() &&
                          date.isBefore(fechaIngreso)
                        ) {
                          return "La fecha de fin debe ser posterior a la fecha de ingreso";
                        }
                      }

                      return true;
                    },
                  },
                })}
                sx={{
                  marginTop: "4px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "4.5vh",
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
                    placeholder: "Ingrese fecha de ingreso",
                    error: !!errors.fechaIngreso,
                  },
                  inputAdornment: {
                    style: {
                      display: "none", // Oculta el icono de calendario
                    },
                  },
                }}
                value={
                  watch("fechaIngreso") ? dayjs(watch("fechaIngreso")) : null
                }
                onChange={(newValue) => {
                  setValue(
                    "fechaIngreso",
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                    { shouldValidate: true }
                  );
                }}
              />
            </LocalizationProvider>
          </div>
          {errors.fechaIngreso && (
            <span className="text-[#CF5459] text-xs">
              {errors.fechaIngreso?.message}
            </span>
          )}
        </div>

        {/* Fecha de fin */}
        <div>
          <LabelTooltip
            label="Fecha de fin"
            tooltip="Fecha en la que concluye o está prevista la finalización de la relación laboral. Puede usarse para contratos temporales o bajas."
            htmlFor="fechaFin"
          />
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                disabled={mode === "view"}
                format="DD/MM/YYYY"
                minDate={dayjs(watch("fechaIngreso"))}
                maxDate={dayjs(new Date())}
                {...register("fechaFin", {
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true;
                      const date = dayjs(value);
                      const today = dayjs();

                      if (!date.isValid()) {
                        return "Fecha inválida";
                      }

                      // Para fechaIngreso
                      const fechaFinValue = watch("fechaFin");
                      if (fechaFinValue) {
                        const fechaFin = dayjs(fechaFinValue);
                        if (fechaFin.isValid() && date.isAfter(fechaFin)) {
                          return "La fecha de ingreso debe ser anterior a la fecha de fin";
                        }
                      }

                      // Para fechaFin
                      const fechaIngresoValue = watch("fechaIngreso");
                      if (fechaIngresoValue) {
                        const fechaIngreso = dayjs(fechaIngresoValue);
                        if (
                          fechaIngreso.isValid() &&
                          date.isBefore(fechaIngreso)
                        ) {
                          return "La fecha de fin debe ser posterior a la fecha de ingreso";
                        }
                      }
                      return true;
                    },
                  },
                })}
                sx={{
                  marginTop: "4px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "4.5vh",
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
                    error: !!errors.fechaFin,
                  },
                  inputAdornment: {
                    style: {
                      display: "none", // Oculta el icono de calendario
                    },
                  },
                }}
                value={watch("fechaFin") ? dayjs(watch("fechaFin")) : null}
                onChange={(newValue) => {
                  setValue(
                    "fechaFin",
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                    { shouldValidate: true }
                  );
                }}
              />
            </LocalizationProvider>
          </div>
          {errors.fechaFin && (
            <span className="text-[#CF5459] text-xs">
              {errors.fechaFin?.message}
            </span>
          )}
        </div>

        {/* Horario de trabajo */}
        <div>
          <LabelTooltip
            label="Horario de trabajo"
            tooltip="Descripción del régimen de horas laborales asignadas al colaborador. Puede incluir días de la semana, turnos o jornadas específicas."
            htmlFor="horarioTrabajo"
          />
          <Input
            type="text"
            placeholder="Ingrese horario de trabajo"
            disabled={mode === "view"}
            isError={!!errors.horarioTrabajo}
            {...register("horarioTrabajo", {
              pattern: {
                value: /^[0-9]{1,2}:[0-9]{2} - [0-9]{1,2}:[0-9]{2}$/,
                message: "Formato inválido. Ejemplo: 09:00 - 17:00",
              },
            })}
          />
          {errors.horarioTrabajo && (
            <span className="text-[#CF5459] text-xs">
              {errors.horarioTrabajo?.message}
            </span>
          )}
        </div>

        {/* Número de cuenta bancaria */}
        <div>
          <LabelTooltip
            label="Número de cuenta bancaria"
            tooltip="Número asignado por la institución financiera para identificar la cuenta del colaborador, utilizada para depósitos de nómina o pagos."
            htmlFor="numeroCuentaBancaria"
          />
          <Input
            type="text"
            placeholder="Ingrese número de cuenta bancaria"
            disabled={mode === "view"}
            isError={!!errors.numeroCuentaBancaria}
            {...register("numeroCuentaBancaria", {
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Formato inválido. Debe tener 10 dígitos",
              },
            })}
          />
          {errors.numeroCuentaBancaria && (
            <span className="text-[#CF5459] text-xs">
              {errors.numeroCuentaBancaria?.message}
            </span>
          )}
        </div>

        {/* Bancos */}
        <div>
          <LabelTooltip
            label="Banco"
            tooltip="Nombre de la institución financiera donde el colaborador tiene registrada su cuenta. Seleccionable mediante lista desplegable con buscador."
            htmlFor="banco-colaborador"
          />
          <ComboBox
            options={banksOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.banco}
            defaultValue={datosLaboralesForm.getValues("banco") || undefined}
            onSelect={(value) => {
              setValue("banco", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("banco");
            }}
            disabled={mode === "view"}
            {...register("banco")}
          />
        </div>
      </div>
    </>
  );
};

export default DatosLaboralesForm;
