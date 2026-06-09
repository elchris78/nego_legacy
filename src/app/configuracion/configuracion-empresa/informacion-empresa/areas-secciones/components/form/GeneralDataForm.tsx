"use client";

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
  firstLetterUppercase,
  onlyNumbers,
  alphanumericNoAccentsRegex,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useAreaForm } from "./AreaFormContext";
import { useDataForms } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/hooks/useDataForms";
import ComboBox from "@/components/ui/combobox";
import { getColaboradores } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import Cookies from "js-cookie";
import { Option } from "@/components/ui/multiselect";

const GeneralDataForm = () => {
  const token = Cookies.get("auth-token");

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [colaboradoresOptions, setColaboradoresOptions] = useState<Option[]>(
    []
  );

  const { generalDataForm, currentArea, keyConfig } = useAreaForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    trigger, // Destructure trigger from generalDataForm
    watch,
  } = generalDataForm;

  // Asign default values only on new
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
    if ((mode === "edit" || mode === "view") && currentArea) {
      setValue("claveArea", currentArea.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue("estatus", currentArea?.estatus === true ? "true" : "false");
      setValue("nombre", currentArea?.nombre!);
      setValue("descripcion", currentArea?.descripcion!);
      setValue("responsibleId", currentArea?.idResponsable!);

      trigger(); // Trigger validation to show errors if any
    }
  }, [mode, currentArea, setValue, trigger]);

  useEffect(() => {
    if (!token) return;
    const fetchColaboradores = async () => {
      try {
        const resp = await getColaboradores({
          token,
          params: {
            tipoColaborador: ["interno"],
            estatus: ["true"],
          },
        });
        const colab = resp.colaboradores.map((colaborador) => ({
          value: colaborador.id,
          label: colaborador.nombreCompleto ?? "",
        }));
        setColaboradoresOptions(colab);
      } catch (error) {
        console.error("Error fetching colaboradores:", error);
      }
    };

    fetchColaboradores();
  }, [token]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID del área */}
        <div>
          <LabelTooltip
            label="*Clave del área"
            tooltip="Identificador único del área"
            htmlFor="id-area"
          />
          <Input
            id="id-area"
            type="text"
            placeholder="Clave del área"
            isError={!!errors.claveArea}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveArea", {
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
          {errors.claveArea && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveArea?.message}
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
            tooltip="Selecciona si el área se encuentra activa o inactiva"
            htmlFor="status-area"
          />
          <Select
            {...register("estatus")}
            onValueChange={(newValue) => {
              setValue("estatus", newValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("estatus");
            }}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new"
                ? currentArea?.estatus
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
            label="*Nombre del área"
            tooltip="Nombre oficial del área dentro de la empresa."
            htmlFor="name-area"
          />
          <Input
            id="name-area"
            type="text"
            placeholder="Ingresa nombre del área"
            isError={!!errors.nombre}
            {...register("nombre", {
              required: "El nombre del área es requerido",
              minLength: {
                value: 3,
                message: "El nombre del área debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre del área no puede exceder los 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre del área debe iniciar con mayúscula",
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
            tooltip="Breve resumen sobre las funciones o propósito del área."
            htmlFor="description-area"
          />
          <Input
            id="description-area"
            type="text"
            placeholder="Añadir descripción"
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

        {/* Responsables del área */}
        <div>
          <LabelTooltip
            label="Responsable de área"
            tooltip="Persona designada como encargada o líder del área."
            htmlFor="responsable-area"
          />
          <ComboBox
            options={colaboradoresOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.responsibleId}
            value={watch("responsibleId") || ""}
            onSelect={(value) => {
              setValue("responsibleId", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("responsibleId");
            }}
            disabled={mode === "view"}
            {...register("responsibleId")}
          />
          {errors.responsibleId && (
            <span className="text-[#CF5459] text-xs">
              {errors.responsibleId?.message}
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
