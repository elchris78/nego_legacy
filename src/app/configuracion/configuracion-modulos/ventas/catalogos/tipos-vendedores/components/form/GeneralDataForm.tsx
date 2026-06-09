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
import { useSellersTypesForm } from "./SellersTypeContext";
import { Textarea } from "@/components/ui/textarea";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentSellersType, keyConfig } =
    useSellersTypesForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
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
    if ((mode === "edit" || mode === "view") && currentSellersType) {
      setValue("userProvidedId", currentSellersType.id ?? "");
      setValue("userProvidedPrefix", keyConfig?.prefijo ?? "");
      setValue("name", currentSellersType.nombre, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("description", currentSellersType.descripcion, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("isActive", currentSellersType.estatus ? "true" : "false", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue(
        "userProvidedId",
        currentSellersType.userProvidedId ?? currentSellersType.id ?? "",
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentSellersType, setValue, trigger]); // Update dependency array

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID tipo de vendedor */}
        <div>
          <LabelTooltip
            label="*Clave tipo de vendedor"
            tooltip="Identificador único del tipo de vendedor para uso interno de la empresa"
            htmlFor="Clave-vendedor-type"
          />
          <Input
            id="Clave-vendedor-type"
            type="text"
            placeholder="Clave Tipo de vendedor"
            value={watch("userProvidedId")}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("userProvidedId", {
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
              minLength: {
                value: 1,
                message: "La clave debe tener al menos 1 caracter",
              },
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
          {errors.userProvidedId && (
            <span className="text-[#CF5459] text-xs">
              {errors.userProvidedId.message}
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
                isError={!!errors.userProvidedPrefix}
                disabled={mode !== "new"}
                {...register("userProvidedPrefix", {
                  required: mode === "new" && "Campo requerido",
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
              {errors.userProvidedPrefix && (
                <span className="text-[#CF5459] text-xs">
                  {errors.userProvidedPrefix.message}
                </span>
              )}
            </div>
          )}

        {/* Estatus */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el tipo de vendedor esta activo o inactivo"
            htmlFor="isActive"
          />
          <Select
            {...register("isActive")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("isActive") ??
              (mode !== "new" ? currentSellersType?.estatus : "true")
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
            label="*Nombre del tipo de vendedor"
            tooltip="Ingresa un nombre representativo para el tipo de vendedor (ej. Por comisión, Temporal, Bajo contrato, etc)."
            htmlFor="name"
          />
          <Input
            id="name"
            type="text"
            placeholder="Ingresa el nombre del tipo de vendedor"
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
            label="*Descripción"
            tooltip="Ingresa la descripción más adecuada para el tipo de vendedor"
            htmlFor="description"
          />
          <Textarea
            id="description"
            placeholder="Ingresa una descripción"
            isError={!!errors.description}
            disabled={mode === "view"}
            {...register("description", {
              required: "Campo requerido",
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
