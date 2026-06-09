"use client";

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
import {
  alphanumericNoAccentsRegex,
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Textarea } from "@/components/ui/textarea";
import { useClientClassifications } from "./ClientClassificationsContext";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentClientClassification, keyConfig } =
    useClientClassifications();
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

  // Asignar valores en modo "edit" o "view"
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentClientClassification) {
      setValue("claveClasificacion", currentClientClassification.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue(
        "isActive",
        currentClientClassification?.estatus === true ? "true" : "false"
      );
      setValue("name", currentClientClassification?.nombre!);
      setValue("description", currentClientClassification?.descripcion!);

      trigger(); // Trigger validation to show errors if any
    }
  }, [mode, currentClientClassification, setValue, trigger]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID clasificación */}
        <div>
          <LabelTooltip
            label="*Clave Clasificación"
            tooltip="Identificador único de la clasificación de cliente usado internamente en la empresa"
            htmlFor="id-clasification"
          />
          <Input
            id="id-clasification"
            type="text"
            placeholder="Clave Clasificación"
            isError={!!errors.claveClasificacion}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveClasificacion", {
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
          {errors.claveClasificacion && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveClasificacion?.message}
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

        {/* Estatus de la clasificación */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la clasificación esta activa o inactiva"
            htmlFor="status-area"
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
                ? currentClientClassification?.estatus
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

        {/* Nombre de la clasificación */}
        <div>
          <LabelTooltip
            label="*Nombre de la clasificación"
            tooltip="Nombre asignado a la clasificación del cliente (por ejemplo: Premium, Frecuente, Nuevo)."
            htmlFor="name-clasification"
          />
          <Input
            id="name-clasification"
            type="text"
            placeholder="Ingresa el nombre del grupo"
            isError={!!errors.name}
            {...register("name", {
              required: "El nombre de la clasificación es requerido",
              minLength: {
                value: 3,
                message:
                  "El nombre de la clasificación debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre de la clasificación no puede exceder los 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message:
                  "El nombre de la clasificación debe comenzar con una letra mayúscula",
              },
            })}
            disabled={mode === "view"}
          />
          {errors.name && (
            <span className="text-[#CF5459] text-xs">
              {errors.name?.message}
            </span>
          )}
        </div>

        {/* Descripción de la clasificación */}
        <div>
          <LabelTooltip
            label="Descripción"
            tooltip="Breve explicación del criterio o propósito de esta clasificación."
            htmlFor="description-clasification-client"
          />
          <Textarea
            className="h-auto"
            id="description-clasification-client"
            placeholder="Ingresa la descripción"
            isError={!!errors.description}
            disabled={mode === "view"}
            {...register("description", {
              required: false,
              maxLength: {
                value: 200,
                message:
                  "La descripción no puede contener más de 200 caracteres.",
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
