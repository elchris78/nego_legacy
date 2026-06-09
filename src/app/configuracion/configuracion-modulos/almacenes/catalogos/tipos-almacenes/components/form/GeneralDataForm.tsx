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
import { useTypesWarehousesForm } from "./TypesWarehousesFormContext";
import { Switch } from "@/components/ui/switch";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { generalDataForm, currentTypesWarehouses, keyConfig } =
    useTypesWarehousesForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = generalDataForm;

  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true");
      setValue("requiereCliente", "false")
    }
  }, [mode, setValue]);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentTypesWarehouses) {
      setValue("claveTypesWarehouses", currentTypesWarehouses.id);
      setValue("prefix", keyConfig?.prefijo ?? "");
      setValue(
        "estatus",
        currentTypesWarehouses?.estatus === true ? "true" : "false"
      );
      setValue(
        "requiereCliente",
        currentTypesWarehouses?.requiereCliente === true ? "true" : "false"
      );
      setValue("nombre", currentTypesWarehouses?.nombre!);

      generalDataForm.trigger(); // Trigger validation to show errors if any
    }
  }, [mode, currentTypesWarehouses, setValue, generalDataForm]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID del Estatus */}
        <div>
          <LabelTooltip
            label="*Clave"
            tooltip="Identificador único alfanumérico configurable que representa el tipo de almacén. Es utilizado como referencia interna del sistema."
            htmlFor="id"
          />
          <Input
            id="id"
            type="text"
            placeholder="Ingresa Clave"
            isError={!!errors.claveTypesWarehouses}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveTypesWarehouses", {
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
          {errors.claveTypesWarehouses && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveTypesWarehouses?.message}
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

        {/* Estatus del Estatus */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el Estatus del tipo de almacen esta activo o inactivo"
            htmlFor="status-producto"
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
                ? currentTypesWarehouses?.estatus === true
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

        {/* Origen */}
        <div>
          <LabelTooltip
            label="Origen"
            tooltip="Origen"
            htmlFor="Origen"
          />
          <Input
            id="Origen"
            type="text"
            placeholder="No reservado"
            disabled
          />
        </div>
        
        {/* Nombre del tipo de almacén */}
        <div>
          <LabelTooltip
            label="*Nombre del tipo de almacén"
            tooltip="Ingresa un nombre descriptivo para identificar este tipo de almacén. Ejemplo: “Almacén central”, “Almacén de devoluciones”, “Almacén temporal”."
            htmlFor="name-estatus"
          />
          <Input
            id="name-estatus"
            type="text"
            placeholder="Ingresa el nombre del tipo de almacén"
            isError={!!errors.nombre}
            {...register("nombre", {
              required: "El nombre del tipo de almacén es requerido",
              minLength: {
                value: 4,
                message:
                  "El nombre del tipo de almacén debe tener al menos 4 caracteres",
              },
              maxLength: {
                value: 100,
                message:
                  "El nombre del tipo de almacén no puede exceder los 100 caracteres",
              },
              pattern: {
                value: lettersNumbersSpecialsFirstUppercase,
                message:
                  "El nombre del tipo de almacén debe iniciar con mayúscula",
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

        {/* requiereCliente */}
        <div className="relative">
          <LabelTooltip
            label="Requiere cliente"
            tooltip="Indica si este tipo de almacén está asociado a un cliente específico. Selecciona “Sí” si el uso del almacén depende de un cliente asignado."
            htmlFor="requiereCliente"
          />

          <Input
            id="requiereCliente"
            value={generalDataForm.watch("requiereCliente") === "true" ? "Sí" : "No"}
            disabled={mode !== "new"}
            className="pr-16"
          />

          <div className="absolute right-3 top-8">
            <div className="flex items-center h-full">
              <Switch
                disabled={mode !== "new"}
                checked={generalDataForm.watch("requiereCliente") === "true"}
                onCheckedChange={(checked) =>
                  setValue("requiereCliente", checked ? "true" : "false", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            </div>
          </div>
          {errors.requiereCliente && (
            <span className="text-[#CF5459] text-xs">
              {errors.requiereCliente.message}
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
