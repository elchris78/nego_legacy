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
import {
  firstLetterUppercase,
  onlyNumbers,
  alphanumericNoAccentsRegex,
} from "@/utils/regex";
import { getUnidadPesoSat } from "../../services/empaquesActions";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Option } from "@/components/ui/multiselect";
import { Textarea } from "@/components/ui/textarea";
import { UnidadPesoSat } from "../../services/empaquesTypes";
import { useEmpaquesContextForm } from "./EmpaquesContext";
import ComboBox from "@/components/ui/combobox";

const GeneralDataForm = () => {
  const token = Cookies.get("auth-token");
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [unidadesPesoSat, setUnidadesPesoSat] = useState<Option[]>([]);

  const { generalDataForm, currentEmpaque, keyConfig } =
    useEmpaquesContextForm();
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
    if ((mode === "edit" || mode === "view") && currentEmpaque) {
      setValue("claveEmpaque", currentEmpaque.id);
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue("isActive", currentEmpaque.estatus ? "true" : "false", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("descripcion", currentEmpaque.descripcion, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("unidadSat", currentEmpaque.unidadSatId, {
        shouldValidate: true,
        shouldDirty: true,
      });

      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentEmpaque, setValue, trigger, unidadesPesoSat]); // Update dependency array

  useEffect(() => {
    const fetchUnidadesSat = async () => {
      const resp = await getUnidadPesoSat({ token });
      const newUnidadesPesoSat = resp.map((unidad: UnidadPesoSat) => ({
        label: `${unidad.claveUnidad} - ${unidad.nombre}`,
        value: unidad.claveUnidad,
      }));
      setUnidadesPesoSat(newUnidadesPesoSat);
    };

    fetchUnidadesSat();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID empaque */}
        <div>
          <LabelTooltip
            label="*ID Empaque"
            tooltip="Identificador único del Empaque para uso interno de la empresa"
            htmlFor="id-empaque"
          />
          <Input
            id="id-empaque"
            type="text"
            placeholder="ID Empaque"
            isError={!!errors.claveEmpaque}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveEmpaque", {
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
          {errors.claveEmpaque && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveEmpaque?.message}
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
            tooltip="Selecciona si el Empaque esta activo o inactivo"
            htmlFor="status-restriction-concept"
          />
          <Select
            {...register("isActive")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("isActive") ??
              (mode !== "new" ? currentEmpaque?.estatus : "true")
            }
            onValueChange={(value) => {
              setValue("isActive", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("isActive");
            }}
          >
            <SelectTrigger error={!!errors.isActive}>
              <SelectValue placeholder="Selecciona un estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.isActive && (
            <span className="text-[#CF5459] text-xs">
              {errors.isActive?.message}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div>
          <LabelTooltip
            label="*Descripción"
            tooltip="Escribe una breve explicación del Empaque. Asegúrate de que sea clara y específica para facilitar su identificación."
            htmlFor="descripcion"
          />
          <Textarea
            id="descripcion"
            placeholder="Ingresa la descripción"
            disabled={mode === "view"}
            isError={!!errors.descripcion}
            {...register("descripcion", {
              required: "La descripción es obligatoria",
              minLength: {
                value: 3,
                message: "La descripción debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La descripción no puede exceder los 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "La primera letra debe ser mayúscula",
              },
            })}
          />
          {errors.descripcion && (
            <span className="text-red-500 text-sm">
              {errors.descripcion.message}
            </span>
          )}
        </div>

        {/* Unidades SAT */}
        <div>
          <LabelTooltip
            label="*Unidades SAT"
            tooltip="Selecciona la unidad de medida correspondiente según el catálogo del SAT (por ejemplo: pieza, servicio, kilogramo). Esta unidad es obligatoria para la facturación electrónica."
            htmlFor="unidades-sat"
          />
          <ComboBox
            options={unidadesPesoSat}
            placeholder="Selecciona una opción"
            disabled={mode === "view"}
            hasError={!!errors.unidadSat}
            onSelect={(value) => {
              setValue("unidadSat", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("unidadSat");
            }}
            defaultValue={
              generalDataForm.watch("unidadSat") ??
              (mode !== "new" ? currentEmpaque?.unidadSat : undefined)
            }
            {...register("unidadSat", {
              required: "La unidad SAT es obligatoria",
            })}
          />
          {errors.unidadSat && (
            <span className="text-[#CF5459] text-xs">
              {errors.unidadSat?.message}
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
