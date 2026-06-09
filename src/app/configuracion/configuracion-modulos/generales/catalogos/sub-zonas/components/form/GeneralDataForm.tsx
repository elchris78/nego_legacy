import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

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
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { getZonas } from "../../../zonas/services/zonasActions";
import { Textarea } from "@/components/ui/textarea";
import { useSubZonasForm } from "./SubZonasContext";
import ComboBox from "@/components/ui/combobox";

import { Option } from "@/components/ui/multiselect";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [zonasOptions, setZonasOptions] = useState<Option[]>([]);

  const { generalDataForm, currentSubZona, keyConfig } = useSubZonasForm();
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
    if ((mode === "edit" || mode === "view") && currentSubZona) {
      setValue("claveSubzona", currentSubZona.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue("isActive", currentSubZona?.estatus === true ? "true" : "false");
      setValue("name", currentSubZona?.nombre);
      setValue("description", currentSubZona?.descripcion);
      setValue("zona", currentSubZona?.zonaId || "", {
        shouldValidate: true,
        shouldDirty: true,
      });

      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentSubZona, setValue, trigger, zonasOptions]); // Update dependency array

  useEffect(() => {
    const fetchZonas = async () => {
      const token = Cookies.get("auth-token");
      if (!token) return;
      try {
        const resp = await getZonas({
          token,
          params: {},
        });
        const activeZonas = resp.zonas.filter((zona) => zona.estatus);
        const newZonasOptions = activeZonas.map((zona) => ({
          value: zona.id,
          label: zona.nombre,
        }));
        setZonasOptions(newZonasOptions);
      } catch (error) {
        console.error("Error fetching zonas:", error);
      }
    };

    fetchZonas();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Clave subzona */}
        <div>
          <LabelTooltip
            label="*Clave SubZona"
            tooltip="Identificador único de la SubZona para uso interno de la empresa"
            htmlFor="id-subzona"
          />
          <Input
            id="id-subzona"
            type="text"
            placeholder="Clave SubZona"
            isError={!!errors.claveSubzona}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveSubzona", {
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
          {errors.claveSubzona && (
            <p className="text-red-500 text-xs">
              {errors.claveSubzona.message}
            </p>
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

        {/* Estatus */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la subzona está activa o inactiva"
            htmlFor="status-zona"
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
                ? currentSubZona?.estatus
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

        {/* Zona */}
        <div>
          <LabelTooltip
            label="*Zona"
            tooltip="Selecciona la zona a la que pertenece la SubZona"
            htmlFor="zona-subzona"
          />
          <ComboBox
            options={zonasOptions}
            onSelect={(value) => {
              setValue("zona", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("zona");
            }}
            {...register("zona", {
              required: "La zona es requerida",
            })}
            defaultValue={currentSubZona?.zonaId || ""}
            placeholder="Selecciona una opción"
            hasError={!!errors.zona}
            disabled={mode === "view"}
          />
          {errors.zona && (
            <span className="text-[#CF5459] text-xs">
              {errors.zona?.message}
            </span>
          )}
        </div>

        {/* Nombre subzona */}
        <div>
          <LabelTooltip
            label="*Nombre"
            tooltip="Ingresa el nombre para identificar la subzona"
            htmlFor="name-subzona"
          />
          <Input
            id="name-subzona"
            type="text"
            isError={!!errors.name}
            disabled={mode === "view"}
            placeholder="Ingresa el nombre"
            {...register("name", {
              required: "El nombre de la SubZona es requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre de la SubZona debe iniciar con mayúscula",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre de la SubZona no puede exceder los 100 caracteres",
              },
              minLength: {
                value: 3,
                message:
                  "El nombre de la SubZona debe tener al menos 3 caracteres",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <LabelTooltip
            label="Descripción"
            tooltip="Ingresa una breve descripción acerca de la subzona"
            htmlFor="description-subzona"
          />
          <Textarea
            id="description-subzona"
            placeholder="Ingresa una descripción"
            isError={!!errors.description}
            disabled={mode === "view"}
            {...register("description", {
              maxLength: {
                value: 100,
                message: "La descripción no puede exceder los 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "La descripción debe iniciar con mayúscula",
              },
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
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
