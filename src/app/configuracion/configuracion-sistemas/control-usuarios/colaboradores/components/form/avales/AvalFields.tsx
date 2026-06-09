"use client";

import { useEffect, useRef, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FieldArrayWithId } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import dayjs from "dayjs";

import { AvalColaboradorFormValues } from "../../../services/colaboradoresFormsTypes";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { onlyNumbers } from "@/lib/utils/regex";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import { usePostalCodeOptions } from "../../../hooks/usePostalCodeOptions";
import ComboBox from "@/components/ui/combobox";

interface Props {
  field: FieldArrayWithId<AvalColaboradorFormValues, "avales", "id">;
  idx: number;
}

const AvalFields = ({ field, idx }: Props) => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token");

  const { avalColaboradorForm, countriesOptions } = useColaboradorFormContext();

  const {
    postalCodeOptions,
    fetchPostalCodeOptions,
    isLoading: isLoadingColonias,
  } = usePostalCodeOptions();

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    resetField,
    setError,
  } = avalColaboradorForm;

  const [debouncedCP, setDebouncedCP] = useState(
    watch("avales")[idx].codigoPostal
  );

  const [enableManualFields, setEnableManualFields] = useState({
    estado: false,
    ciudad: false,
    colonia: false,
  });

  // Debounce para el código postal
  // Esto evita que se haga una solicitud cada vez que el usuario escribe
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCP(watch("avales")[idx].codigoPostal);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [watch("avales")[idx].codigoPostal]);

  useEffect(() => {
    if (!debouncedCP || !token) return;
    if (debouncedCP.length !== 5) return;
    if (watch(`avales.${idx}.pais`) !== "MEX") return;

    // Guarda el valor anterior de colonia
    const prevColonia = watch("avales")[idx].colonia;
    const prevEstado = watch("avales")[idx].estado;
    const prevCiudad = watch("avales")[idx].ciudad;

    fetchPostalCodeOptions(debouncedCP, token)
      .then((resp) => {
        if (resp.estados.length > 0) {
          setValue(
            `avales.${idx}.estado`,
            resp.estados[0]?.nombre || prevEstado || ""
          );
        } else {
          setValue(`avales.${idx}.estado`, prevEstado || "");
        }

        if (resp.ciudades.length > 0) {
          setValue(
            `avales.${idx}.ciudad`,
            resp.ciudades[0]?.nombre || prevCiudad || ""
          );
        } else {
          setValue(`avales.${idx}.ciudad`, prevCiudad || "");
        }

        if (
          prevColonia &&
          resp.colonias.some((col) => col.clave === prevColonia)
        ) {
          setValue(`avales.${idx}.colonia`, prevColonia, {
            shouldValidate: true,
          });
        } else if (resp.colonias.length === 0) {
          // No hacer nada para no borrar la entrada manual
        } else {
          setValue(`avales.${idx}.colonia`, "");
        }

        if (resp.estados.length > 0 && resp.estados[0].nombre) {
          clearErrors(`avales.${idx}.estado`);
        }

        if (resp.ciudades.length > 0 && resp.ciudades[0].nombre) {
          clearErrors(`avales.${idx}.ciudad`);
        }

        setEnableManualFields({
          estado: resp.estados.length === 0,
          ciudad: resp.ciudades.length === 0,
          colonia: resp.colonias.length === 0,
        });
      })
      .catch(() => {
        setError(`avales.${idx}.codigoPostal`, {
          type: "manual",
          message: "Error al obtener las opciones de código postal",
        });

        setEnableManualFields({
          estado: true,
          ciudad: true,
          colonia: true,
        });
      });
  }, [debouncedCP, token, watch(`avales.${idx}.pais`)]);

  // Resetea los campos de estado, ciudad y colonia si el país cambia
  const prevPais = useRef(watch(`avales.${idx}.pais`));
  useEffect(() => {
    const currentPais = watch(`avales.${idx}.pais`);
    if (prevPais.current === "MEX" && currentPais !== "MEX") {
      // Si el país cambia, resetea los campos relacionados
      resetField(`avales.${idx}.colonia`);
      resetField(`avales.${idx}.estado`);
      resetField(`avales.${idx}.ciudad`);
      resetField(`avales.${idx}.codigoPostal`);
    }
  }, [watch(`avales.${idx}.pais`)]);

  // Resetea la colonia si el código postal cambia y el país es México
  const prevCP = useRef(watch(`avales.${idx}.codigoPostal`));
  useEffect(() => {
    const currentCP = watch(`avales.${idx}.codigoPostal`);
    const pais = watch(`avales.${idx}.pais`);
    if (prevCP.current && prevCP.current !== currentCP && pais === "MEX") {
      setValue(`avales.${idx}.colonia`, "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    prevCP.current = currentCP;
  }, [watch(`avales.${idx}.codigoPostal`), watch(`avales.${idx}.pais`)]);

  // Utilidad para saber si hay algún campo con valor
  const anyFieldFilled = () => {
    const fields = watch(`avales.${idx}`);
    return Object.values(fields).some((v) => v && v !== "");
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Nombre completo del aval */}
      <div>
        <LabelTooltip
          label="*Nombre completo del aval"
          htmlFor={`avales.${idx}.nombreCompleto`}
        />
        <Input
          id={`avales.${idx}.nombreCompleto`}
          type="text"
          placeholder="Ingresa el nombre completo del aval"
          isError={!!errors.avales?.[idx]?.nombreCompleto}
          disabled={mode === "view"}
          {...register(`avales.${idx}.nombreCompleto`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El nombre completo del aval es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.nombreCompleto && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].nombreCompleto.message}
          </span>
        )}
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <LabelTooltip
          label="*Fecha de nacimiento"
          htmlFor={`avales.${idx}.fechaNacimiento`}
        />
        <div className="relative">
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              disabled={mode === "view"}
              format="DD/MM/YYYY"
              maxDate={dayjs(new Date())}
              {...register(`avales.${idx}.fechaNacimiento`, {
                validate: (value) => {
                  if (anyFieldFilled() && !value) {
                    return "La fecha de nacimiento es obligatoria";
                  }

                  if (value) {
                    const date = dayjs(value);
                    const today = dayjs();
                    if (!date.isValid()) {
                      return "Fecha inválida";
                    }
                    if (date.isAfter(today)) {
                      return "La fecha de nacimiento no puede ser futura";
                    }
                  }

                  return true;
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
                  error: !!errors.avales?.[idx]?.fechaNacimiento,
                },
                inputAdornment: {
                  style: {
                    display: "none", // Oculta el icono de calendario
                  },
                },
              }}
              value={
                watch(`avales.${idx}.fechaNacimiento`)
                  ? dayjs(watch(`avales.${idx}.fechaNacimiento`))
                  : null
              }
              onChange={(newValue) => {
                setValue(
                  `avales.${idx}.fechaNacimiento`,
                  newValue ? newValue.format("YYYY-MM-DD") : "",
                  { shouldValidate: true }
                );
              }}
            />
          </LocalizationProvider>
        </div>
        {errors.avales?.[idx]?.fechaNacimiento && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales?.[idx]?.fechaNacimiento?.message}
          </span>
        )}
      </div>

      {/* Pais */}
      <div>
        <LabelTooltip label="*País" htmlFor={`avales.${idx}.pais`} />
        <ComboBox
          options={countriesOptions}
          placeholder="Selecciona una opción"
          hasError={!!errors.avales?.[idx]?.pais}
          defaultValue={
            avalColaboradorForm.getValues(`avales.${idx}.pais`) || undefined
          }
          onSelect={(value) => {
            setValue(`avales.${idx}.pais`, value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            clearErrors(`avales.${idx}.pais`);
          }}
          disabled={mode === "view"}
          {...register(`avales.${idx}.pais`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El país es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.pais && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales?.[idx]?.pais?.message}
          </span>
        )}
      </div>

      {/* Código postal */}
      <div>
        <LabelTooltip
          label="*Código postal"
          htmlFor={`avales.${idx}.codigoPostal`}
        />
        <Input
          id={`avales.${idx}.codigoPostal`}
          type="text"
          placeholder="Ingrese código postal"
          isError={!!errors.avales?.[idx]?.codigoPostal}
          disabled={mode === "view"}
          {...register(`avales.${idx}.codigoPostal`, {
            // required: "El código postal es obligatorio",
            pattern: {
              value: onlyNumbers,
              message: "El código postal debe ser numérico",
            },
            minLength: {
              value: 5,
              message: "El código postal debe tener al menos 5 dígitos",
            },
            maxLength: {
              value: 5,
              message: "El código postal no puede tener más de 5 dígitos",
            },
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El código postal es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.codigoPostal && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].codigoPostal.message}
          </span>
        )}
      </div>

      {/* Estado */}
      <div>
        <LabelTooltip label="*Estado" htmlFor={`avales.${idx}.estado`} />
        <Input
          id={`avales.${idx}.estado`}
          type="text"
          placeholder={
            watch(`avales.${idx}.pais`) === "MEX" && !enableManualFields.estado
              ? "Complete el campo 'Código postal'"
              : "Ingrese el estado"
          }
          isError={!!errors.avales?.[idx]?.estado}
          disabled={
            mode === "view" ||
            !watch(`avales.${idx}.pais`) ||
            (watch(`avales.${idx}.pais`) === "MEX" &&
              !enableManualFields.estado)
          }
          {...register(`avales.${idx}.estado`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El estado es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.estado && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].estado.message}
          </span>
        )}
      </div>

      {/* Ciudad */}
      <div>
        <LabelTooltip label="*Ciudad" htmlFor={`avales.${idx}.ciudad`} />
        <Input
          id={`avales.${idx}.ciudad`}
          type="text"
          placeholder={
            watch(`avales.${idx}.pais`) === "MEX" && !enableManualFields.ciudad
              ? "Complete el campo 'Código postal'"
              : "Ingrese la ciudad"
          }
          isError={!!errors.avales?.[idx]?.ciudad}
          disabled={
            mode === "view" ||
            !watch(`avales.${idx}.pais`) ||
            (watch(`avales.${idx}.pais`) === "MEX" &&
              !enableManualFields.ciudad)
          }
          {...register(`avales.${idx}.ciudad`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "La ciudad es obligatoria";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.ciudad && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].ciudad.message}
          </span>
        )}
      </div>

      {/* Colonia */}
      <div>
        <LabelTooltip label="*Colonia" htmlFor={`avales.${idx}.colonia`} />
        {watch(`avales.${idx}.pais`) !== "MEX" || enableManualFields.colonia ? (
          <Input
            id={`avales.${idx}.colonia`}
            type="text"
            placeholder="Ingrese la colonia"
            isError={!!errors.avales?.[idx]?.colonia}
            disabled={
              mode === "view" ||
              !watch(`avales.${idx}.pais`) ||
              (watch(`avales.${idx}.pais`) === "MEX" &&
                !enableManualFields.colonia)
            }
            {...register(`avales.${idx}.colonia`, {
              validate: (value) => {
                if (anyFieldFilled() && !value) {
                  return "La colonia es obligatoria";
                }
                return true;
              },
            })}
          />
        ) : (
          <ComboBox
            options={postalCodeOptions?.colonias || []}
            placeholder="Selecciona una colonia"
            hasError={!!errors.avales?.[idx]?.colonia}
            value={watch(`avales.${idx}.colonia`) || ""}
            onSelect={(value) => {
              setValue(`avales.${idx}.colonia`, value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors(`avales.${idx}.colonia`);
            }}
            disabled={
              mode === "view" ||
              !watch(`avales.${idx}.codigoPostal`) ||
              isLoadingColonias
            }
            {...register(`avales.${idx}.colonia`, {
              validate: (value) => {
                if (anyFieldFilled() && !value) {
                  return "La colonia es obligatoria";
                }
                return true;
              },
            })}
          />
        )}
        {errors.avales?.[idx]?.colonia && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].colonia.message}
          </span>
        )}
      </div>

      {/* Calle */}
      <div>
        <LabelTooltip label="*Calle" htmlFor={`avales.${idx}.calle`} />
        <Input
          id={`avales.${idx}.calle`}
          type="text"
          placeholder="Ingresa la calle"
          isError={!!errors.avales?.[idx]?.calle}
          disabled={mode === "view"}
          {...register(`avales.${idx}.calle`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "La calle es obligatoria";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.calle && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].calle.message}
          </span>
        )}
      </div>

      {/* Número exterior */}
      <div>
        <LabelTooltip
          label="*Número exterior"
          htmlFor={`avales.${idx}.numeroExterior`}
        />
        <Input
          id={`avales.${idx}.numeroExterior`}
          type="text"
          placeholder="Ingresa el número exterior"
          isError={!!errors.avales?.[idx]?.numeroExterior}
          disabled={mode === "view"}
          {...register(`avales.${idx}.numeroExterior`, {
            // required: "El número exterior es obligatorio",
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El número exterior es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.numeroExterior && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].numeroExterior.message}
          </span>
        )}
      </div>

      {/* Número interior */}
      <div>
        <LabelTooltip
          label="*Número interior"
          htmlFor={`avales.${idx}.numeroInterior`}
        />
        <Input
          id={`avales.${idx}.numeroInterior`}
          type="text"
          placeholder="Ingresa el número interior"
          isError={!!errors.avales?.[idx]?.numeroInterior}
          disabled={mode === "view"}
          {...register(`avales.${idx}.numeroInterior`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El número interior es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.numeroInterior && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].numeroInterior.message}
          </span>
        )}
      </div>

      {/* Teléfono del aval */}
      <div>
        <LabelTooltip label="*Teléfono" htmlFor={`avales.${idx}.telefono`} />
        <Input
          id={`avales.${idx}.telefono`}
          type="text"
          placeholder="Ingresa el teléfono"
          isError={!!errors.avales?.[idx]?.telefono}
          disabled={mode === "view"}
          {...register(`avales.${idx}.telefono`, {
            validate: (value) => {
              if (anyFieldFilled() && !value) {
                return "El teléfono es obligatorio";
              }
              return true;
            },
          })}
        />
        {errors.avales?.[idx]?.telefono && (
          <span className="text-[#CF5459] text-xs">
            {errors.avales[idx].telefono.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default AvalFields;
