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
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Textarea } from "@/components/ui/textarea";
import { usePuestosForm } from "./PuestosFormContext";
import MultipleSelector from "@/components/ui/multiselect";

const aplicaParableOptions = [
  { value: "Cliente", label: "Cliente" },
  { value: "Proveedor", label: "Proveedor" },
  { value: "Colaborador", label: "Colaborador" },
];

const GeneralDataForm = () => {
  const [selectedValues, setSelectedValues] = useState<
    { label: string; value: string }[]
  >([]);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [estatus, setEstatus] = useState("true");
  const { generalDataForm, currentPuestos, keyConfig } = usePuestosForm();
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
    if ((mode === "edit" || mode === "view") && currentPuestos) {
      setValue("clavePuesto", currentPuestos.id);
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue("estatus", currentPuestos?.estatus === true ? "true" : "false");
      setValue("nombre", currentPuestos?.nombre!);
      setValue("descripcion", currentPuestos?.descripcion!);
      const aplicaPara = currentPuestos?.aplicaPara;
      const values = Array.isArray(aplicaPara)
        ? aplicaPara.filter((v): v is string => typeof v === "string")
        : typeof aplicaPara === "string"
          ? aplicaPara.split(",").map((v) => v.trim()) // ← divide por coma y elimina espacios
          : [];
      const parsed = aplicaParableOptions.filter((option) =>
        values.includes(option.value)
      );
      setSelectedValues(parsed);
      setValue("aplicaPara", values);

      generalDataForm.trigger(); // Trigger validation to show errors if any
    }
  }, [mode, currentPuestos, setValue, generalDataForm]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID del área */}
        <div>
          <LabelTooltip
            label="*Clave del Puesto"
            tooltip="Identificador único del puesto usado internamente en la empresa"
            htmlFor="id-puesto"
          />
          <Input
            id="id-puesto"
            type="text"
            placeholder="Clave del Puesto"
            isError={!!errors.clavePuesto}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("clavePuesto", {
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
          {errors.clavePuesto && (
            <span className="text-[#CF5459] text-xs">
              {errors.clavePuesto?.message}
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

        {/* Estatus del área */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el puesto esta activo o inactivo"
            htmlFor="status-puestos"
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
                ? currentPuestos?.estatus === true
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

        {/* Nombre del área */}
        <div>
          <LabelTooltip
            label="*Nombre del Puesto"
            tooltip="Título del puesto dentro de la organización (por ejemplo: Gerente de Ventas, Analista de Datos)."
            htmlFor="name-puesto"
          />
          <Input
            id="name-puesto"
            type="text"
            placeholder="Ingresa nombre del puesto"
            isError={!!errors.nombre}
            {...register("nombre", {
              required: "El nombre del puesto es requerido",
              minLength: {
                value: 3,
                message:
                  "El nombre del puesto debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message:
                  "El nombre del puesto no puede exceder los 50 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre del puesto debe iniciar con mayúscula",
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

        {/* Descripción del área */}
        <div>
          <LabelTooltip
            label="Descripción"
            tooltip="Resumen de las funciones, responsabilidades o alcance del puesto."
            htmlFor="description-puesto"
          />
          <Textarea
            id="description-puesto"
            placeholder="Ingresa la descripción"
            isError={!!errors.descripcion}
            {...register("descripcion", {
              maxLength: {
                value: 200,
                message:
                  "La descripción no puede contener más de 200 caracteres.",
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

        {/* Responsables del área */}
        <div>
          <LabelTooltip
            label="*Aplica para"
            tooltip="Selecciona si este puesto aplica para Cliente, Proveedor, Colaborador"
            htmlFor="Aplica para"
          />
          <MultipleSelector
            {...register("aplicaPara", {
              required:
                "Se debe seleccionar al menos una de las opciones y se pueden seleccionar todas.",
            })}
            error={!!errors.aplicaPara}
            options={aplicaParableOptions}
            value={selectedValues}
            placeholder={
              selectedValues.length === 0 ? "Selecciona una o más opciones" : ""
            }
            onChange={(values) => {
              setSelectedValues(values);
              setValue(
                "aplicaPara",
                values.map((item) => item.value)
              ); // ← array de strings
              clearErrors("aplicaPara");
            }}
            badgeClassName="text-white p-2 bg-[#3C98CB] hover:bg-[#69aacc] h-8 text-sm"
            disabled={mode === "view"}
            emptyIndicator={
              <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                No hay resultados
              </p>
            }
          />
          {errors.aplicaPara && (
            <span className="text-[#CF5459] text-xs">
              {errors.aplicaPara.message}
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
