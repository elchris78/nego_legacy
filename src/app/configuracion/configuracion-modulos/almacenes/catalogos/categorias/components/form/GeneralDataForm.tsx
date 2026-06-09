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
import { useCategoriesForm } from "./CategoriesFormContext";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const { generalDataForm, currentCategories, keyConfig } = useCategoriesForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = generalDataForm;

  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true");
    }
  }, [mode, setValue]);

  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true");
    }

    if (
      mode === "edit" ||
      mode === "view" ||
      mode === "editsubcat" ||
      mode === "viewsubcat"
    ) {
      if (currentCategories) {
        setValue(
          "estatus",
          currentCategories?.estatus === true ? "true" : "false"
        );
        setValue("id", currentCategories?.id);
        setValue("userProvidedPrefix", keyConfig?.prefijo ?? "");
        setValue("categoria", currentCategories?.nombre);

        setValue(
          "userProvidedId",
          currentCategories.userProvidedId ?? currentCategories.id ?? "",
          {
            shouldValidate: true,
            shouldDirty: true,
          }
        );

        if (mode === "editsubcat" || mode === "viewsubcat") {
          setValue(
            "parentCategoriaId",
            currentCategories.parentCategoriaNombre ?? ""
          );
        }
      }

      generalDataForm.trigger();
    }

    if (mode === "newsubcat" && currentCategories) {
      setValue("categoria", "");
      setValue("userProvidedId", "");
      setValue("userProvidedPrefix", "", { shouldValidate: true });
      setValue("parentCategoriaId", currentCategories.nombre ?? "");
      setValue(
        "estatus",
        currentCategories.estatus === true ? "true" : "false"
      );
    }
  }, [mode, currentCategories, setValue, generalDataForm]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID de La Clave categoría */}
        <div>
          <LabelTooltip
            label="*Clave categoría"
            tooltip="Identificador único de la categoría del producto para uso interno de la empresa"
            htmlFor="name-estatus"
          />
          <Input
            id="name-clave-categoría"
            type="text"
            placeholder="Ingresa la clave de categoría"
            isError={!!errors.userProvidedId}
            value={watch("userProvidedId") ?? ""}
            disabled={
              (mode !== "new" && mode !== "newsubcat") ||
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
                mode === "new" || mode === "newsubcat"
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
                if (
                  (mode === "new" || mode === "newsubcat") &&
                  keyConfig?.longitudMaxima
                ) {
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
              {errors.userProvidedId?.message}
            </span>
          )}
        </div>

        {/* Prefijo de la clave categoría */}
        {keyConfig?.tienePrefijo &&
          keyConfig?.tipoPrefijo === "Variable" &&
          (mode === "new" || mode === "newsubcat") && (
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
                disabled={!(mode === "new" || mode === "newsubcat")}
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

        {["newsubcat", "editsubcat", "viewsubcat"].includes(mode ?? "") && (
          <div>
            <LabelTooltip
              label="*Categoría padre"
              tooltip="*Categoría padre"
              htmlFor="categoria-padre"
            />
            <Input
              id="categoria-padre"
              type="text"
              placeholder="Categoria padre"
              disabled={true}
              {...register("parentCategoriaId", {})}
            />
          </div>
        )}

        <div>
          <LabelTooltip
            label="*Nombre de la categoría"
            tooltip="Ingresa la categoría que mejor describe el  producto. Esta categoría ayuda a organizar y filtrar los productos dentro de la empresa."
            htmlFor="name-estatus"
          />
          <Input
            id="name-categoria-padre"
            type="text"
            placeholder="Ingresa la categoría del producto"
            isError={!!errors.categoria}
            {...register("categoria", {
              required: mode === "new" || mode === "newsubcat"
                ? "La categoría es requerida"
                : false,
              minLength: {
                value: 3,
                message: "La categoría debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La categoría no puede exceder los 100 caracteres",
              },
              pattern: {
                value: lettersNumbersSpecialsFirstUppercase,
                message: "La categoría debe iniciar con mayúscula",
              },
            })}
            disabled={mode === "view" || mode === "viewsubcat"}
          />
          {errors.categoria && (
            <span className="text-[#CF5459] text-xs">
              {errors.categoria?.message}
            </span>
          )}
        </div>

        {/* Estatus de La categoria */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la categoría del producto esta activa o inactiva"
            htmlFor="status-puestos"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("estatus", newValue);
              clearErrors("estatus");
            }}
            {...register("estatus", {
              required:
                mode === "new" || mode === "newsubcat"
                  ? "El estatus de la categoria"
                  : false,
            })}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new"
                ? currentCategories?.estatus === true
                  ? "true"
                  : "false"
                : "true")
            }
            disabled={mode === "view" || mode === "viewsubcat"}
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
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm">
        * Campos obligatorios
      </span>
    </>
  );
};

export default GeneralDataForm;
