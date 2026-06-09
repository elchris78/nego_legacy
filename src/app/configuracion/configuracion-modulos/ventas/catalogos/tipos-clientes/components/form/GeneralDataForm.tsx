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
  alphanumericNoAccentsRegex,
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { useClientTypesForm } from "./ClientTypeContext";
import { Textarea } from "@/components/ui/textarea";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentClientType, keyConfig } =
    useClientTypesForm();
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
    if ((mode === "edit" || mode === "view") && currentClientType) {
      setValue("claveTipoCliente", currentClientType.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue("name", currentClientType.nombre, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("description", currentClientType.descripcion, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("isActive", currentClientType.estatus ? "true" : "false", {
        shouldValidate: true,
        shouldDirty: true,
      });

      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentClientType, setValue, trigger]); // Update dependency array

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID tipo de cliente */}
        <div>
          <LabelTooltip
            label="*Clave tipo de cliente"
            tooltip="Identificador único del tipo de cliente para uso interno de la empresa"
            htmlFor="id-client-type"
          />
          <Input
            id="id-client-type"
            type="text"
            placeholder="Clave Tipo de cliente"
            isError={!!errors.claveTipoCliente}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveTipoCliente", {
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
          {errors.claveTipoCliente && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveTipoCliente.message}
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
            tooltip="Selecciona si el tipo de cliente está activo o inactivo"
            htmlFor="isActive"
          />
          <Select
            {...register("isActive")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("isActive") ??
              (mode !== "new" ? currentClientType?.estatus : "true")
            }
            onValueChange={(value) => {
              setValue("isActive", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("isActive");
            }}
          >
            <SelectTrigger error={!!errors.isActive}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.isActive && (
            <span className="text-[#CF5459] text-xs">
              {errors.isActive?.message}
            </span>
          )}
        </div>

        {/* Nombre */}
        <div>
          <LabelTooltip
            label="*Nombre del tipo de cliente"
            tooltip="Ingresa el nombre del tipo de cliente"
            htmlFor="name"
          />
          <Input
            id="name"
            type="text"
            placeholder="Ingresa el nombre del tipo de cliente"
            isError={!!errors.name}
            disabled={mode === "view"}
            {...register("name", {
              required: "Campo requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre debe comenzar con mayúscula",
              },
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El nombre no puede exceder los 100 caracteres",
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
            tooltip="Describe brevemente el tipo de cliente"
            htmlFor="description"
          />
          <Textarea
            id="description"
            placeholder="Ingresa una descripción"
            isError={!!errors.description}
            disabled={mode === "view"}
            {...register("description", {
              maxLength: {
                value: 200,
                message: "La descripción no puede exceder los 200 caracteres",
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
