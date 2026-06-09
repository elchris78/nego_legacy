import { useEffect, useState } from "react";

import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/ui/select";
import { alphanumericNoAccentsRegex, onlyNumbers } from "@/lib/utils/regex";
import { getAreas } from "@/app/configuracion/configuracion-empresa/informacion-empresa/areas-secciones/services/areasActions";
import { getColaboradores } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import { Input } from "@/ui/input";
import { Label } from "@/components/ui/label";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Option } from "@/components/ui/multiselect";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDepartamentoForm } from "./DepartamentosFormContext";
import ComboBox from "@/components/ui/combobox";

const transformDate = (date?: string) => {
  const newDate = date ? new Date(date) : new Date();
  return format(newDate, "d MMMM yyyy", {
    locale: es,
  });
};

export const GeneralData = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token");

  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [colaboradoresOptions, setColaboradoresOptions] = useState<Option[]>(
    []
  );

  const { generalDataForm, currentDepartamento, keyConfig } =
    useDepartamentoForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    trigger,
  } = generalDataForm;

  useEffect(() => {
    if (mode === "new") {
      setValue("isActive", "true", {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else if ((mode === "edit" || mode === "view") && currentDepartamento) {
      setValue("claveDepartamento", currentDepartamento?.departmentId);
      setValue(
        "isActive",
        currentDepartamento?.status === true ? "true" : "false"
      );
      setValue("name", currentDepartamento?.name);
      setValue("responsible", currentDepartamento?.responsibleId); // Guardamos el ID
      setValue("area", currentDepartamento?.areaId);
      setValue("description", currentDepartamento?.description);

      trigger();
    }
  }, [currentDepartamento, mode]);

  const fetchAreas = async () => {
    if (!token) return;
    try {
      const { areas } = await getAreas({
        token,
        params: {},
      });
      const activeAreas = areas.filter((area) => area.estatus); // Filtrar áreas activas
      setAreaOptions(
        activeAreas?.map((area) => ({
          value: area.id.toString(),
          label: area.nombre,
        }))
      );
    } catch (error: any) {
      console.error("Error fetching areas:", error.message);
    }
  };

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

  useEffect(() => {
    fetchAreas();
  }, [token]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Departamento ID field */}
        <div>
          <LabelTooltip
            label="*ID del departamento"
            tooltip="El ID del departamento se generará automáticamente al crear el registro."
            htmlFor="departamento-id"
          />
          <Input
            id="departamento-id"
            type="text"
            placeholder="ID del departamento"
            isError={!!errors.claveDepartamento}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveDepartamento", {
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
          {errors.claveDepartamento && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveDepartamento?.message}
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

        {/* Creation date field */}
        <div>
          <Label>Fecha de creación</Label>
          <Input
            id="creation-date"
            type="text"
            placeholder="Fecha de creación"
            className="text-gray-400"
            disabled
            value={
              mode !== "new"
                ? transformDate(currentDepartamento?.creationDate)
                : transformDate()
            }
          />
        </div>

        {/* status field */}
        <div>
          <Label>Estatus</Label>
          <div
            className={`h-[2.6rem] rounded-md border-[1px] border-gray-300 w-full p-2 mt-1 flex items-center justify-between 
              ${mode === "view" ? "bg-[#E3E1E6]" : "bg-white"}`}
          >
            <span className="text-gray-700">
              {generalDataForm.watch("isActive") === "true"
                ? "Activo"
                : "Inactivo"}
            </span>
            <Switch
              checked={generalDataForm.watch("isActive") === "true"}
              onCheckedChange={(checked) => {
                setValue("isActive", checked ? "true" : "false");
                clearErrors("isActive");
              }}
              disabled={mode === "view"}
              className="data-[state=checked]:bg-[#3C98CB]" // Color del switch cuando está activo
            />
          </div>
          {errors.isActive && (
            <span className="text-[#CF5459] text-xs">
              {errors.isActive?.message}
            </span>
          )}
        </div>

        {/* name field */}
        <div>
          {mode === "view" ? (
            <Label>*Nombre del departamento</Label>
          ) : (
            <LabelTooltip
              label="*Nombre del departamento"
              tooltip="El nombre del departamento debe contener entre 3 y 50 caracteres alfanuméricos y no repetirse con otros departamentos."
              htmlFor="name"
            />
          )}
          <Input
            id="name"
            type="text"
            placeholder="Nombre del departamento"
            disabled={mode === "view"}
            {...register("name", {
              required: "El nombre del departamento es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "El nombre no puede tener más de 50 caracteres",
              },
            })}
            onChange={(e) => {
              let value = e.target.value;
              if (value.length > 0) {
                value = value.charAt(0).toUpperCase() + value.slice(1);
              }
              setValue("name", value);
            }}
            isError={!!errors.name}
          />
          {errors.name && (
            <span className="text-[#CF5459] text-xs">
              {errors.name?.message}
            </span>
          )}
        </div>

        {/* responsable field */}
        <div>
          <Label>*Responsable</Label>
          <ComboBox
            options={colaboradoresOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.responsible}
            value={watch("responsible") || ""}
            onSelect={(value) => {
              setValue("responsible", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("responsible");
            }}
            disabled={mode === "view"}
            {...register("responsible", {
              required: "El responsable es requerido",
            })}
          />
          {errors.responsible && (
            <span className="text-[#CF5459] text-xs">
              {errors.responsible?.message}
            </span>
          )}
        </div>

        {/* Area field */}
        <div>
          {mode === "view" ? (
            <Label>*Área</Label>
          ) : (
            <LabelTooltip
              label="*Área"
              tooltip="Selecciona el área a la que pertenece este departamento de las opciones disponibles en la lista."
            />
          )}
          <Select
            {...register("area", {
              required: "El área es requerida",
            })}
            onValueChange={(newValue) => {
              setValue("area", newValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("area");
            }}
            value={generalDataForm.watch("area")} // Sincroniza con el estado del formulario
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.area}>
              <SelectValue placeholder="Elige una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {areaOptions.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
                {areaOptions.length === 0 && (
                  <SelectItem value="0" disabled>
                    No hay áreas disponibles
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.area && (
            <span className="text-[#CF5459] text-xs">
              {errors.area?.message}
            </span>
          )}
        </div>

        {/* description field */}
        <div>
          {mode === "view" ? (
            <Label>Descripción</Label>
          ) : (
            <LabelTooltip
              label="Descripción"
              tooltip="Ingresa una breve descripción del departamento. Este campo es opcional."
              htmlFor="description"
            />
          )}
          <Textarea
            id="description"
            placeholder="Ingresa la descripción del departamento"
            className="h-[2.6rem] w-full"
            disabled={mode === "view"}
            {...register("description", {
              maxLength: {
                value: 150,
                message: "La descripción no puede tener más de 150 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s.,;:]+$/,
                message:
                  "Solo se permiten letras, números, espacios, puntos y comas.",
              },
            })}
          />
          {errors.description && (
            <span className="text-[#CF5459] text-xs">
              {errors.description?.message}
            </span>
          )}
        </div>
      </div>
      <span className="font-semibold text-sm text-slate-600">
        * Campos obligatorios
      </span>
    </>
  );
};
