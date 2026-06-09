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
import { onlyNumbers, alphanumericNoAccentsRegex } from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useCuentaBancariaContext } from "./CuentaBancariaFormContext";
import ComboBox from "@/components/ui/combobox";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useDataForms } from "../../hooks/useDataForms";

const cuentasContablesOptions = [
  { value: "101", label: "Cuenta 101" },
  { value: "102", label: "Cuenta 102" },
  { value: "103", label: "Cuenta 103" },
];

const tiposInstrumentoBancarioOptions = [
  { value: "Principal", label: "Principal" },
  { value: "Secundaria", label: "Secundaria" },
];

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const currentCuentaBancaria = useSelector(
    (state: RootState) => state.cuentasBancarias.currentCuentaBancaria
  );

  const { bancosOptions, monedasOptions } = useDataForms();

  const { generalDataForm, keyConfig } = useCuentaBancariaContext();
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

  // Asignar valores por defecto en modo "view" o "edit"
  useEffect(() => {
    if (mode && (mode === "view" || mode === "edit") && currentCuentaBancaria) {
      setValue("estatus", currentCuentaBancaria?.estatus ? "true" : "false");
      setValue("numeroCuenta", currentCuentaBancaria?.numeroCuenta || "");
      setValue("descripcion", currentCuentaBancaria?.descripcion || "");
      setValue("banco", currentCuentaBancaria?.bancoId || "");
      setValue("plaza", currentCuentaBancaria?.plaza || "");
      setValue("sucursal", currentCuentaBancaria?.sucursal || "");
      setValue("clabe", currentCuentaBancaria?.clabe || "");
      setValue("cuentaContable", currentCuentaBancaria?.cuentaContable || "");
      setValue("swift", currentCuentaBancaria?.swift || "");
      setValue("moneda", currentCuentaBancaria?.monedaId || "");
      setValue(
        "tipoInstrumentoBancario",
        currentCuentaBancaria?.tipoInstrumentoBancario || ""
      );
      setValue("userProvidedId", currentCuentaBancaria?.id || "");

      trigger();
    }
  }, [
    mode,
    setValue,
    currentCuentaBancaria,
    bancosOptions,
    monedasOptions,
    tiposInstrumentoBancarioOptions,
  ]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID Cuenta contable */}
        <div>
          <LabelTooltip
            label="*Clave"
            tooltip="Identificador único alfanumérico configurable que representa la cuenta bancaria. Es utilizado como referencia interna del sistema."
            htmlFor="id-cuenta-bancaria"
          />
          <Input
            id="id-cuenta-bancaria"
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

        {/* Número de cuenta */}
        <div>
          <LabelTooltip
            label="*Número de cuenta"
            tooltip="Ingresa el número de cuenta bancaria asignado por la institución financiera. Solo se permiten números sin espacios ni caracteres especiales."
            htmlFor="account-number-input"
          />
          <Input
            id="account-number-input"
            type="text"
            placeholder="Ingrese el número de cuenta"
            isError={!!errors.numeroCuenta}
            disabled={mode === "view" || mode === "edit"}
            {...register("numeroCuenta", {
              required: "Campo requerido",
              pattern: {
                value: onlyNumbers,
                message: "El número de cuenta debe ser numérico",
              },
            })}
          />
          {errors.numeroCuenta && (
            <span className="text-[#CF5459] text-xs">
              {errors.numeroCuenta.message}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div>
          <LabelTooltip
            label="*Descripción"
            tooltip="Escribe una breve descripción para identificar esta cuenta. Ejemplo: “Cuenta nómina Banorte”, “Cuenta USD internacional”."
            htmlFor="description-input"
          />
          <Input
            id="description-input"
            type="text"
            placeholder="Ingrese la descripción"
            isError={!!errors.descripcion}
            disabled={mode === "view"}
            {...register("descripcion", {
              required: "La descripción es requerida",
            })}
          />
          {errors.descripcion && (
            <span className="text-[#CF5459] text-xs">
              {errors.descripcion.message}
            </span>
          )}
        </div>

        {/* Banco */}
        <div>
          <LabelTooltip
            label="*Banco"
            tooltip="Selecciona el banco correspondiente a la cuenta. Puedes buscar por nombre o clave bancaria para agilizar la selección."
            htmlFor="banco-select"
          />
          <ComboBox
            options={bancosOptions}
            placeholder="Seleccione el banco"
            disabled={mode === "view"}
            hasError={!!errors.banco}
            onSelect={(value) => {
              setValue("banco", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("banco");
            }}
            value={generalDataForm.watch("banco") ?? ""}
            {...register("banco", {
              required: "El banco es requerido",
            })}
          />
          {errors.banco && (
            <span className="text-[#CF5459] text-xs">
              {errors.banco?.message}
            </span>
          )}
        </div>

        {/* Plaza */}
        <div>
          <LabelTooltip
            label="Plaza"
            tooltip="Especifica la plaza o localidad bancaria donde está registrada la cuenta. Por ejemplo: “CDMX”, “Monterrey”, “Guadalajara”."
            htmlFor="plaza-input"
          />
          <Input
            id="plaza-input"
            type="text"
            placeholder="Ingrese la plaza"
            isError={!!errors.plaza}
            disabled={mode === "view"}
            {...register("plaza")}
          />
          {errors.plaza && (
            <span className="text-[#CF5459] text-xs">
              {errors.plaza.message}
            </span>
          )}
        </div>

        {/* Sucursal */}
        <div>
          <LabelTooltip
            label="Sucursal"
            tooltip="Indica el nombre o número de la sucursal bancaria correspondiente a la cuenta. Este dato puede ayudarte a identificar mejor el origen."
            htmlFor="sucursal-input"
          />
          <Input
            id="sucursal-input"
            type="text"
            placeholder="Ingrese la sucursal"
            isError={!!errors.sucursal}
            disabled={mode === "view"}
            {...register("sucursal")}
          />
          {errors.sucursal && (
            <span className="text-[#CF5459] text-xs">
              {errors.sucursal.message}
            </span>
          )}
        </div>

        {/* Clabe */}
        <div>
          <LabelTooltip
            label="Clabe"
            tooltip="Ingresa la CLABE interbancaria de 18 dígitos. Este campo es obligatorio para realizar transferencias en México."
            htmlFor="clabe-input"
          />
          <Input
            id="clabe-input"
            type="text"
            placeholder="Ingrese la Clabe interbancaria"
            isError={!!errors.clabe}
            disabled={mode === "view" || mode === "edit"}
            {...register("clabe")}
          />
          {errors.clabe && (
            <span className="text-[#CF5459] text-xs">
              {errors.clabe.message}
            </span>
          )}
        </div>

        {/* Cuenta contable */}
        <div>
          <LabelTooltip
            label="Cuenta contable"
            tooltip="Selecciona la cuenta contable asociada desde el catálogo del sistema."
            htmlFor="cuentas-contables"
          />
          <ComboBox
            options={cuentasContablesOptions}
            placeholder="Seleccione la cuenta contable"
            disabled={mode === "view" || mode === "edit"}
            hasError={!!errors.cuentaContable}
            onSelect={(value) => {
              setValue("cuentaContable", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("cuentaContable");
            }}
            value={
              generalDataForm.watch("cuentaContable") ??
              (mode !== "new"
                ? currentCuentaBancaria?.cuentaContable
                : undefined)
            }
            {...register("cuentaContable")}
          />
          {errors.cuentaContable && (
            <span className="text-[#CF5459] text-xs">
              {errors.cuentaContable?.message}
            </span>
          )}
        </div>

        {/* Swift */}
        <div>
          <LabelTooltip
            label="Swift"
            tooltip="Código SWIFT o BIC del banco. Se requiere para realizar transferencias internacionales. Generalmente consta de 8 u 11 caracteres."
            htmlFor="swift-input"
          />
          <Input
            id="swift-input"
            type="text"
            placeholder="Ingrese el código Swift"
            isError={!!errors.swift}
            disabled={mode === "view"}
            {...register("swift")}
          />
          {errors.swift && (
            <span className="text-[#CF5459] text-xs">
              {errors.swift.message}
            </span>
          )}
        </div>

        {/* Moneda */}
        <div>
          <LabelTooltip
            label="*Moneda"
            tooltip="Selecciona la moneda en la que opera la cuenta bancaria. Ejemplo: MXN, USD, EUR. Puedes buscar por nombre o símbolo."
            htmlFor="moneda-input"
          />
          <ComboBox
            options={monedasOptions}
            placeholder="Seleccione la moneda"
            disabled={mode === "view"}
            hasError={!!errors.moneda}
            onSelect={(value) => {
              setValue("moneda", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("moneda");
            }}
            value={generalDataForm.watch("moneda") ?? ""}
            {...register("moneda", {
              required: "La moneda es requerida",
            })}
          />
          {errors.moneda && (
            <span className="text-[#CF5459] text-xs">
              {errors.moneda.message}
            </span>
          )}
        </div>

        {/* Tipo de instrumento bancario */}
        <div>
          <LabelTooltip
            label="*Tipo de instrumento bancario"
            tooltip="Elige el tipo de instrumento financiero asociado a la cuenta: Principal y Secundaria"
            htmlFor="tipo-instrumento-input"
          />
          <ComboBox
            options={tiposInstrumentoBancarioOptions}
            placeholder="Seleccione el tipo de instrumento"
            disabled={mode === "view"}
            hasError={!!errors.tipoInstrumentoBancario}
            onSelect={(value) => {
              setValue("tipoInstrumentoBancario", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("tipoInstrumentoBancario");
            }}
            value={generalDataForm.watch("tipoInstrumentoBancario") ?? ""}
            {...register("tipoInstrumentoBancario", {
              required: "El tipo de instrumento bancario es requerido",
            })}
          />
          {errors.tipoInstrumentoBancario && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipoInstrumentoBancario.message}
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
