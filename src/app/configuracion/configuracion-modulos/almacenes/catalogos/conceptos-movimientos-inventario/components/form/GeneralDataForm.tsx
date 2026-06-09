"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";

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
import { onlyNumbers, alphanumericNoAccentsRegex } from "@/utils/regex";
import { RootState } from "@/lib/store/store";
import { useMovimientoInventarioContext } from "./MovimientoInventarioFormContext";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const currentMovimientoInventario = useSelector(
    (state: RootState) =>
      state.movimientosInventario.currentMovimientoInventario
  );

  const { generalDataForm, keyConfig } = useMovimientoInventarioContext();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    trigger,
    control,
  } = generalDataForm;

  // Asignar valor por defecto en modo "new"
  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true", {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors("estatus");
    }
  }, [mode, setValue]);

  // Asignar valor por defecto en modo "edit" o "view"
  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      setValue(
        "estatus",
        currentMovimientoInventario?.estatus ? "true" : "false"
      );
      setValue("concepto", currentMovimientoInventario?.concepto!);
      setValue("aplicaPara", currentMovimientoInventario?.aplicaPara!);
      setValue("tipoMovimiento", currentMovimientoInventario?.tipoMovimiento!);
      setValue("userProvidedId", currentMovimientoInventario?.id);

      trigger();
    }
  }, [mode, setValue, currentMovimientoInventario]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Clave concepto */}
        <div>
          <LabelTooltip
            label="*Clave concepto"
            tooltip="Identificador único alfanumérico configurable que representa el concepto de movimiento. Es utilizado como referencia interna del sistema."
            htmlFor="clave-concepto"
          />
          <Input
            id="clave-concepto"
            type="text"
            placeholder="Ingresa clave de concepto"
            isError={!!errors.userProvidedId}
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
          {errors.userProvidedId && (
            <span className="text-[#CF5459] text-xs">
              {errors.userProvidedId?.message}
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
                isError={!!errors.userProvidedPrefix}
                disabled={mode !== "new"}
                {...register("userProvidedPrefix", {
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
            tooltip="Valor que define la disponibilidad operativa del concepto. Puede estar en estado “Activo” (utilizable) o “Inactivo” (no disponible para nuevos movimientos)."
            htmlFor="status-concepto"
          />
          <Controller
            name="estatus"
            control={control}
            rules={{ required: "Campo requerido" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={mode === "view"}
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    field.onBlur();
                  }
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
            )}
          />
          {errors.estatus && (
            <span className="text-[#CF5459] text-xs">
              {errors.estatus?.message}
            </span>
          )}
        </div>

        {/* Origen */}
        <div>
          <LabelTooltip
            label="*Origen"
            tooltip='Campo que identifica si el concepto fue registrado a través de la interfaz del sistema ("No reservado") o directamente en base de datos ("Reservado"). Este valor no puede ser modificado manualmente.'
            htmlFor="origen-concepto-movimiento"
          />
          <Input
            id="origen-concepto-movimiento"
            type="text"
            placeholder="Ingrese el origen"
            disabled
            value={
              mode !== "new"
                ? currentMovimientoInventario?.origen
                : "No reservado"
            }
          />
        </div>

        {/* Concepto de movimiento al inventario */}
        <div>
          <LabelTooltip
            label="*Concepto de movimiento al inventario"
            tooltip="Descripción alfanumérica que indica el nombre del concepto asociado a un movimiento de inventario (entrada o salida)."
            htmlFor="concepto-movimiento-inventario"
          />
          <Input
            id="concepto-movimiento-inventario"
            type="text"
            placeholder="Ingresa el concepto"
            isError={!!errors.concepto}
            disabled={mode === "view"}
            {...register("concepto", {
              required: "Campo requerido",
            })}
          />
          {errors.concepto && (
            <span className="text-[#CF5459] text-xs">
              {errors.concepto.message}
            </span>
          )}
        </div>

        {/* Aplica para */}
        <div>
          <LabelTooltip
            label="*Aplica para"
            tooltip="Campo de selección que determina el tipo de tercero al que está orientado el concepto. Las opciones disponibles son: Cliente, Proveedor o Ninguno."
            htmlFor="aplica-para-concepto"
          />
          <Controller
            name="aplicaPara"
            control={control}
            rules={{ required: "Campo requerido" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={mode === "view" || mode === "edit"}
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    field.onBlur();
                  }
                }}
              >
                <SelectTrigger error={!!errors.aplicaPara}>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                    <SelectItem value="Proveedor">Proveedor</SelectItem>
                    <SelectItem value="Ninguno">Ninguno</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.aplicaPara && (
            <span className="text-[#CF5459] text-xs">
              {errors.aplicaPara?.message}
            </span>
          )}
        </div>

        {/* Tipo de movimiento */}
        <div>
          <LabelTooltip
            label="*Tipo de movimiento"
            tooltip="Clasificación del concepto según el impacto en el inventario. Puede representar una “Entrada” (incremento de existencias) o una “Salida” (disminución de existencias)."
            htmlFor="tipo-movimiento"
          />
          <Controller
            name="tipoMovimiento"
            control={control}
            rules={{ required: "Campo requerido" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={mode === "view" || mode === "edit"}
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    field.onBlur();
                  }
                }}
              >
                <SelectTrigger error={!!errors.tipoMovimiento}>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Salida">Salida</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipoMovimiento && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipoMovimiento?.message}
            </span>
          )}
        </div>

        {/* Folio */}
        <div>
          <LabelTooltip
            label="*Folio"
            tooltip="Número no editable que muestra la cantidad de movimientos registrados históricamente bajo este concepto. Es utilizado para seguimiento y control interno."
            htmlFor="folio-input"
          />
          <Input
            id="folio-input"
            type="text"
            placeholder="Ingrese el folio"
            disabled
            value={
              mode !== "new" ? currentMovimientoInventario?.folio : undefined
            }
          />
        </div>
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm">
        * Campos obligatorios
      </span>
    </>
  );
};

export default GeneralDataForm;
