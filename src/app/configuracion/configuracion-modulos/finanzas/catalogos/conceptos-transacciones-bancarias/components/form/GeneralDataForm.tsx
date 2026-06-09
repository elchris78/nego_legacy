import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import { useConceptosTransaccionesBancariasContext } from "./ConceptosTransaccionesBancariasFormContext";
import { useSelector } from "react-redux";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const currentConceptoTransaccionBancaria = useSelector(
    (state: RootState) =>
      state.conceptosTransaccionesBancarias.currentConceptoTransaccionBancaria
  );

  const { generalDataForm, keyConfig } =
    useConceptosTransaccionesBancariasContext();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
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

      setValue("validaReferencia", "false", {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors("validaReferencia");
    }
  }, [mode, setValue]);

  // Asign values on edit mode
  useEffect(() => {
    if (
      (mode === "edit" || mode === "view") &&
      currentConceptoTransaccionBancaria
    ) {
      setValue("userProvidedId", currentConceptoTransaccionBancaria.id);
      setValue(
        "estatus",
        currentConceptoTransaccionBancaria.estatus ? "true" : "false"
      );
      setValue("concepto", currentConceptoTransaccionBancaria.concepto);
      setValue(
        "tipoTransaccion",
        currentConceptoTransaccionBancaria.tipoTransaccion
      );
      setValue("folio", currentConceptoTransaccionBancaria.folio);
      setValue(
        "validaReferencia",
        currentConceptoTransaccionBancaria.validaReferencia.toString()
      );
      setValue(
        "observaciones",
        currentConceptoTransaccionBancaria.observaciones
      );

      trigger();
    }
  }, [mode, currentConceptoTransaccionBancaria, setValue]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Clave concepto */}
        <div>
          <LabelTooltip
            label="*Clave concepto"
            tooltip="Identificador único alfanumérico configurable que representa el concepto de movimiento. Es utilizado como referencia interna del sistema."
            htmlFor="id-concepto"
          />
          <Input
            id="id-concepto"
            type="text"
            placeholder="Ingrese la clave"
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

        {/* Concepto de transacción bancaria */}
        <div>
          <LabelTooltip
            label="*Concepto de transacción bancaria"
            tooltip="Especifica el concepto que identifique claramente la transacción. Este campo ayuda a clasificar y entender el movimiento bancario."
            htmlFor="concepto-transaccion-bancaria"
          />
          <Input
            id="concepto-transaccion-bancaria"
            type="text"
            placeholder="Ingrese el concepto"
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

        {/* Tipo de transacción */}
        <div>
          <LabelTooltip
            label="*Tipo de transacción"
            tooltip="Selecciona si la transacción corresponde a un cargo o un abono según el caso."
            htmlFor="tipo-transaccion-bancaria"
          />
          <Controller
            name="tipoTransaccion"
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
                <SelectTrigger error={!!errors.tipoTransaccion}>
                  <SelectValue placeholder="Selecciona un tipo de transacción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Cargo">Cargo</SelectItem>
                    <SelectItem value="Abono">Abono</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.tipoTransaccion && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipoTransaccion?.message}
            </span>
          )}
        </div>

        {/* Folio */}
        <div>
          <LabelTooltip
            label="*Folio"
            tooltip="Número de referencia interno generado automáticamente. Sirve para rastrear o consultar esta operación posteriormente."
            htmlFor="folio-input"
          />
          <Input
            id="folio-input"
            type="text"
            placeholder="Ingrese el folio"
            isError={!!errors.folio}
            disabled
            {...register("folio")}
          />
          {errors.folio && (
            <span className="text-[#CF5459] text-xs">
              {errors.folio.message}
            </span>
          )}
        </div>

        {/* Válida referencia */}
        <div>
          <LabelTooltip
            label="*Válida referencia"
            // tooltip="Habilita el interruptor si el colaborador es un usuario del sistema"
            htmlFor="valida-referencia-switch"
          />
          <div
            className={`h-[2.6rem] rounded-lg border-[1px] border-gray-300 w-full p-2 mt-1 flex items-center justify-between 
                  ${mode === "view" ? "bg-[#E3E1E6]" : "bg-white"}`}
          >
            <span className="text-gray-700">
              {watch("validaReferencia") === "true" ? "Sí" : "No"}
            </span>
            <Switch
              checked={watch("validaReferencia") === "true"}
              onCheckedChange={(checked) => {
                setValue("validaReferencia", checked ? "true" : "false");
                clearErrors("validaReferencia");
              }}
              disabled={mode === "view"}
              className="data-[state=checked]:bg-[#3C98CB]" // Color del switch cuando está activo
              {...register("validaReferencia", {
                required: "Campo requerido",
              })}
            />
          </div>
          {errors.validaReferencia && (
            <span className="text-[#CF5459] text-xs">
              {errors.validaReferencia?.message}
            </span>
          )}
        </div>

        {/* Observaciones */}
        <div>
          <LabelTooltip
            label="Observaciones"
            tooltip="Campo opcional para agregar detalles adicionales, aclaraciones o comentarios relevantes sobre la transacción."
            htmlFor="observaciones-input"
          />
          <Input
            id="observaciones-input"
            type="text"
            placeholder="Ingrese las observaciones"
            isError={!!errors.observaciones}
            disabled={mode === "view"}
            {...register("observaciones")}
          />
          {errors.observaciones && (
            <span className="text-[#CF5459] text-xs">
              {errors.observaciones.message}
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
