import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import {
  firstLetterUppercase,
  emailRegex,
  onlyNumbers,
  alphanumericNoAccentsRegex,
} from "@/utils/regex";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country } from "../../services/fabricantesTypes";
import { getCountries } from "../../services/fabricantesActions";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Option } from "@/components/ui/multiselect";
import { useFabricantesContextForm } from "./FabricantesContext";
import ComboBox from "@/components/ui/combobox";
import { usePostalCodeOptions } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/hooks/usePostalCodeOptions";

const GeneralDataForm = () => {
  const token = Cookies.get("auth-token");
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [countries, setCountries] = useState<Option[]>([]);

  const { generalDataForm, currentFabricante, keyConfig } =
    useFabricantesContextForm();

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
    watch,
    resetField,
    trigger, // Destructure trigger from generalDataForm
  } = generalDataForm;

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

  // Cargar países desde el backend
  useEffect(() => {
    if (!token) return;
    const fetchCountries = async () => {
      const resp = await getCountries({ token });
      const countriesData = resp?.map((country: Country) => ({
        label: country.descripcion,
        value: country.c_Pais,
      }));
      setCountries(countriesData);
    };

    fetchCountries();
  }, [token]);

  // Asignar valor por defecto en modo "new"
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
    if ((mode === "edit" || mode === "view") && currentFabricante) {
      setValue("claveFabricante", currentFabricante.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue("estatus", currentFabricante.estatus ? "true" : "false");
      setValue("nombre", currentFabricante.nombre);
      setValue("telefono", currentFabricante.telefono || "");
      setValue("correo", currentFabricante.correo || "");
      setValue("pais", currentFabricante.paisClave || "");
      setValue("codigoPostal", currentFabricante.codigoPostal || "");
      setValue("estado", currentFabricante.estado || "");
      setValue("ciudad", currentFabricante.ciudad || "");
      setValue("colonia", currentFabricante.colonia || "");
      setValue("calle", currentFabricante.calle || "");
      setValue("numero", currentFabricante.numeroExterior || "");
      setValue("contactoAdicional", currentFabricante.contactoAdicional || "");

      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentFabricante, setValue, trigger]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID fabricante */}
        <div>
          <LabelTooltip
            label="*Clave fabricante"
            tooltip="Identificador único del fabricante de una marca para uso interno de la empresa"
            htmlFor="id-fabricante"
          />
          <Input
            id="id-fabricante"
            type="text"
            placeholder="Clave de fabricante"
            isError={!!errors.claveFabricante}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveFabricante", {
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
          {errors.claveFabricante && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveFabricante?.message}
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
            tooltip="Selecciona si el fabricante está activo o inactivo"
            htmlFor="status-fabricante"
          />
          <Select
            {...register("estatus")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new" ? currentFabricante?.estatus : "true")
            }
            onValueChange={(value) => {
              setValue("estatus", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("estatus");
            }}
          >
            <SelectTrigger error={!!errors.estatus}>
              <SelectValue placeholder="Selecciona un estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.estatus && (
            <span className="text-[#CF5459] text-xs">
              {errors.estatus?.message}
            </span>
          )}
        </div>

        {/* Nombre del fabricante */}
        <div>
          <LabelTooltip
            label="*Nombre del fabricante"
            tooltip="Ingresa el nombre legal o razón social del fabricante del producto. Ejemplo: Samsung Electronics Co., Ltd., Bayer AG, Grupo Bimbo S.A.B. de C.V."
            htmlFor="nombre-fabricante"
          />
          <Input
            id="nombre-fabricante"
            type="text"
            placeholder="Ingresa el nombre del fabricante"
            disabled={mode === "view"}
            isError={!!errors.nombre}
            {...register("nombre", {
              required: "El nombre del fabricante es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El nombre no puede exceder los 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre debe comenzar con mayúscula",
              },
            })}
          />
          {errors.nombre && (
            <span className="text-[#CF5459] text-xs">
              {errors.nombre?.message}
            </span>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <LabelTooltip
            label="*Teléfono"
            tooltip="Ingresa un número válido a 10 dígitos, incluyendo lada local."
            htmlFor="telefono-fabricante"
          />
          <Input
            id="telefono-fabricante"
            type="text"
            placeholder="Ingresa el teléfono"
            isError={!!errors.telefono}
            disabled={mode === "view"}
            {...register("telefono", {
              required: "El teléfono es obligatorio",
              pattern: {
                value: /^\d{1,10}$/,
                message: "El teléfono debe tener al menos 10 dígitos numéricos",
              },
            })}
          />
          {errors.telefono && (
            <span className="text-[#CF5459] text-xs">
              {errors.telefono?.message}
            </span>
          )}
        </div>

        {/* Correo */}
        <div>
          <LabelTooltip
            label="*Correo"
            tooltip="Introduce un correo electrónico válido, como usuario@ejemplo.com."
            htmlFor="correo-fabricante"
          />
          <Input
            id="correo-fabricante"
            type="email"
            placeholder="Ingresa el correo electrónico"
            isError={!!errors.correo}
            disabled={mode === "view"}
            {...register("correo", {
              required: "El correo electrónico es obligatorio",
              maxLength: {
                value: 254,
                message: "El correo no puede exceder los 254 caracteres",
              },
              pattern: {
                value: emailRegex,
                message: "Ingresa un correo electrónico válido",
              },
            })}
          />
          {errors.correo && (
            <span className="text-[#CF5459] text-xs">
              {errors.correo?.message}
            </span>
          )}
        </div>

        {/* País */}
        <div>
          <LabelTooltip
            label="País"
            tooltip="Selecciona el país de origen del fabricante"
            htmlFor="pais-fabricante"
          />
          <ComboBox
            options={countries}
            placeholder="Selecciona una opción"
            disabled={mode === "view"}
            defaultValue={currentFabricante?.paisClave || undefined}
            hasError={!!errors.pais}
            {...register("pais")}
            onSelect={(value) => {
              setValue("pais", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("pais");
            }}
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
            tooltip="Ingresa el código postal correspondiente al domicilio. Solo números, sin espacios ni guiones."
            htmlFor="codigo-postal-fabricante"
          />
          <Input
            id="codigo-postal-fabricante"
            type="text"
            placeholder="Ingresa el código postal"
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
            tooltip="Estado del fabricante"
            htmlFor="estado-fabricante"
          />
          <Input
            id="estado-fabricante"
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
            tooltip="Ciudad del fabricante"
            htmlFor="ciudad-fabricante"
          />
          <Input
            id="ciudad-fabricante"
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
            tooltip="Especifica la colonia, barrio o fraccionamiento tal como aparece en el comprobante de domicilio o código postal. Ejemplo: Del Valle, Centro, Las Águilas."
            htmlFor="colonia-fabricante"
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
              {...register("colonia")}
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
            tooltip="Ingresa el nombre completo de la calle o avenida sin abreviaciones."
            htmlFor="calle-fabricante"
          />
          <Input
            id="calle-fabricante"
            type="text"
            placeholder="Ingresa la calle"
            isError={!!errors.calle}
            disabled={mode === "view"}
            {...register("calle", {
              minLength: {
                value: 3,
                message: "La calle debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La calle no puede exceder los 100 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9 ñÑáéíóúÁÉÍÓÚ.\-]+$/,
                message:
                  "Sólo se permiten letras, números, espacios y simbolos como . y -",
              },
            })}
          />
          {errors.calle && (
            <span className="text-[#CF5459] text-xs">
              {errors.calle?.message}
            </span>
          )}
        </div>

        {/* Número */}
        <div>
          <LabelTooltip
            label="Número"
            tooltip="Ingresa el número exterior del domicilio"
            htmlFor="numero-fabricante"
          />
          <Input
            id="numero-fabricante"
            type="text"
            placeholder="Ingresa el número exterior"
            isError={!!errors.numero}
            disabled={mode === "view"}
            {...register("numero", {
              maxLength: {
                value: 10,
                message: "El número no puede exceder los 10 caracteres",
              },
            })}
          />
          {errors.numero && (
            <span className="text-[#CF5459] text-xs">
              {errors.numero?.message}
            </span>
          )}
        </div>

        {/* Contacto adicional */}
        <div>
          <LabelTooltip
            label="Contacto adicional"
            tooltip="Ingresa un número o correo de un contacto adicional"
            htmlFor="contacto-adicional-fabricante"
          />
          <Input
            id="contacto-adicional-fabricante"
            type="text"
            placeholder="Ingresa el contacto adicional"
            isError={!!errors.contactoAdicional}
            disabled={mode === "view"}
            {...register("contactoAdicional", {
              maxLength: {
                value: 100,
                message:
                  "El contacto adicional no puede exceder los 100 caracteres",
              },
            })}
          />
          {errors.contactoAdicional && (
            <span className="text-[#CF5459] text-xs">
              {errors.contactoAdicional?.message}
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
