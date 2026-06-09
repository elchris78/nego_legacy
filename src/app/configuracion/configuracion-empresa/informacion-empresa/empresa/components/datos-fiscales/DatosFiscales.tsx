"use client";

import { useEffect, useRef, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Tooltip as MUITooltip } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "js-cookie";
import cx from "classnames";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useEmpresaForm } from "../EmpresaFormContext";
import { usePostalCodeOptions } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/hooks/usePostalCodeOptions";
import ComboBox from "@/components/ui/combobox";
import SquareArrowTop from "@/components/ui/icons/SquareArrowTop";
import { onlyNumbers } from "@/lib/utils/regex";
import { isValidFile } from "../../utils/validateFiles";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const DatosFiscales = () => {
  const token = Cookies.get("auth-token");
  const companyName = Cookies.get("company");

  const {
    datosFiscalesForm,
    countriesOptions,
    datosEmpresaForm,
    regimenesFiscalesOptions,
    setIsDatosFiscalesMounted,
  } = useEmpresaForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch,
    resetField,
  } = datosFiscalesForm;

  const {
    postalCodeOptions,
    fetchPostalCodeOptions,
    isLoading: isLoadingColonias,
  } = usePostalCodeOptions();

  const currentCompanyData = useSelector(
    (state: RootState) => state.empresa.company
  );

  const isRequired = datosEmpresaForm.watch("tieneDatosFiscales");

  const [debouncedCP, setDebouncedCP] = useState(watch("codigoPostal"));
  const [isPasswordType, setIsPasswordType] = useState(false);
  const [enableManualFields, setEnableManualFields] = useState({
    estado: false,
    municipio: false,
    colonia: false,
  });

  useEffect(() => {
    setIsDatosFiscalesMounted(true);
  }, []);

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
    datosFiscalesForm.register("colonia");
  }, [datosFiscalesForm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>
          <LabelTooltip
            label="*Nombre o razón Social"
            tooltip="Denominación legal completa de la empresa, tal como está registrada ante el SAT u otra autoridad fiscal correspondiente. Asegúrate de no usar abreviaturas informales y de reflejar exactamente lo que aparece en el acta constitutiva o constancia de situación fiscal."
            htmlFor="razon-social-empresa"
          />
          <Input
            id="razon-social-empresa"
            type="text"
            placeholder="Ingresa la razón social de la empresa"
            value={companyName || ""}
            disabled
          />
        </div>

        {/* País */}
        <div>
          <LabelTooltip
            label="*País"
            tooltip="Selecciona el país de origen del fabricante"
            htmlFor="pais"
          />
          <ComboBox
            options={countriesOptions}
            placeholder="Selecciona una opción"
            hasError={!!errors.pais}
            value={watch("pais") || ""}
            {...register("pais", {
              required: isRequired ? "El país es requerido" : false,
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

        {/* Código Postal */}
        <div>
          <LabelTooltip
            label="*Código Postal"
            tooltip="Código postal de la ubicación de la empresa"
            htmlFor="codigo-postal-empresa"
          />
          <Input
            id="codigo-postal-empresa"
            type="text"
            placeholder="Ingresa el código postal"
            isError={!!errors.codigoPostal}
            {...register("codigoPostal", {
              required: isRequired ? "El código postal es requerido" : false,
              minLength: {
                value: 5,
                message: "El código postal debe tener al menos 5 caracteres",
              },
              maxLength: {
                value: 5,
                message: "El código postal no puede exceder los 5 caracteres",
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
              required: isRequired ? "El estado es requerido" : false,
              minLength: {
                value: 3,
                message: "El estado debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El estado no puede exceder los 100 caracteres",
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
              required: isRequired ? "El municipio es requerido" : false,
              minLength: {
                value: 3,
                message: "El municipio debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El municipio no puede exceder los 100 caracteres",
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
            tooltip="Especifica la localidad o población donde se encuentra el domicilio de la empresa. Este campo es opcional y puede quedar vacío si no aplica."
            htmlFor="localidad"
          />
          <Input
            id="localidad"
            type="text"
            placeholder="Ingrese la localidad"
            isError={!!errors.localidad}
            {...register("localidad", {
              minLength: {
                value: 3,
                message: "La localidad debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La localidad no puede exceder los 100 caracteres",
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
                required: isRequired ? "La colonia es requerida" : false,
                minLength: {
                  value: 3,
                  message: "La colonia debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 100,
                  message: "La colonia no puede exceder los 100 caracteres",
                },
              })}
            />
          ) : (
            <ComboBox
              options={postalCodeOptions?.colonias || []}
              placeholder="Selecciona una colonia"
              hasError={!!errors.colonia}
              value={watch("colonia") || ""}
              {...register("colonia", {
                required: isRequired ? "La colonia es requerida" : false,
              })}
              onSelect={(value) => {
                setValue("colonia", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                clearErrors("colonia");
              }}
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
                message: "La calle no puede exceder los 100 caracteres",
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
                message:
                  "El número exterior no puede exceder los 10 caracteres",
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
                message:
                  "El número interior no puede exceder los 10 caracteres",
              },
            })}
          />
          {errors.numeroInterior && (
            <span className="text-[#CF5459] text-xs">
              {errors.numeroInterior?.message}
            </span>
          )}
        </div>

        {/* RFC */}
        <div>
          <LabelTooltip
            label="*R.F.C."
            tooltip="Ingresa el Registro Federal de Contribuyentes con 12 o 13 caracteres, según corresponda a persona moral o física. Usa solo letras mayúsculas y números, sin espacios ni símbolos."
            htmlFor="rfc"
          />
          <Input
            id="rfc"
            type="text"
            placeholder="Ingrese el RFC"
            isError={!!errors.rfc}
            {...register("rfc", {
              required: isRequired ? "El RFC es requerido" : false,
              maxLength: {
                value: 13,
                message: "El RFC no puede exceder los 13 caracteres",
              },
              // Patrón para rfc (sólo letras mayúsculas y números)
              pattern: {
                value: /^[A-Z0-9]+$/,
                message:
                  "El RFC no tiene un formato válido, debe de tener letras mayúsculas y números",
              },
            })}
          />
          {errors.rfc && (
            <span className="text-[#CF5459] text-xs">
              {errors.rfc?.message}
            </span>
          )}
        </div>

        {/* Régimen fiscal */}
        <div>
          <LabelTooltip
            label="*Régimen fiscal"
            tooltip="Selecciona el régimen fiscal bajo el cual estás registrado ante el SAT, según el catálogo oficial. Este dato debe coincidir con tu constancia de situación fiscal."
            htmlFor="rigemen-fiscal"
          />
          <ComboBox
            options={regimenesFiscalesOptions || []}
            placeholder="Selecciona una opción"
            hasError={!!errors.regimenFiscal}
            value={watch("regimenFiscal") || ""}
            {...register("regimenFiscal", {
              required: isRequired ? "El régimen fiscal es requerido" : false,
            })}
            onSelect={(value) => {
              setValue("regimenFiscal", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("regimenFiscal");
            }}
          />
          {errors.regimenFiscal && (
            <span className="text-[#CF5459] text-xs">
              {errors.regimenFiscal?.message}
            </span>
          )}
        </div>

        {/* Sello digital */}
        <div>
          <LabelTooltip
            label="*Insersión de sello digital"
            tooltip="Adjunta tu archivo de sello digital (.cer) proporcionado por el SAT. Este archivo contiene el certificado público y es necesario para la emisión de comprobantes fiscales."
            htmlFor="sello-digital-empresa"
          />
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document
                  .getElementById(`sello-digital-empresa-file-input`)
                  ?.click()
              }
              className={cx(
                "flex justify-start gap-2 py-5 mt-1 border w-full text-gray-600 text-base font-normal hover:text-gray-600",
                errors.archivoSelloDigital
                  ? "border-red-500"
                  : "border-[#BDC3C7]"
              )}
            >
              <span>
                {watch(`archivoSelloDigital`) instanceof File ||
                currentCompanyData?.datosFiscales.archivoSelloDigital
                  ? "Archivo seleccionado"
                  : "Selecciona el archivo"}
              </span>
              <span
                className={cn(
                  "absolute inset-y-0 right-2 flex items-center cursor-pointer"
                )}
              >
                <MUITooltip
                  title={
                    watch(`archivoSelloDigital`) instanceof File ||
                    currentCompanyData?.datosFiscales.archivoSelloDigital
                      ? "Reemplazar archivo sello digital"
                      : "Subir archivo sello digital"
                  }
                  placement="top"
                >
                  <span>
                    {watch(`archivoSelloDigital`) instanceof File ||
                    currentCompanyData?.datosFiscales.archivoSelloDigital ? (
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
            id={`sello-digital-empresa-file-input`}
            type="file"
            accept=".cer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && isValidFile(file, [".cer"], 1 * 1024 * 1024)) {
                setValue(`archivoSelloDigital`, file);
                clearErrors(`archivoSelloDigital`);
              } else if (
                file &&
                !isValidFile(file, [".cer"], 1 * 1024 * 1024)
              ) {
                setError(`archivoSelloDigital`, {
                  type: "manual",
                  message: "El archivo debe ser un .cer y no exceder 1 MB",
                });
              }
            }}
          />
          {errors.archivoSelloDigital && (
            <span className="text-[#CF5459] text-xs">
              {errors.archivoSelloDigital?.message}
            </span>
          )}
        </div>

        {/* Llave privada */}
        <div>
          <LabelTooltip
            label="*Llave privada"
            tooltip="Adjunta tu archivo de llave privada (.key) asociada al sello digital. Este archivo es necesario para firmar electrónicamente los comprobantes."
            htmlFor="llave-privada-empresa"
          />
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document
                  .getElementById(`llave-privada-empresa-file-input`)
                  ?.click()
              }
              className={cx(
                "flex justify-start gap-2 py-5 mt-1 border w-full text-gray-600 text-base font-normal hover:text-gray-600",
                errors.archivoLlavePrivada
                  ? "border-red-500"
                  : "border-[#BDC3C7]"
              )}
            >
              <span>
                {watch(`archivoLlavePrivada`) instanceof File ||
                currentCompanyData?.datosFiscales.archivoLlavePrivada
                  ? "Archivo seleccionado"
                  : "Selecciona el archivo"}
              </span>
              <span
                className={cn(
                  "absolute inset-y-0 right-2 flex items-center cursor-pointer"
                )}
              >
                <MUITooltip
                  title={
                    watch(`archivoLlavePrivada`) instanceof File ||
                    currentCompanyData?.datosFiscales.archivoLlavePrivada
                      ? "Reemplazar archivo llave privada"
                      : "Subir archivo llave privada"
                  }
                  placement="top"
                >
                  <span>
                    {watch(`archivoLlavePrivada`) instanceof File ||
                    currentCompanyData?.datosFiscales.archivoLlavePrivada ? (
                      <SquareArrowTop color="#4197CB" />
                    ) : (
                      <SquareArrowTop />
                    )}
                  </span>
                </MUITooltip>
              </span>
            </Button>
            <input
              hidden
              id={`llave-privada-empresa-file-input`}
              type="file"
              accept=".key"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && isValidFile(file, [".key"], 1 * 1024 * 1024)) {
                  setValue(`archivoLlavePrivada`, file);
                  clearErrors(`archivoLlavePrivada`);
                } else if (
                  file &&
                  !isValidFile(file, [".key"], 1 * 1024 * 1024)
                ) {
                  setError(`archivoLlavePrivada`, {
                    type: "manual",
                    message: "El archivo debe ser un .key y no exceder 1 MB",
                  });
                }
              }}
            />
          </div>
          {errors.archivoLlavePrivada && (
            <span className="text-[#CF5459] text-xs">
              {errors.archivoLlavePrivada?.message}
            </span>
          )}
        </div>

        {/* Contraseña del sello */}
        <div>
          <LabelTooltip
            label="*Contraseña del sello"
            tooltip="Ingresa la contraseña asignada al sello digital. Esta clave permite firmar digitalmente los comprobantes y debe mantenerse confidencial."
            htmlFor="contrasena-sello-empresa"
          />
          <div className="relative">
            <Input
              type={isPasswordType ? "text" : "password"}
              placeholder="Ingresa la contraseña del sello"
              id="contrasena-sello-empresa"
              isError={!!errors.contrasenaSello}
              {...register(`contrasenaSello`, {
                required: isRequired ? "La contraseña es requerida" : false,
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                maxLength: {
                  value: 32,
                  message: "La contraseña no puede exceder los 32 caracteres",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500"
              tabIndex={-1}
              onClick={() => setIsPasswordType((prev) => !prev)}
            >
              {isPasswordType ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>
          {errors.contrasenaSello && (
            <span className="text-[#CF5459] text-xs">
              {errors.contrasenaSello?.message}
            </span>
          )}
        </div>

        {/* Vigencia del sello */}
        <div>
          <LabelTooltip
            label="*Vigencia del sello"
            tooltip="Selecciona la fecha de expiración del certificado digital (.cer), tal como aparece en el archivo emitido por el SAT. Asegúrate de renovarlo antes de su vencimiento.."
            htmlFor="vigencia-sello-empresa"
          />
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                format="DD/MM/YYYY"
                {...register("fechaVigenciaSello", {
                  required: isRequired
                    ? "La fecha de vigencia del sello es requerida"
                    : false,
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true;
                      const date = dayjs(value);

                      if (!date.isValid()) {
                        return "Fecha inválida";
                      }

                      return true;
                    },
                  },
                })}
                sx={{
                  marginTop: "4px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "7px",
                    height: "43px",
                    backgroundColor: "white",
                    color: "#5D6D7E",
                    flexDirection: "row-reverse",
                    textTransform: "lowercase",
                  },
                  "& input": {
                    textTransform: "lowercase",
                  },
                }}
                slotProps={{
                  textField: {
                    placeholder: "Ingrese fecha de vigencia",
                    error: !!errors.fechaVigenciaSello,
                  },
                }}
                value={
                  watch("fechaVigenciaSello")
                    ? dayjs(watch("fechaVigenciaSello"))
                    : null
                }
                onChange={(newValue) => {
                  setValue(
                    "fechaVigenciaSello",
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                    { shouldValidate: true }
                  );
                }}
              />
            </LocalizationProvider>
          </div>
          {errors.fechaVigenciaSello && (
            <span className="text-[#CF5459] text-xs">
              {errors.fechaVigenciaSello?.message}
            </span>
          )}
        </div>
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm">
        * Campos obligatorios
      </span>
    </div>
  );
};

export default DatosFiscales;
