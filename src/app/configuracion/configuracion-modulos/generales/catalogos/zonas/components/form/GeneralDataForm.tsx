import { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import {
  firstLetterUppercase,
  onlyNumbers,
  alphanumericNoAccentsRegex,
} from "@/utils/regex";
import { useZonasForm } from "./ZonasContext";
import { Textarea } from "@/components/ui/textarea";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentZona, keyConfig } = useZonasForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    trigger, // Destructure trigger from generalDataForm
  } = generalDataForm;

  // Asignar valor por defecto en modo "new"
  useEffect(() => {
    if (mode === "new") {
      setValue("isActive", "true", {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors("isActive");
    }
  }, [mode, setValue]);

  // Asign default values only on editing
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentZona) {
      setValue("claveZona", currentZona.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue("isActive", currentZona?.estatus === true ? "true" : "false");
      setValue("name", currentZona?.nombre);
      setValue("description", currentZona?.descripcion);

      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentZona, setValue, trigger]); // Update dependency array

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Clave zona */}
        <div>
          <LabelTooltip
            label="*Clave Zona"
            tooltip="Identificador único de la zona para uso interna de la empresa"
            htmlFor="id-zona"
          />
          <Input
            id="id-zona"
            type="text"
            placeholder="Clave Zona"
            isError={!!errors.claveZona}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveZona", {
              required:
                mode === "new" &&
                (keyConfig?.tipoClave === "Numérico" ||
                  keyConfig?.tipoClave === "Alfanumérico")
                  ? "La clave es requerida"
                  : false,
              pattern:
                mode === "new"
                  ? {
                      value:
                        keyConfig?.tipoClave === "Alfanumérico"
                          ? alphanumericNoAccentsRegex
                          : onlyNumbers,
                      message:
                        keyConfig?.tipoClave === "Alfanumérico"
                          ? "La clave debe ser alfanumérica"
                          : "La clave debe ser numérica",
                    }
                  : undefined,
              validate: (value) => {
                // Max length only on add
                if (mode === "new" && keyConfig?.longitudMaxima) {
                  if (value && value.length > keyConfig.longitudMaxima) {
                    return `La clave no puede exceder los ${keyConfig.longitudMaxima} caracteres`;
                  }
                }
              },
            })}
          />
          {errors.claveZona && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveZona?.message}
            </span>
          )}
        </div>

        {keyConfig?.tienePrefijo &&
          keyConfig?.tipoPrefijo === "Variable" &&
          mode === "new" && (
            <div>
              <LabelTooltip
                label="*Prefijo"
                tooltip="Ingresa el prefijo personalizado"
                htmlFor="prefix-input"
              />
              <Input
                id="prefix-input"
                type="text"
                placeholder="Prefijo personalizado"
                isError={!!errors.prefix}
                disabled={mode !== "new"}
                {...register("prefix", {
                  required: "Campo requerido",
                  pattern: {
                    value: alphanumericNoAccentsRegex,
                    message: "El prefijo debe ser alfanumérico",
                  },
                  maxLength: {
                    value: 3,
                    message: "El prefijo no puede exceder los 3 caracteres",
                  },
                })}
              />
              {errors.prefix && (
                <span className="text-[#CF5459] text-xs">
                  {errors.prefix.message}
                </span>
              )}
            </div>
          )}

        {/* Estatus zona */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la categoría del producto esta activa o inactiva"
            htmlFor="status-zona"
          />
          <Select
            {...register("isActive")}
            onValueChange={(newValue) => {
              setValue("isActive", newValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("isActive");
            }}
            value={
              generalDataForm.watch("isActive") ??
              (mode !== "new"
                ? currentZona?.estatus
                  ? "true"
                  : "false"
                : "true")
            }
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.isActive}>
              <SelectValue placeholder="Selecciona un estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"true"}>Activo</SelectItem>
                <SelectItem value={"false"}>Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.isActive && (
            <span className="text-[#CF5459] text-xs">
              {errors.isActive?.message}
            </span>
          )}
        </div>

        {/* Nombre de la zona */}
        <div>
          <LabelTooltip
            label="*Nombre de la zona"
            tooltip="Ingresa un nombre representativo para esta zona (ej. Norte CDMX, Zona Centro, Bajío)."
            htmlFor="name-zona"
          />
          <Input
            id="name-zona"
            type="text"
            placeholder="Ingresa el nombre de la zona"
            isError={!!errors.name}
            disabled={mode === "view"}
            {...register("name", {
              required: "El nombre de la zona es requerido",
              minLength: {
                value: 3,
                message:
                  "El nombre de la zona debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre de la zona debe tener como máximo 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre de la zona debe iniciar con mayúscula",
              },
            })}
          />
          {errors.name && (
            <span className="text-[#CF5459] text-xs">
              {errors.name?.message}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div>
          <LabelTooltip
            label="Descripción"
            tooltip="Ingresa la descripción más adecuada para la zona"
            htmlFor="description-zona"
          />
          <Textarea
            id="description-zona"
            placeholder="Ingresa una descripción (opcional)"
            disabled={mode === "view"}
            isError={!!errors.description}
            {...register("description", {
              minLength: {
                value: 5,
                message: "La descripción debe tener al menos 5 caracteres",
              },
              maxLength: {
                value: 300,
                message: "La descripción no puede exceder los 300 caracteres",
              },
            })}
          />
          {errors.description && (
            <span className="text-[#CF5459] text-xs">
              {errors.description?.message}
            </span>
          )}
        </div>
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm">
        * Campos obligatorios
      </span>
    </>
  );
};

export default GeneralDataForm;
