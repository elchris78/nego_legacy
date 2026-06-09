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
import { useClientSubclassifications } from "./ClientSubclassificationsContext";
import { Textarea } from "@/components/ui/textarea";
import {
  alphanumericNoAccentsRegex,
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";

const GeneralDataForm = () => {
  // URL params
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentClientSubclassification, keyConfig } =
    useClientSubclassifications();

  const {
    watch,
    register,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = generalDataForm;
  const estatusValue = watch("estatus");
  useEffect(() => {
    reset({ estatus: "", nombre: "", descripcion: "" });
  }, [reset]);

  // Asign default values only on editing or viewing mode
  useEffect(() => {
    if (mode === "new") {
      reset({ estatus: "true", nombre: "", descripcion: "" });
    } else if (mode === "edit" || mode === "view") {
      reset({
        claveSubclasificacion:
          currentClientSubclassification?.id?.toString() ?? "",
        prefix: keyConfig?.prefijo ?? "",
        estatus: currentClientSubclassification?.estatus ? "true" : "false",
        nombre: currentClientSubclassification?.nombre ?? "",
        descripcion: currentClientSubclassification?.descripcion ?? "",
      });
    }
  }, [mode, currentClientSubclassification, reset, keyConfig]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID subclasificación */}
        <div>
          <LabelTooltip
            label="*Clave Subclasificación"
            tooltip="Identificador único de la sub clasificación de cliente usado internamente en la empresa"
            htmlFor="id-Subclasificación"
          />
          <Input
            id="id-clasification"
            type="text"
            placeholder="Clave Concepto de Subclasificación"
            isError={!!errors.claveSubclasificacion}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveSubclasificacion", {
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
          {errors.claveSubclasificacion && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveSubclasificacion?.message}
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
                disabled={mode !== "new"}
                isError={!!errors.prefix}
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

        {/* Estatus de la subclasificación */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la clasificación esta activa o inactiva"
            htmlFor="status-area"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("estatus", newValue);
              clearErrors("estatus");
            }}
            disabled={mode === "view"}
            value={estatusValue}
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

        {/* Nombre de la subclasificación */}
        <div>
          <LabelTooltip
            label="*Nombre de la subclasificación"
            tooltip="Nombre asignado a la sub clasificación del cliente"
            htmlFor="nombre-clasification"
          />
          <Input
            id="nombre-clasification"
            type="text"
            placeholder="Ingresa el nombre de la subclasificación"
            {...register("nombre", {
              required: "El nombre de la subclasificación es requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre debe iniciar con mayúscula",
              },
              minLength: {
                value: 3,
                message:
                  "El nombre de la subclasificación debe contener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre de la subclasificación no puede exceder los 100 caracteres",
              },
            })}
            disabled={mode === "view"}
          />
          {errors.nombre && (
            <span className="text-[#CF5459] text-xs">
              {errors.nombre.message}
            </span>
          )}
        </div>

        {/* Descripción de la subclasificación */}
        <div>
          <LabelTooltip
            label="Descripción"
            tooltip="Breve explicación del propósito o criterio de la subclasificación."
            htmlFor="descripcion-subclasification"
          />
          <Textarea
            id="descripcion"
            placeholder="Ingresa la descripción"
            disabled={mode === "view"}
            isError={!!errors.descripcion}
            {...register("descripcion", {
              maxLength: {
                value: 200,
                message:
                  "La descripción no puede contener más de 200 caracteres.",
              },
            })}
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
