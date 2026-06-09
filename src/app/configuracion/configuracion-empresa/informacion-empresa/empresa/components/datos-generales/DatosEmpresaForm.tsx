"use client";

import { useEffect, useRef, useState } from "react";

import Cookies from "js-cookie";

import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { onlyNumbers } from "@/lib/utils/regex";
import { Switch } from "@/components/ui/switch";
import { useEmpresaForm } from "../EmpresaFormContext";
import { usePostalCodeOptions } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/hooks/usePostalCodeOptions";
import ComboBox from "@/components/ui/combobox";

const DatosEmpresaForm = () => {
  const token = Cookies.get("auth-token");
  const companyId = Cookies.get("companyId");
  const companyName = Cookies.get("company");

  const { datosEmpresaForm, datosFiscalesForm, countriesOptions } =
    useEmpresaForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch, // Watch for form values
    resetField,
  } = datosEmpresaForm;

  const {
    postalCodeOptions,
    fetchPostalCodeOptions,
    isLoading: isLoadingColonias,
  } = usePostalCodeOptions();

  const [debouncedCP, setDebouncedCP] = useState(watch("codigoPostal"));

  const [enableManualFields, setEnableManualFields] = useState({
    estado: false,
    municipio: false,
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
    const prevCiudad = watch("municipio");

    fetchPostalCodeOptions(debouncedCP, token)
      .then((resp) => {
        if (resp.estados.length > 0) {
          setValue("estado", resp.estados[0]?.nombre || prevEstado || "");
        } else {
          setValue("estado", prevEstado || "");
        }

        if (resp.ciudades.length > 0) {
          setValue("municipio", resp.ciudades[0]?.nombre || prevCiudad || "");
        } else {
          setValue("municipio", prevCiudad || "");
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
          clearErrors("municipio");
        }

        setEnableManualFields({
          estado: resp.estados.length === 0,
          municipio: resp.ciudades.length === 0,
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
          municipio: true,
          colonia: true,
        });
      });
  }, [debouncedCP, token, watch("pais")]);

  // Resetea los campos de estado, municipio y colonia si el país cambia
  const prevPais = useRef(watch("pais"));
  useEffect(() => {
    const currentPais = watch("pais");
    if (prevPais.current === "MEX" && currentPais !== "MEX") {
      resetField("codigoPostal");
      resetField("colonia");
      resetField("estado");
      resetField("municipio");
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
    datosEmpresaForm.register("colonia");
  }, [datosEmpresaForm]);

  // Handle datos fiscales toggle
  const handleDatosFiscalesToggle = (checked: boolean) => {
    setValue("tieneDatosFiscales", checked);
    clearErrors("tieneDatosFiscales");

    // Reset fields if datos fiscales is disabled
    if (!checked) {
      datosFiscalesForm.reset();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {/* Clave de la empresa */}
        <div className="lg:col-span-2">
          <LabelTooltip label="*Clave de la empresa" htmlFor="id-empresa" />
          <Input
            id="id-empresa"
            type="text"
            placeholder="Clave de la empresa"
            value={companyId || ""}
            disabled
          />
        </div>

        {/* Nombre o razón social */}
        <div className="lg:col-span-2 xl:col-span-3">
          <LabelTooltip
            label="*Nombre o razón social"
            tooltip="Denominación legal completa de la empresa, tal como está registrada ante el SAT u otra autoridad fiscal correspondiente. Asegúrate de no usar abreviaturas informales y de reflejar exactamente lo que aparece en el acta constitutiva o constancia de situación fiscal."
            htmlFor="nombre-o-razon-social-empresa"
          />
          <Input
            id="nombre-o-razon-social-empresa"
            type="text"
            placeholder="Ingresa nombre o razón social de la empresa"
            value={companyName || ""}
            disabled
          />
        </div>

        {/* Código Postal */}
        <div className="xl:col-span-1">
          <LabelTooltip
            label="*Código Postal"
            tooltip="Ingresa el código postal correspondiente a la ubicación de la empresa. "
            htmlFor="codigo-postal-empresa"
          />
          <Input
            id="codigo-postal-empresa"
            type="text"
            placeholder="Ingresa el C.P."
            isError={!!errors.codigoPostal}
            {...register("codigoPostal", {
              required: "El código postal es requerido",
              minLength: {
                value: 5,
                message: "El código postal debe tener 5 caracteres",
              },
              maxLength: {
                value: 5,
                message: "El código postal debe tener 5 caracteres",
              },
              pattern: {
                value: onlyNumbers,
                message: "El código postal debe ser numérico",
              },
            })}
          />
          {errors.codigoPostal && (
            <span className="text-[#CF5459] text-xs">
              {errors.codigoPostal?.message}
            </span>
          )}
        </div>

        {/* País */}
        <div className="xl:col-span-2">
          <LabelTooltip
            label="*País"
            tooltip="Selecciona el país donde se encuentra ubicada la empresa."
            htmlFor="pais"
          />
          <ComboBox
            options={countriesOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.pais}
            defaultValue={datosEmpresaForm.getValues("pais") || undefined}
            {...register("pais", {
              required: "El país es requerido",
            })}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Estado */}
        <div>
          <LabelTooltip
            label="*Estado"
            tooltip="Ingresa o selecciona el nombre del estado, provincia o región correspondiente al domicilio. Este campo identifica la división administrativa dentro del país y es necesario para completar la dirección correctamente."
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
              !watch("pais") ||
              (watch("pais") === "MEX" && !enableManualFields.estado)
            }
            {...register("estado", {
              required: "El estado es requerido",
              minLength: {
                value: 3,
                message: "El estado debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El estado debe tener máximo 100 caracteres",
              },
            })}
          />
          {errors.estado && (
            <span className="text-[#CF5459] text-xs">
              {errors.estado?.message}
            </span>
          )}
        </div>

        {/* Municipio/Delegación */}
        <div>
          <LabelTooltip
            label="*Municipio/Delegación"
            tooltip="Nombre del municipio o delegación correspondiente a la dirección de la empresa. Se permiten caracteres alfanuméricos. Este dato es clave para fines de localización geográfica y administrativos."
            htmlFor="municipio"
          />
          <Input
            id="municipio"
            type="text"
            placeholder={
              watch("pais") === "MEX" && !enableManualFields.municipio
                ? "Complete el campo 'Código postal'"
                : "Ingrese el municipio"
            }
            isError={!!errors.municipio}
            disabled={
              !watch("pais") ||
              (watch("pais") === "MEX" && !enableManualFields.municipio)
            }
            {...register("municipio", {
              required: "El municipio es requerido",
              minLength: {
                value: 3,
                message: "El municipio debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El municipio debe tener máximo 100 caracteres",
              },
            })}
          />
          {errors.municipio && (
            <span className="text-[#CF5459] text-xs">
              {errors.municipio?.message}
            </span>
          )}
        </div>

        {/* Localidad */}
        <div>
          <LabelTooltip
            label="Localidad"
            tooltip="Ingresa la localidad o área urbana/rural donde se encuentra el domicilio. Campo de texto libre que puede coincidir con poblados, ciudades o zonas dentro del municipio."
            htmlFor="localidad"
          />
          <Input
            id="localidad"
            type="text"
            placeholder="Ingrese la localidad (opcional)"
            isError={!!errors.localidad}
            {...register("localidad", {
              minLength: {
                value: 3,
                message: "La localidad debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La localidad debe tener máximo 100 caracteres",
              },
            })}
          />
          {errors.localidad && (
            <span className="text-[#CF5459] text-xs">
              {errors.localidad?.message}
            </span>
          )}
        </div>

        {/* Colonia */}
        <div>
          <LabelTooltip
            label="*Colonia"
            tooltip="Nombre de la colonia, barrio o sector correspondiente al domicilio de la empresa"
            htmlFor="colonia"
          />
          {watch("pais") !== "MEX" || enableManualFields.colonia ? (
            <Input
              id="colonia"
              type="text"
              placeholder="Ingrese la colonia"
              isError={!!errors.colonia}
              disabled={
                !watch("pais") ||
                (watch("pais") === "MEX" && !enableManualFields.colonia)
              }
              {...register("colonia", {
                required: "La colonia es requerida",
                minLength: {
                  value: 3,
                  message: "La colonia debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "La colonia debe tener máximo 100 caracteres",
                },
              })}
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
              {...register("colonia", {
                required: "La colonia es requerida",
              })}
              disabled={!watch("codigoPostal") || isLoadingColonias}
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
            tooltip="Especifica el nombre de la calle donde se encuentra el domicilio. Se permite texto alfanumérico. Evita abreviaturas innecesarias para mantener la claridad del registro."
            htmlFor="calle"
          />
          <Input
            id="calle"
            type="text"
            placeholder="Ingrese la calle"
            isError={!!errors.calle}
            {...register("calle", {
              minLength: {
                value: 3,
                message: "La calle debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La calle debe tener máximo 100 caracteres",
              },
            })}
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
            tooltip='Ingresa el número exterior del domicilio. Puede contener letras y números (ej. "123", "12B"). Si no aplica, puedes indicar “S/N”.'
            htmlFor="numeroExterior"
          />
          <Input
            id="numeroExterior"
            type="text"
            placeholder="Ingrese el número exterior"
            isError={!!errors.numeroExterior}
            {...register("numeroExterior", {
              minLength: {
                value: 1,
                message: "El número exterior debe tener al menos 1 carácter",
              },
              maxLength: {
                value: 10,
                message: "El número exterior debe tener máximo 10 caracteres",
              },
            })}
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
            tooltip="Ingresa el número interior (departamento, oficina, etc.) en caso de aplicar. Si no existe, este campo puede quedar vacío."
            htmlFor="numeroInterior"
          />
          <Input
            id="numeroInterior"
            type="text"
            placeholder="Ingrese número interior"
            isError={!!errors.numeroInterior}
            {...register("numeroInterior", {
              minLength: {
                value: 1,
                message: "El número interior debe tener al menos 1 carácter",
              },
              maxLength: {
                value: 10,
                message: "El número interior debe tener máximo 10 caracteres",
              },
            })}
          />
          {errors.numeroInterior && (
            <span className="text-[#CF5459] text-xs">
              {errors.numeroInterior?.message}
            </span>
          )}
        </div>

        {/* CURP */}
        <div>
          <LabelTooltip
            label="CURP"
            tooltip="Ingresa la Clave Única de Registro de Población con 18 caracteres alfanuméricos. Ejemplo: GODE561231HDFRRN09."
            htmlFor="curp"
          />
          <Input
            id="curp"
            type="text"
            placeholder="Ingrese CURP"
            isError={!!errors.curp}
            {...register("curp", {
              minLength: {
                value: 18,
                message: "La CURP debe tener 18 caracteres",
              },
              maxLength: {
                value: 18,
                message: "La CURP debe tener 18 caracteres",
              },
              // Pattern to validate CURP format (Only uppercase letters and numbers no spaces)
              pattern: {
                value: /^[A-Z0-9]{18}$/,
                message:
                  "La CURP debe contener solo letras mayúsculas y números",
              },
            })}
          />
          {errors.curp && (
            <span className="text-[#CF5459] text-xs">
              {errors.curp?.message}
            </span>
          )}
        </div>

        {/* Registro patronal */}
        <div>
          <LabelTooltip
            label="Registro patronal"
            tooltip="Introduce el número de registro patronal asignado por el IMSS, incluyendo la subdelegación, número de registro y dígito verificador. Ejemplo: A12-34567-89-0."
            htmlFor="registroPatronal"
          />
          <Input
            id="registroPatronal"
            type="text"
            placeholder="Ingrese registro patronal"
            isError={!!errors.registroPatronalIMSS}
            {...register("registroPatronalIMSS", {
              maxLength: {
                value: 15,
                message: "El registro patronal debe tener máximo 15 caracteres",
              },
            })}
          />
          {errors.registroPatronalIMSS && (
            <span className="text-[#CF5459] text-xs">
              {errors.registroPatronalIMSS?.message}
            </span>
          )}
        </div>

        {/* Datos fiscales */}
        <div>
          <LabelTooltip
            label="Datos fiscales"
            tooltip="Activa esta opción si deseas capturar información fiscal adicional, como razón social, RFC y domicilio fiscal."
            htmlFor="datosFiscales"
          />
          <div className="h-[2.6rem] rounded-md border-[1px] border-gray-300 bg-white w-full md:w-1/3 p-2 mt-1 flex items-center justify-between">
            <span className="text-gray-700">
              {watch("tieneDatosFiscales") ? "Sí" : "No"}
            </span>
            <Switch
              checked={watch("tieneDatosFiscales")}
              onCheckedChange={(checked) => handleDatosFiscalesToggle(checked)}
              className="data-[state=checked]:bg-[#3C98CB]" // Color del switch cuando está activo
            />
          </div>
          {errors.tieneDatosFiscales && (
            <span className="text-[#CF5459] text-xs">
              {errors.tieneDatosFiscales?.message}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default DatosEmpresaForm;
