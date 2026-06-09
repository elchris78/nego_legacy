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
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import {
  alphanumericNoAccentsRegex,
  alphanumericRegex,
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { GeneralDataFormValues, useTiposContratosBForm } from "./TiposContratosBContext";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";


const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token")
  const dispatch: AppDispatch = useDispatch();
  const transaccionesDXP = useSelector(
    (state: RootState) => state.transaccionesDXP.transaccionesDXP
  );

  const formasPago = useSelector(
    (state: RootState) => state.transaccionesDXP.catalogoFormasPago
  );
 
  const { generalDataForm, currentTiposContratosB, keyConfig } =
    useTiposContratosBForm();
  
 
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
      setValue("estatus", "true", {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors("estatus");
    }
  }, [mode, setValue]);

  // Asign default values only on editing
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentTiposContratosB) {
      setValue("userProvidedId", currentTiposContratosB.id ?? "");
      setValue("userProvidedPrefix", keyConfig?.prefijo ?? "");
      setValue("nombre", currentTiposContratosB.nombre, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("estatus", currentTiposContratosB.estatus ? "true" : "false", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("numeroContrato", currentTiposContratosB.numeroContrato ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });        
      trigger(); 
    }
  }, [mode, currentTiposContratosB, setValue, trigger]); 

  

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID  concepto */}
        <div>
          <LabelTooltip
            label="*Clave"
            tooltip="Identificador único alfanumérico configurable que representa el tipo de contrato bancario. Es utilizado como referencia interna del sistema."
            htmlFor="Clave"
          />
          <Input
            id="Clave"
            type="text"
            placeholder="Ingresa clave"
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
            tooltip="Selecciona si la categoría del producto esta activa o inactiva"
            htmlFor="isActive"
          />
          <Select
            {...register("estatus")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new" ? currentTiposContratosB?.estatus : "true")
            }
            onValueChange={(value) => {
              setValue("estatus", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("estatus");
            }}
          >
            <SelectTrigger error={!!errors.estatus}>
              <SelectValue placeholder="Selecciona una opción" />
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
              {errors.estatus?.message}
            </span>
          )}
        </div>

        {/* Número de contrato */}
        <div>
          <LabelTooltip
            label="*Número de contrato"
            tooltip="Ingresa el número o código identificador del contrato bancario. Este valor puede contener letras y números según lo proporcionado por la institución financiera."
            htmlFor="Numero-contrato"
          />
          <Input
            id="Numero-contrato"
            type="text"
            placeholder="Ingresa el Número de contrato"
            isError={!!errors.numeroContrato}
            disabled={mode !== "new"}
            {...register("numeroContrato", {
              required: "Campo requerido",
              pattern: {
                value: alphanumericRegex,
                message: "Solo se permiten números y letras, ej.: 123456ABC."
              },
              minLength:{
                value: 4,
                message: "El valor debe ser mayor a 4 digitos"
              },              
              maxLength:{
                value: 10,
                message: "El valor no puede exceder a  los 10 digitos"
              }
            })}
          />
          {errors.numeroContrato && (
            <span className="text-[#CF5459] text-xs">
              {errors.numeroContrato?.message}
            </span>
          )}
        </div>
        
        {/* Nombre del tipo de contrato bancario */}
        <div>
          <LabelTooltip
            label="*Nombre del tipo de contrato bancario"
            tooltip="Especifica el nombre o categoría del contrato bancario. Ejemplo: “Contrato de apertura de cuenta”, “Línea de crédito empresarial”."
            htmlFor="Nombre-tipo-contrato-bancario"
          />
          <Input
            id="nombre"
            type="text"
            placeholder="Ingrese el nombre del tipo de contrato bancario"
            isError={!!errors.nombre}
            disabled={mode === "view"}
            {...register("nombre", {
              required: "Campo requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre debe empezar con mayuscula"
              },
              minLength:{
                value: 3,
                message: "El valor debe ser mayor a 3 digitos"
              },              
              maxLength:{
                value: 50,
                message: "El valor no puede exceder a  los 50 digitos"
              }
            })}
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
