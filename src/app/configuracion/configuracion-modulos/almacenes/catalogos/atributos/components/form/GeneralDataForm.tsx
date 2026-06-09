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

import { useAttributes } from "./AttributesContext";
import {
  firstLetterUppercase,
  onlyNumbers,
  alphanumericNoAccentsRegex,
} from "@/utils/regex";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentAttribute, keyConfig } = useAttributes();
  const {
    watch,
    register,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = generalDataForm;

  const estatusValue = watch("estatus");

  // Asignar valores por defecto en modo "new"
  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true", {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors("estatus");
    }
  }, [mode, setValue, clearErrors]);

  // Cargar datos existentes en modo "edit" o "view"
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentAttribute) {
      setValue("claveAtributo", currentAttribute.id ?? "");
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue("estatus", currentAttribute.estatus ? "true" : "false", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("nombre", currentAttribute.nombre ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("valores", currentAttribute.valores ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });

      trigger(); // Dispara la validación para todos los campos
    }
  }, [mode, currentAttribute, setValue, trigger]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Clave Atributo */}
        <div>
          <LabelTooltip
            label="*Clave Atributo"
            tooltip="Identificador único del atributo usado internamente en la empresa"
            htmlFor="id-attribute"
          />
          <Input
            id="id-attribute"
            type="text"
            placeholder="Ingresa la clave del atributo"
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveAtributo", {
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
                if (mode === "new" && keyConfig?.longitudMaxima) {
                  if (value && value.length > keyConfig.longitudMaxima) {
                    return `La clave no puede exceder los ${keyConfig.longitudMaxima} caracteres`;
                  }
                }
                return true;
              },
            })}
          />
          {errors.claveAtributo && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveAtributo.message}
            </span>
          )}
        </div>

        {/* Prefijo */}
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

        {/* Estatus */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el atributo está activo o inactivo"
            htmlFor="status-area"
          />
          <Select
            {...register("estatus")}
            disabled={mode === "view"}
            value={estatusValue}
            onValueChange={(newValue) => {
              setValue("estatus", newValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("estatus");
            }}
          >
            <SelectTrigger error={!!errors.estatus}>
              <SelectValue placeholder="Selecciona un estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.estatus && (
            <span className="text-[#CF5459] text-xs">
              {errors.estatus.message}
            </span>
          )}
        </div>

        {/* Nombre del atributo */}
        <div>
          <LabelTooltip
            label="*Nombre del atributo"
            tooltip="Ingresa un nombre para el atributo (ej. Color, Tamaño, Peso, etc.)"
            htmlFor="nombre-atributo"
          />
          <Input
            id="nombre-atributo"
            type="text"
            placeholder="Ingresa el nombre del atributo"
            disabled={mode === "view"}
            {...register("nombre", {
              required: "El nombre del atributo es requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre debe iniciar con mayúscula",
              },
              minLength: {
                value: 1,
                message:
                  "El nombre del atributo debe contener al menos 1 carácter",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre del atributo no puede exceder los 100 caracteres",
              },
            })}
          />
          {errors.nombre && (
            <span className="text-[#CF5459] text-xs">
              {errors.nombre.message}
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
