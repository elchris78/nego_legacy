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
  lettersAndNumbers,
  onlyNumbers,
} from "@/utils/regex";
import { useReturnConceptForm } from "./ReturnConceptsContext";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentReturnConcept, keyConfig } =
    useReturnConceptForm();
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
    if ((mode === "edit" || mode === "view") && currentReturnConcept) {
      setValue("claveConcepto", currentReturnConcept.id);
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue(
        "isActive",
        currentReturnConcept?.estatus === true ? "true" : "false"
      );
      setValue("name", currentReturnConcept?.concepto!);
      setValue("affectTo", currentReturnConcept?.afectaA);

      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentReturnConcept, setValue, trigger]); // Update dependency array

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID concepto de devolución */}
        <div>
          <LabelTooltip
            label="*Clave Concepto de devolución"
            tooltip="Identificador único del concepto de devolución, usado internamente en la empresa"
            htmlFor="id-return-concept"
          />
          <Input
            id="id-return-concept"
            type="text"
            placeholder="Clave Concepto de devolución"
            isError={!!errors.claveConcepto}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveConcepto", {
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
          {errors.claveConcepto && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveConcepto?.message}
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

        {/* Estatus del concepto de devolución */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el concepto está activo o inactivo."
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
                ? currentReturnConcept?.estatus
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

        {/* Nombre del concepto de devolución */}
        <div>
          <LabelTooltip
            label="*Concepto de devolución"
            tooltip="Nombre o descripción del concepto por el cual se realiza la devolución."
            htmlFor="name-return-concept"
          />
          <Input
            id="name-return-concept"
            type="text"
            placeholder="Ingresa la descripción"
            isError={!!errors.name}
            {...register("name", {
              required: "El Concepto de devolución es requerido",
              minLength: {
                value: 3,
                message:
                  "El Concepto de devolución debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message:
                  "El Concepto de devolución no puede exceder los 50 caracteres",
              },
              pattern: {
                value: lettersAndNumbers,
                message:
                  "El Concepto de devolución debe iniciar con mayúscula y no contener caracteres especiales",
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

        {/* Afecta a */}
        <div>
          <LabelTooltip
            label="*Afecta"
            tooltip="Selecciona si el concepto tiene un impacto en Ventas o en Compras"
            htmlFor="affect-to"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("affectTo", newValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("affectTo");
            }}
            {...register("affectTo", {
              required: "EL valor es requerido",
            })}
            value={
              generalDataForm.watch("affectTo") ?? currentReturnConcept?.afectaA
            }
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.affectTo}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"Ventas"}>Ventas</SelectItem>
                <SelectItem value={"Compras"}>Compras</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.affectTo && (
            <span className="text-[#CF5459] text-xs">
              {errors.affectTo?.message}
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
