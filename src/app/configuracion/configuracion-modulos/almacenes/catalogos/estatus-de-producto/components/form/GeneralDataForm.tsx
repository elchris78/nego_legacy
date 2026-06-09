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
  lettersNumbersSpecialsFirstUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useEstatusProdForm } from "./EstatusProdFormContext";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { generalDataForm, currentEstatusProd, keyConfig } =
    useEstatusProdForm();
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
    if ((mode === "edit" || mode === "view") && currentEstatusProd) {
      setValue("claveEstatus", currentEstatusProd.id);
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue(
        "estatus",
        currentEstatusProd?.estatus === true ? "true" : "false"
      );
      setValue("nombre", currentEstatusProd?.nombre!);

      generalDataForm.trigger(); // Trigger validation to show errors if any
    }
  }, [mode, currentEstatusProd, setValue, generalDataForm]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID del Estatus */}
        <div>
          <LabelTooltip
            label="*Clave Estatus de producto"
            tooltip="Identificador único del Estatus de producto para uso interno de la empresa"
            htmlFor="id-estatus"
          />
          <Input
            id="id-estatus"
            type="text"
            placeholder="Clave estatus"
            isError={!!errors.claveEstatus}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveEstatus", {
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
          {errors.claveEstatus && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveEstatus?.message}
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

        {/* Estatus del Estatus */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el Estatus de producto esta activo o inactivo"
            htmlFor="status-producto"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("estatus", newValue);
              clearErrors("estatus");
            }}
            {...register("estatus", {
              required: "El estatus del usuario es requerido",
            })}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new"
                ? currentEstatusProd?.estatus === true
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

        {/* Nombre del Estatus */}
        <div>
          <LabelTooltip
            label="*Nombre del estatus de producto"
            tooltip="Ingresa un nombre claro y descriptivo para el estatus del producto."
            htmlFor="name-estatus"
          />
          <Input
            id="name-estatus"
            type="text"
            placeholder="Ingresa el nombre del estatus del producto"
            isError={!!errors.nombre}
            {...register("nombre", {
              required: "El nombre del estatus del producto es requerido",
              minLength: {
                value: 3,
                message:
                  "El nombre del estatus del producto debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre del estatus del producto no puede exceder los 100 caracteres",
              },
              pattern: {
                value: lettersNumbersSpecialsFirstUppercase,
                message:
                  "El nombre del estatus del producto debe iniciar con mayúscula",
              },
            })}
            disabled={mode === "view"}
          />
          {errors.nombre && (
            <span className="text-[#CF5459] text-xs">
              {errors.nombre?.message}
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
