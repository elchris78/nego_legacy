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

import { useCXCs } from "./CXCContext";
import {
  firstLetterUppercase,
  onlyNumbers,
  alphanumericNoAccentsRegex,
} from "@/utils/regex";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentCXC, keyConfig } = useCXCs();
  const {
    watch,
    register,
    setValue,
    clearErrors,
    trigger,
    formState: { errors },
  } = generalDataForm;

  const estatusValue = watch("estatus");

  // Asignar origen por defecto en modo "new"
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
    if ((mode === "edit" || mode === "view") && currentCXC) {
      setValue("claveCXC", currentCXC.id ?? "");
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue("estatus", currentCXC.estatus ? "true" : "false", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("tipoDocumento", currentCXC.tipoDocumento ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("origen", currentCXC.origen ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });

      trigger(); // Dispara la validación para todos los campos
    }
  }, [mode, currentCXC, setValue, trigger]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Clave */}
        <div>
          <LabelTooltip
            label="*Clave del documento"
            tooltip="Identificador único del documento usado internamente en la empresa"
            htmlFor="id-document"
          />
          <Input
            id="id-document"
            type="text"
            placeholder="Ingresa la clave del documento"
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveCXC", {
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
          {errors.claveCXC && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveCXC.message}
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
            tooltip="Selecciona si el documento está activo o inactivo"
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

        {/* Origen */}
        <div>
          <LabelTooltip
            label="Origen"
            tooltip={"Origen del documento \"No reservado\" desde este módulo del sistema."}
            htmlFor="origen-documento"
          />
          <Input
            id="origen-documento"
            type="text"
            placeholder="No reservado"
            disabled={true}
          />
        </div>

        {/* Tipo de Documento CxC */}
        <div>
          <LabelTooltip
            label="*Tipo de Documento CxC"
            tooltip="Ingresa un tipo de documento para el documento."
            htmlFor="tipoDocumento-documento"
          />
          <Input
            id="tipoDocumento-documento"
            type="text"
            placeholder="Ingresa tipo de documento cxc"
            disabled={mode === "view"}
            {...register("tipoDocumento", {
              required: "El tipo de documento es requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El tipo de documento debe iniciar con mayúscula",
              },
              minLength: {
                value: 1,
                message:
                  "El tipo de documento debe contener al menos 1 carácter",
              },
              maxLength: {
                value: 100,
                message:
                  "El tipo de documento no puede exceder los 100 caracteres",
              },
            })}
          />
          {errors.tipoDocumento && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipoDocumento.message}
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
