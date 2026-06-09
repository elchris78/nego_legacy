"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Tooltip as MUITooltip } from "@mui/material";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import cx from "classnames";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidFileType } from "../../../utils/validateFile";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { onlyNumbers } from "@/utils/regex";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import { usePostalCodeOptions } from "../../../hooks/usePostalCodeOptions";
import ComboBox from "@/components/ui/combobox";
import SquareArrowTop from "@/components/ui/icons/SquareArrowTop";

const DomicilioParticularForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token");

  const { domicilioParticularForm, countriesOptions, currentColaborador } =
    useColaboradorFormContext();

  const {
    postalCodeOptions,
    fetchPostalCodeOptions,
    isLoading: isLoadingColonias,
  } = usePostalCodeOptions();

  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch, // Watch for form values
    resetField,
  } = domicilioParticularForm;

  const [debouncedCP, setDebouncedCP] = useState(watch("codigoPostal"));

  const [enableManualFields, setEnableManualFields] = useState({
    estado: false,
    ciudad: false,
    colonia: false,
  });

  // Debounce para el código postal
  // Esto evita que se haga una solicitud cada vez que el usuario escribe
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCP(watch("codigoPostal"));
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [watch("codigoPostal")]);

  // Efecto para obtener las opciones de código postal
  useEffect(() => {
    if (!debouncedCP || !token) return;
    if (debouncedCP.length !== 5) return;
    if (watch("pais") !== "MEX") return;

    const prevColonia = watch("colonia");
    const prevEstado = watch("estado");
    const prevCiudad = watch("ciudad");

    fetchPostalCodeOptions(debouncedCP, token)
      .then((resp) => {
        if (resp.estados.length > 0) {
          setValue("estado", resp.estados[0]?.nombre || prevEstado || "");
        } else {
          setValue("estado", prevEstado || "");
        }

        if (resp.ciudades.length > 0) {
          setValue("ciudad", resp.ciudades[0]?.nombre || prevCiudad || "");
        } else {
          setValue("ciudad", prevCiudad || "");
        }

        if (
          prevColonia &&
          resp.colonias.some((col) => col.clave === prevColonia)
        ) {
          setValue("colonia", prevColonia, { shouldValidate: true });
        } else if (resp.colonias.length === 0) {
          setValue("colonia", prevColonia || "");
        }

        if (resp.estados.length > 0 && resp.estados[0].nombre) {
          clearErrors("estado");
        }

        if (resp.ciudades.length > 0 && resp.ciudades[0].nombre) {
          clearErrors("ciudad");
        }

        setEnableManualFields({
          estado: resp.estados.length === 0,
          ciudad: resp.ciudades.length === 0,
          colonia: resp.colonias.length === 0,
        });
      })
      .catch(() => {
        setError("codigoPostal", {
          type: "manual",
          message: "Error al obtener las opciones de código postal",
        });

        setEnableManualFields({
          estado: true,
          ciudad: true,
          colonia: true,
        });
      });
  }, [debouncedCP, token, watch("pais")]);

  // Resetea los campos de estado, ciudad y colonia si el país cambia
  const prevPais = useRef(watch("pais"));
  useEffect(() => {
    const currentPais = watch("pais");
    if (prevPais.current === "MEX" && currentPais !== "MEX") {
      resetField("codigoPostal");
      resetField("colonia");
      resetField("estado");
      resetField("ciudad");
    }
    prevPais.current = currentPais;
  }, [watch("pais")]);

  // Resetea la colonia si el código postal cambia
  const prevCP = useRef(watch("codigoPostal"));
  useEffect(() => {
    const currentCP = watch("codigoPostal");
    if (prevCP.current && prevCP.current !== currentCP) {
      setValue("colonia", "", { shouldValidate: true, shouldDirty: true });
    }
    prevCP.current = currentCP;
  }, [watch("codigoPostal")]);

  useEffect(() => {
    domicilioParticularForm.register("colonia");
  }, [domicilioParticularForm]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pais */}
        <div>
          <LabelTooltip
            label="País"
            tooltip="Selecciona el país de origen del fabricante"
            htmlFor="pais"
          />
          <ComboBox
            options={countriesOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.pais}
            defaultValue={
              domicilioParticularForm.getValues("pais") || undefined
            }
            onSelect={(value) => {
              setValue("pais", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("pais");
            }}
            disabled={mode === "view"}
            {...register("pais")}
          />
          {errors.pais && (
            <span className="text-[#CF5459] text-xs">
              {errors.pais?.message}
            </span>
          )}
        </div>

        {/* Código postal */}
        <div>
          <LabelTooltip
            label="Código postal"
            tooltip="Clave numérica asignada a una zona geográfica específica dentro del país. Permite identificar con precisión la ubicación del domicilio."
            htmlFor="codigoPostal"
          />
          <Input
            id="codigoPostal"
            type="text"
            placeholder="Ingrese el código postal"
            isError={!!errors.codigoPostal}
            disabled={mode === "view"}
            {...register("codigoPostal", {
              pattern: {
                value: onlyNumbers,
                message: "El código postal debe ser numérico",
              },
              minLength: {
                value: 5,
                message: "El código postal debe tener al menos 5 dígitos",
              },
              maxLength: {
                value: 5,
                message: "El código postal no puede tener más de 5 dígitos",
              },
            })}
          />
          {errors.codigoPostal && (
            <span className="text-[#CF5459] text-xs">
              {errors.codigoPostal?.message}
            </span>
          )}
        </div>

        {/* Estado */}
        <div>
          <LabelTooltip
            label="Estado"
            tooltip="Entidad federativa correspondiente al domicilio del colaborador, según el sistema administrativo del país."
            htmlFor="estado"
          />
          <Input
            id="estado"
            type="text"
            placeholder={
              watch("pais") === "MEX" && !enableManualFields.estado
                ? "Complete el campo 'Código postal'"
                : "Ingrese el estado"
            }
            isError={!!errors.estado}
            disabled={
              mode === "view" ||
              !watch("pais") ||
              (watch("pais") === "MEX" && !enableManualFields.estado)
            }
            {...register("estado")}
          />
          {errors.estado && (
            <span className="text-[#CF5459] text-xs">
              {errors.estado?.message}
            </span>
          )}
        </div>

        {/* Ciudad */}
        <div>
          <LabelTooltip
            label="Ciudad"
            tooltip="Nombre de la ciudad o localidad principal en la que se encuentra ubicado el domicilio del colaborador."
            htmlFor="ciudad"
          />
          <Input
            id="ciudad"
            type="text"
            placeholder={
              watch("pais") === "MEX" && !enableManualFields.ciudad
                ? "Complete el campo 'Código postal'"
                : "Ingrese la ciudad"
            }
            isError={!!errors.ciudad}
            disabled={
              mode === "view" ||
              !watch("pais") ||
              (watch("pais") === "MEX" && !enableManualFields.ciudad)
            }
            {...register("ciudad")}
          />
          {errors.ciudad && (
            <span className="text-[#CF5459] text-xs">
              {errors.ciudad?.message}
            </span>
          )}
        </div>

        {/* Colonia */}
        <div>
          <LabelTooltip
            label="Colonia"
            tooltip="Área o subdivisión urbana dentro de la ciudad donde reside el colaborador. Facilita una mayor precisión en la localización."
            htmlFor="colonia"
          />
          {watch("pais") !== "MEX" || enableManualFields.colonia ? (
            <Input
              id="colonia"
              type="text"
              placeholder="Ingrese la colonia"
              isError={!!errors.colonia}
              disabled={
                mode === "view" ||
                !watch("pais") ||
                (watch("pais") === "MEX" && !enableManualFields.colonia)
              }
              {...register("colonia")}
            />
          ) : (
            <ComboBox
              options={postalCodeOptions?.colonias || []}
              placeholder="Selecciona una colonia"
              hasError={!!errors.colonia}
              value={watch("colonia") || ""}
              onSelect={(value) => {
                setValue("colonia", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                clearErrors("colonia");
              }}
              disabled={
                mode === "view" || !watch("codigoPostal") || isLoadingColonias
              }
            />
          )}
          {errors.colonia && (
            <span className="text-[#CF5459] text-xs">
              {errors.colonia?.message}
            </span>
          )}
        </div>

        {/* Calle */}
        <div>
          <LabelTooltip
            label="Calle"
            tooltip="Nombre de la vialidad en la que se encuentra ubicado el domicilio del colaborador."
            htmlFor="calle"
          />
          <Input
            id="calle"
            type="text"
            placeholder="Ingrese la calle"
            isError={!!errors.calle}
            disabled={mode === "view"}
            {...register("calle")}
          />
          {errors.calle && (
            <span className="text-[#CF5459] text-xs">
              {errors.calle?.message}
            </span>
          )}
        </div>

        {/* No. exterior */}
        <div>
          <LabelTooltip
            label="No. exterior"
            tooltip="Número oficial asignado al inmueble por las autoridades locales. Identifica la ubicación exacta dentro de la calle."
            htmlFor="numeroExterior"
          />
          <Input
            id="numeroExterior"
            type="text"
            placeholder="Ingrese el número exterior"
            isError={!!errors.numeroExterior}
            disabled={mode === "view"}
            {...register("numeroExterior")}
          />
          {errors.numeroExterior && (
            <span className="text-[#CF5459] text-xs">
              {errors.numeroExterior?.message}
            </span>
          )}
        </div>

        {/* No. interior */}
        <div>
          <LabelTooltip
            label="No. interior"
            tooltip="Número que identifica el departamento, oficina o unidad específica dentro de un inmueble. Solo aplica cuando el domicilio es compartido."
            htmlFor="numeroInterior"
          />
          <Input
            id="numeroInterior"
            type="text"
            placeholder="Ingrese número interior"
            isError={!!errors.numeroInterior}
            disabled={mode === "view"}
            {...register("numeroInterior")}
          />
          {errors.numeroInterior && (
            <span className="text-[#CF5459] text-xs">
              {errors.numeroInterior?.message}
            </span>
          )}
        </div>

        {/* Teléfono particular */}
        <div>
          <LabelTooltip
            label="Teléfono particular"
            tooltip="Número telefónico fijo asociado al domicilio del colaborador. Es utilizado como medio de contacto alternativo en caso de ser necesario."
            htmlFor="telefonoParticular"
          />
          <Input
            id="telefonoParticular"
            type="text"
            placeholder="Ingrese teléfono particular"
            isError={!!errors.telefonoParticular}
            disabled={mode === "view"}
            {...register("telefonoParticular")}
          />
          {errors.telefonoParticular && (
            <span className="text-[#CF5459] text-xs">
              {errors.telefonoParticular?.message}
            </span>
          )}
        </div>

        {/* Comprobante de domicilio */}
        <div>
          <LabelTooltip
            label="Comprobante de domicilio"
            tooltip="Documento oficial que acredita el lugar de residencia del colaborador. Puede ser un recibo de servicio reciente o estado de cuenta con antigüedad no mayor a 3 meses."
            htmlFor="comprobante-domicilio"
          />
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              disabled={mode === "view"}
              onClick={() =>
                document
                  .getElementById("comprobante-domicilio-domPart-file-input")
                  ?.click()
              }
              className={cx(
                "flex justify-start gap-2 py-5 mt-1 border w-full text-gray-600 text-base font-normal hover:text-gray-600",
                errors.comprobanteDomicilioFile
                  ? "border-red-500"
                  : "border-[#BDC3C7]"
              )}
            >
              <span>
                {watch("comprobanteDomicilioFile") instanceof File ||
                ((mode === "edit" || mode === "view") &&
                  currentColaborador?.domicilioParticular
                    ?.comprobanteDomicilioUrl)
                  ? "Archivo seleccionado"
                  : "Selecciona el archivo"}
              </span>
              <span
                className={cn(
                  "absolute inset-y-0 right-2 flex items-center",
                  mode === "new" || mode === "edit"
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
                )}
              >
                <MUITooltip
                  title={
                    mode === "view"
                      ? undefined
                      : watch("comprobanteDomicilioFile") instanceof File ||
                          (mode === "edit" &&
                            currentColaborador?.domicilioParticular
                              ?.comprobanteDomicilioUrl)
                        ? "Reemplazar archivo comprobante de domicilio"
                        : "Subir archivo comprobante de domicilio"
                  }
                  placement="top"
                >
                  <span>
                    {watch("comprobanteDomicilioFile") instanceof File ||
                    ((mode === "edit" || mode === "view") &&
                      currentColaborador?.domicilioParticular
                        ?.comprobanteDomicilioUrl) ? (
                      <SquareArrowTop color="#4197CB" />
                    ) : (
                      <SquareArrowTop />
                    )}
                  </span>
                </MUITooltip>
              </span>
            </Button>
          </div>
          <input
            hidden
            id="comprobante-domicilio-domPart-file-input"
            type="file"
            accept="application/pdf"
            disabled={mode === "view"}
            {...register("comprobanteDomicilioFile")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && isValidFileType(file)) {
                setValue("comprobanteDomicilioFile", file, {
                  shouldValidate: true,
                });
              } else if (file && !isValidFileType(file)) {
                setError("comprobanteDomicilioFile", {
                  type: "manual",
                  message: "El archivo debe ser un PDF",
                });
              }
            }}
          />
          {errors.comprobanteDomicilioFile && (
            <span className="text-[#CF5459] text-xs">
              {errors.comprobanteDomicilioFile?.message}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default DomicilioParticularForm;
