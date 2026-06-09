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
import { useTiposAlmacenajeForm } from "./TiposAlmacenajeContext";
import { Switch } from "@/components/ui/switch";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { generalDataForm, currentTiposAlmacenaje, keyConfig } =
    useTiposAlmacenajeForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = generalDataForm;

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentTiposAlmacenaje) {
      setValue("claveTiposAlmacenaje", currentTiposAlmacenaje.id);
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue("tipo", currentTiposAlmacenaje?.tipo!);

      generalDataForm.trigger(); // Trigger validation to show errors if any
    }
  }, [mode, currentTiposAlmacenaje, setValue, generalDataForm]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID del Estatus */}
        <div>
          <LabelTooltip
            label="*Clave"
            tooltip="Ingresa una clave única para identificar el registro. Puede generarse automáticamente o definirse manualmente, según la configuración del sistema."
            htmlFor="id"
          />
          <Input
            id="id"
            type="text"
            placeholder="Ingresa Clave"
            isError={!!errors.claveTiposAlmacenaje}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveTiposAlmacenaje", {
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
          {errors.claveTiposAlmacenaje && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveTiposAlmacenaje?.message}
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

        {/* Nombre del tipo de almacén */}
        <div>
          <LabelTooltip
            label="*Tipo de almacenaje"
            tooltip="Especifica el método o estructura utilizada para almacenar los productos. Ejemplo: “Rack”, “Contenedor”, “Tarima”, “A granel”, “Estantería”."
            htmlFor="name-estatus"
          />
          <Input
            id="name-estatus"
            type="text"
            placeholder="Ingresa tipo de almacenaje"
            isError={!!errors.tipo}
            {...register("tipo", {
              required: "El nombre del tipo de almacenaje es requerido",
              minLength: {
                value: 4,
                message:
                  "El nombre del tipo de almacenaje debe tener al menos 4 caracteres",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre del tipo de almacenaje no puede exceder los 100 caracteres",
              },
              pattern: {
                value: lettersNumbersSpecialsFirstUppercase,
                message:
                  "El nombre del tipo de almacenaje debe iniciar con mayúscula",
              },
            })}
            disabled={mode === "view"}
          />
          {errors.tipo && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipo?.message}
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
