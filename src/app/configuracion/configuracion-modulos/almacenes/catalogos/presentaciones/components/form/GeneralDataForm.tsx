import { useEffect, useState } from "react";

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
  lettersNumbersSpecialsFirstUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { usePresentacionesForm } from "./PresentacionesFormContext";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { generalDataForm, currentPresentaciones, keyConfig } =
    usePresentacionesForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = generalDataForm;

  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true");
    }
  }, [mode, setValue]);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentPresentaciones) {
      setValue("clavePresentacion", currentPresentaciones.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue(
        "estatus",
        currentPresentaciones?.estatus === true ? "true" : "false"
      );
      setValue("descripcion", currentPresentaciones?.descripcion!);

      generalDataForm.trigger(); // Trigger validation to show errors if any
    }
  }, [mode, currentPresentaciones, setValue, generalDataForm]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID de La Descripción */}
        <div>
          <LabelTooltip
            label="*Clave Presentación"
            tooltip="Identificador único de la Presentación para uso interno de la empresa"
            htmlFor="id-presentación"
          />
          <Input
            id="id-presentación"
            type="text"
            placeholder="Clave Presentación"
            isError={!!errors.clavePresentacion}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("clavePresentacion", {
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
          {errors.clavePresentacion && (
            <span className="text-[#CF5459] text-xs">
              {errors.clavePresentacion?.message}
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

        {/* Estatus de La Descripción */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la Presentación esta activa o inactiva"
            htmlFor="status-puestos"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("estatus", newValue);
              clearErrors("estatus");
            }}
            {...register("estatus", {
              required: "El estatus de la presentación",
            })}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new"
                ? currentPresentaciones?.estatus === true
                  ? "true"
                  : "false"
                : "true")
            }
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.estatus}>
              <SelectValue placeholder="Selecciona un estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"true"}>Activo</SelectItem>
                <SelectItem value={"false"}>Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.estatus && (
            <span className="text-[#CF5459] text-xs">
              {errors.estatus?.message}
            </span>
          )}
        </div>

        {/* Nombre del La Descripción */}
        <div>
          <LabelTooltip
            label="*Descripción"
            tooltip="Describe brevemente la presentación"
            htmlFor="name-estatus"
          />
          <Input
            id="name-Descripción"
            type="text"
            placeholder="Ingresa la descripción"
            isError={!!errors.descripcion}
            {...register("descripcion", {
              required: "La Descripción es requerida",
              minLength: {
                value: 3,
                message: "La Descripción debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La Descripción no puede exceder los 100 caracteres",
              },
              pattern: {
                value: lettersNumbersSpecialsFirstUppercase,
                message: "La Descripción debe iniciar con mayúscula",
              },
            })}
            disabled={mode === "view"}
          />
          {errors.descripcion && (
            <span className="text-[#CF5459] text-xs">
              {errors.descripcion?.message}
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
