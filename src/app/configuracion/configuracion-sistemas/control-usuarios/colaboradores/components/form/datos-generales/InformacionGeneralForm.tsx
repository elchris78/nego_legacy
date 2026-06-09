"use client";

import { useEffect } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { cn } from "@/lib/utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";

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
  phoneNumberRegex,
  emailRegex,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { isValidFileType } from "../../../utils/validateFile";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { Switch } from "@/components/ui/switch";
import { Tooltip as MUITooltip } from "@mui/material";
import { useColaboradorFormContext } from "../ColaboradorFormContext";
import ComboBox from "@/components/ui/combobox";
import SquareArrowTop from "@/components/ui/icons/SquareArrowTop";

const InformacionGeneralForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const {
    informacionGeneralForm,
    currentColaborador,
    keyConfig,
    usersOptions,
  } = useColaboradorFormContext();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    watch, // Watch for form values
    unregister,
  } = informacionGeneralForm;

  // Register files
  useEffect(() => {
    informacionGeneralForm.register("archivoINE", {
      required:
        (mode === "view" || mode === "edit") &&
        currentColaborador?.archivoINEUrl
          ? false
          : "Debes subir un archivo INE",
    });
    informacionGeneralForm.register("archivoSeguroSocial", {
      required:
        watch("tipoColaborador") === "Interno"
          ? (mode === "view" || mode === "edit") &&
            currentColaborador?.archivoSeguroSocialUrl
            ? false
            : "Debes subir un archivo de No. Seguro social"
          : false,
    });
    informacionGeneralForm.register("archivoConyuge", {
      required:
        watch("tipoColaborador") === "Interno"
          ? (mode === "view" || mode === "edit") &&
            currentColaborador?.archivoConyugeUrl
            ? false
            : "Debes subir un archivo de conyuge"
          : false,
    });
    informacionGeneralForm.register("archivoReferencia", {
      required:
        watch("tipoColaborador") === "Interno"
          ? (mode === "view" || mode === "edit") &&
            currentColaborador?.archivoReferenciaUrl
            ? false
            : "Debes subir un archivo de referencias"
          : false,
    });
  }, [
    informacionGeneralForm,
    mode,
    currentColaborador,
    watch("tipoColaborador"),
  ]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID del colaborador */}
        <div>
          <LabelTooltip
            label="*Clave de colaborador"
            tooltip="Identificador único del colaborador para uso interna de la empresa"
            htmlFor="id-colaborador"
          />
          <Input
            id="id-colaborador"
            type="text"
            placeholder="Ingresa clave de colaborador"
            isError={!!errors.userProvidedId}
            disabled={
              mode !== "new" ||
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
          {errors.userProvidedId && (
            <span className="text-[#CF5459] text-xs">
              {errors.userProvidedId?.message}
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
                isError={!!errors.userProvidedPrefix}
                disabled={mode !== "new"}
                {...register("userProvidedPrefix", {
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
              {errors.userProvidedPrefix && (
                <span className="text-[#CF5459] text-xs">
                  {errors.userProvidedPrefix.message}
                </span>
              )}
            </div>
          )}

        {/* Estatus del colaborador */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el colaborador está activo o inactivo"
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
              informacionGeneralForm.watch("estatus") ??
              (mode !== "new"
                ? currentColaborador?.estatus
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

        {/* Tipo de colaborador */}
        <div>
          <LabelTooltip
            label="*Tipo de colaborador"
            tooltip="Selecciona el tipo de colaborador"
            htmlFor="type-colaborador"
          />
          <Select
            {...register("tipoColaborador", {
              required: "El tipo de colaborador es requerido",
            })}
            onValueChange={(newValue) => {
              setValue("tipoColaborador", newValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("tipoColaborador");
            }}
            value={
              informacionGeneralForm.watch("tipoColaborador") ??
              (mode !== "new"
                ? currentColaborador?.tipoColaborador === ("Interno" as any)
                  ? "Interno"
                  : "Externo"
                : undefined)
            }
            disabled={mode === "view" || mode === "edit"}
          >
            <SelectTrigger error={!!errors.tipoColaborador}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"Interno"}>Interno</SelectItem>
                <SelectItem value={"Externo"}>Externo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipoColaborador && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipoColaborador?.message}
            </span>
          )}
        </div>

        {/* Usuario del sistema */}
        <div>
          <LabelTooltip
            label="*Usuario de sistema"
            tooltip="Habilita el interruptor si el colaborador es un usuario del sistema"
            htmlFor="usuario-sistema"
          />
          <div
            className={`h-[2.6rem] rounded-lg border-[1px] border-gray-300 w-full p-2 mt-1 flex items-center justify-between 
              ${mode === "view" ? "bg-[#E3E1E6]" : "bg-white"}`}
          >
            <span className="text-gray-700">
              {informacionGeneralForm.watch("tieneUsuarioSistema") === "true"
                ? "Sí"
                : "No"}
            </span>
            <Switch
              checked={
                informacionGeneralForm.watch("tieneUsuarioSistema") === "true"
              }
              onCheckedChange={(checked) => {
                setValue("tieneUsuarioSistema", checked ? "true" : "false");
                clearErrors("tieneUsuarioSistema");

                // Unregister to clean up any existing validations
                checked
                  ? unregister("nombreCompleto")
                  : unregister("usuarioSistemaId");
              }}
              disabled={mode === "view" || mode === "edit"}
              className="data-[state=checked]:bg-[#3C98CB]" // Color del switch cuando está activo
              {...register("tieneUsuarioSistema")} // Register para el formulario
            />
          </div>
          {errors.tieneUsuarioSistema && (
            <span className="text-[#CF5459] text-xs">
              {errors.tieneUsuarioSistema?.message}
            </span>
          )}
        </div>

        {/* Nombre completo */}
        <div>
          <LabelTooltip
            label="*Nombre completo"
            tooltip="Nombre completo del colaborador de la empresa"
            htmlFor="nombre-completo-colaborador"
          />
          {watch("tieneUsuarioSistema") === "false" && (
            <>
              <Input
                id="nombre-completo-colaborador"
                type="text"
                placeholder="Ingresa nombre completo del colaborador"
                isError={!!errors.nombreCompleto}
                disabled={mode === "view"}
                {...register("nombreCompleto", {
                  required:
                    watch("tieneUsuarioSistema") === "false"
                      ? "El nombre del colaborador es requerido"
                      : false,
                  minLength: {
                    value: 3,
                    message:
                      "El nombre del colaborador debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message:
                      "El nombre del colaborador no puede exceder los 100 caracteres",
                  },
                  pattern: {
                    value: firstLetterUppercase,
                    message:
                      "El nombre del colaborador debe iniciar con mayúscula",
                  },
                })}
              />
              {errors.nombreCompleto && (
                <span className="text-[#CF5459] text-xs">
                  {errors.nombreCompleto?.message}
                </span>
              )}
            </>
          )}
          {watch("tieneUsuarioSistema") === "true" && (
            <>
              <ComboBox
                options={usersOptions}
                placeholder="Selecciona una opción"
                hasError={!!errors.usuarioSistemaId}
                defaultValue={
                  informacionGeneralForm.getValues("usuarioSistemaId") ||
                  undefined
                }
                onSelect={(value) => {
                  setValue("usuarioSistemaId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  clearErrors("usuarioSistemaId");
                }}
                disabled={mode === "view"}
                {...register("usuarioSistemaId", {
                  required:
                    watch("tieneUsuarioSistema") === "true"
                      ? "Debes seleccionar un usuario del sistema"
                      : false,
                })}
              />
              {errors.usuarioSistemaId && (
                <span className="text-[#CF5459] text-xs">
                  {errors.usuarioSistemaId?.message}
                </span>
              )}
            </>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <LabelTooltip
            label="*Fecha de nacimiento"
            tooltip="Dato que indica el día, mes y año en que nació el colaborador. "
            htmlFor="fecha-nacimiento-colaborador"
          />
          <div className="relative">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                disabled={mode === "view"}
                format="DD/MM/YYYY"
                maxDate={dayjs(new Date())}
                {...register("fechaNacimiento", {
                  validate: {
                    isValidDate: (value) => {
                      if (!value) return true;
                      const date = dayjs(value);
                      const today = dayjs();

                      if (!date.isValid()) {
                        return "Fecha inválida";
                      }

                      if (date.isAfter(today)) {
                        return "La fecha no puede ser futura";
                      }

                      return true;
                    },
                  },
                })}
                sx={{
                  marginTop: "4px",
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "4.5vh",
                    backgroundColor: mode === "view" ? "#E3E1E6" : "white",
                    color: mode === "view" ? "#949DA4" : "#5D6D7E",
                    flexDirection: "row-reverse",
                    textTransform: "lowercase",
                  },
                  "& input": {
                    textTransform: "lowercase",
                  },
                }}
                slotProps={{
                  textField: {
                    placeholder: "Ingrese fecha de nacimiento",
                    error: !!errors.fechaNacimiento,
                  },
                  inputAdornment: {
                    style: {
                      display: "none", // Oculta el icono de calendario
                    },
                  },
                }}
                value={
                  watch("fechaNacimiento")
                    ? dayjs(watch("fechaNacimiento"))
                    : null
                }
                onChange={(newValue) => {
                  setValue(
                    "fechaNacimiento",
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                    { shouldValidate: true }
                  );
                }}
              />
            </LocalizationProvider>
          </div>
          {errors.fechaNacimiento && (
            <span className="text-[#CF5459] text-xs">
              {errors.fechaNacimiento?.message}
            </span>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <LabelTooltip
            label="*Teléfono"
            tooltip="Número de contacto personal del colaborador. Puede utilizarse para fines de comunicación, verificación o seguimiento."
            htmlFor="telefono-colaborador"
          />
          <Input
            id="telefono-colaborador"
            type="tel"
            placeholder="Ingrese el teléfono"
            isError={!!errors.telefono}
            disabled={mode === "view"}
            {...register("telefono", {
              required: "Debes ingresar un número de teléfono",
            })}
          />
          {errors.telefono && (
            <span className="text-[#CF5459] text-xs">
              {errors.telefono?.message}
            </span>
          )}
        </div>

        {/* Correo electrónico */}
        <div>
          <LabelTooltip
            label="*Correo electrónico"
            tooltip="Dirección de correo electrónico personal o corporativa del colaborador. Se usa como medio oficial de notificación y contacto."
            htmlFor="email-colaborador"
          />
          <Input
            id="email-colaborador"
            type="email"
            placeholder="Ingrese el correo electrónico"
            isError={!!errors.correoElectronico}
            disabled={
              mode === "view" ||
              (mode === "edit" && currentColaborador?.tieneUsuarioSistema)
            }
            {...register("correoElectronico", {
              required: "Debes ingresar un correo electrónico",
              pattern: {
                value: emailRegex,
                message: "El correo electrónico no es válido",
              },
            })}
          />
          {errors.correoElectronico && (
            <span className="text-[#CF5459] text-xs">
              {errors.correoElectronico?.message}
            </span>
          )}
        </div>

        {/* CURP */}
        <div>
          <LabelTooltip
            label="*Curp"
            tooltip="Clave Única de Registro de Población del colaborador. Es un identificador oficial requerido para trámites administrativos y fiscales."
            htmlFor="curp-colaborador"
          />
          <Input
            id="curp-colaborador"
            type="text"
            placeholder="Ingrese el CURP"
            isError={!!errors.curp}
            disabled={mode === "view"}
            {...register("curp", {
              required: "Debes ingresar un CURP",
              minLength: {
                value: 18,
                message: "El CURP debe tener 18 caracteres",
              },
              maxLength: {
                value: 18,
                message: "El CURP debe tener 18 caracteres",
              },
            })}
          />
          {errors.curp && (
            <span className="text-[#CF5459] text-xs">
              {errors.curp?.message}
            </span>
          )}
        </div>

        {/* INE */}
        <div>
          <LabelTooltip
            label="*INE"
            tooltip="Clave alfanumérica contenida en la credencial para votar del colaborador. Utilizada como medio de verificación de identidad."
            htmlFor="ine-colaborador"
          />
          <div className="relative">
            <Input
              id="ine-colaborador"
              type="text"
              placeholder="Ingrese el INE"
              className="pr-10"
              isError={!!errors.ine || !!errors.archivoINE}
              disabled={mode === "view"}
              {...register("ine", {
                required: "Debes ingresar un INE",
              })}
            />
            <label
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
                    : watch("archivoINE") ||
                        (mode === "edit" && currentColaborador?.archivoINEUrl)
                      ? "Reemplazar archivo INE"
                      : "Subir archivo INE"
                }
                placement="top"
              >
                <span>
                  {watch("archivoINE") ||
                  ((mode === "edit" || mode === "view") &&
                    currentColaborador?.archivoINEUrl) ? (
                    <SquareArrowTop color="#4197CB" />
                  ) : (
                    <SquareArrowTop />
                  )}
                </span>
              </MUITooltip>
              <input
                type="file"
                hidden
                disabled={mode === "view"}
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && isValidFileType(file)) {
                    setValue("archivoINE", file);
                    clearErrors("archivoINE");
                  } else if (file && !isValidFileType(file)) {
                    setError("archivoINE", {
                      type: "manual",
                      message: "El archivo debe ser un PDF",
                    });
                  }
                }}
              />
            </label>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {errors.ine && (
              <span className="text-[#CF5459] text-xs">
                {errors.ine?.message}
              </span>
            )}
            {errors.archivoINE && (
              <span className="text-[#CF5459] text-xs">
                {errors.archivoINE?.message}
              </span>
            )}
          </div>
        </div>

        {/* No. Seguro social */}
        <div>
          <LabelTooltip
            label="*No. Seguro social"
            tooltip="Número asignado por el seguro social al colaborador. Es necesario para la afiliación a la seguridad social y trámites laborales."
            htmlFor="seguro-social-colaborador"
          />
          <div className="relative">
            <Input
              id="seguro-social-colaborador"
              type="text"
              placeholder="Ingrese el No. Seguro social"
              className="pr-10"
              isError={
                !!errors.numeroSeguroSocial || !!errors.archivoSeguroSocial
              }
              disabled={mode === "view"}
              {...register("numeroSeguroSocial", {
                required:
                  watch("tipoColaborador") === "Interno"
                    ? "Debes ingresar un No. Seguro social"
                    : false,
              })}
            />
            <label
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
                    : watch("archivoSeguroSocial") ||
                        (mode === "edit" &&
                          currentColaborador?.archivoSeguroSocialUrl)
                      ? "Reemplazar archivo No. Seguro social"
                      : "Subir archivo No. Seguro social"
                }
                placement="top"
              >
                <span>
                  {watch("archivoSeguroSocial") ||
                  ((mode === "edit" || mode === "view") &&
                    currentColaborador?.archivoSeguroSocialUrl) ? (
                    <SquareArrowTop color="#4197CB" />
                  ) : (
                    <SquareArrowTop />
                  )}
                </span>
              </MUITooltip>
              <input
                type="file"
                hidden
                accept="application/pdf"
                id="seguro-social-file-input"
                disabled={mode === "view"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && isValidFileType(file)) {
                    setValue("archivoSeguroSocial", file);
                    clearErrors("archivoSeguroSocial");
                  } else if (file && !isValidFileType(file)) {
                    setError("archivoSeguroSocial", {
                      type: "manual",
                      message: "El archivo debe ser un PDF",
                    });
                  }
                }}
              />
            </label>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {errors.numeroSeguroSocial && (
              <span className="text-[#CF5459] text-xs">
                {errors.numeroSeguroSocial?.message}
              </span>
            )}
            {errors.archivoSeguroSocial && (
              <span className="text-[#CF5459] text-xs">
                {errors.archivoSeguroSocial?.message}
              </span>
            )}
          </div>
        </div>

        {/* Conyuge */}
        <div>
          <LabelTooltip
            label="*Conyuge"
            tooltip="Nombre completo de la persona con la que el colaborador mantiene una relación conyugal legalmente reconocida."
            htmlFor="conyuge-colaborador"
          />
          <div className="relative">
            <Input
              id="conyuge-colaborador"
              type="text"
              placeholder="Ingrese el nombre del conyuge"
              className="pr-10"
              isError={!!errors.conyuge || !!errors.archivoConyuge}
              disabled={mode === "view"}
              {...register("conyuge", {
                required:
                  watch("tipoColaborador") === "Interno"
                    ? "Debes ingresar el nombre del conyuge"
                    : false,
              })}
            />
            <label
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
                    : watch("archivoConyuge") ||
                        (mode === "edit" &&
                          currentColaborador?.archivoConyugeUrl)
                      ? "Reemplazar archivo de conyuge"
                      : "Subir archivo de conyuge"
                }
                placement="top"
              >
                <span>
                  {watch("archivoConyuge") ||
                  ((mode === "edit" || mode === "view") &&
                    currentColaborador?.archivoConyugeUrl) ? (
                    <SquareArrowTop color="#4197CB" />
                  ) : (
                    <SquareArrowTop />
                  )}
                </span>
              </MUITooltip>
              <input
                type="file"
                hidden
                accept="application/pdf"
                id="conyuge-file-input"
                disabled={mode === "view"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && isValidFileType(file)) {
                    setValue("archivoConyuge", file);
                    clearErrors("archivoConyuge");
                  } else if (file && !isValidFileType(file)) {
                    setError("archivoConyuge", {
                      type: "manual",
                      message: "El archivo debe ser un PDF",
                    });
                  }
                }}
              />
            </label>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {errors.conyuge && (
              <span className="text-[#CF5459] text-xs">
                {errors.conyuge?.message}
              </span>
            )}
            {errors.archivoConyuge && (
              <span className="text-[#CF5459] text-xs">
                {errors.archivoConyuge?.message}
              </span>
            )}
          </div>
        </div>

        {/* Referencias */}
        <div>
          <LabelTooltip
            label="*Referencias"
            tooltip="Personas que pueden proporcionar información sobre la trayectoria, conducta o desempeño del colaborador. Utilizadas para fines de validación o antecedentes."
            htmlFor="referencias-colaborador"
          />
          <div className="relative">
            <Input
              id="referencias-colaborador"
              type="text"
              placeholder="Ingrese una referencia"
              className="pr-10"
              isError={!!errors.referencias || !!errors.archivoReferencia}
              disabled={mode === "view"}
              {...register("referencias", {
                required:
                  watch("tipoColaborador") === "Interno"
                    ? "Debes ingresar el nombre de la referencia"
                    : false,
              })}
            />
            <label
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
                    : watch("archivoReferencia")
                      ? "Reemplazar archivo de referencia"
                      : "Subir archivo de referencia"
                }
                placement="top"
              >
                <span>
                  {watch("archivoReferencia") ||
                  ((mode === "edit" || mode === "view") &&
                    currentColaborador?.archivoReferenciaUrl) ? (
                    <SquareArrowTop color="#4197CB" />
                  ) : (
                    <SquareArrowTop />
                  )}
                </span>
              </MUITooltip>
              <input
                hidden
                id="referencia-file-input"
                type="file"
                accept="application/pdf"
                disabled={mode === "view"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && isValidFileType(file)) {
                    setValue("archivoReferencia", file);
                    clearErrors("archivoReferencia");
                  } else if (file && !isValidFileType(file)) {
                    setError("archivoReferencia", {
                      type: "manual",
                      message: "El archivo debe ser un PDF",
                    });
                  }
                }}
              />
            </label>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {errors.referencias && (
              <span className="text-[#CF5459] text-xs">
                {errors.referencias?.message}
              </span>
            )}
            {errors.archivoReferencia && (
              <span className="text-[#CF5459] text-xs">
                {errors.archivoReferencia?.message}
              </span>
            )}
          </div>
        </div>

        {/* Referencia bancaria */}
        <div>
          <LabelTooltip
            label="*Referencia bancaria"
            tooltip="Datos de la cuenta bancaria del colaborador. Usados para procesos administrativos, como dispersión de nómina o reembolsos."
            htmlFor="referencia-bancaria-colaborador"
          />
          <Input
            id="referencia-bancaria-colaborador"
            type="text"
            placeholder="Ingrese la referencia bancaria"
            isError={!!errors.referenciaBancaria}
            disabled={mode === "view"}
            {...register("referenciaBancaria", {
              required:
                watch("tipoColaborador") === "Interno"
                  ? "Debes ingresar la referencia bancaria"
                  : false,
            })}
          />
          {errors.referenciaBancaria && (
            <span className="text-[#CF5459] text-xs">
              {errors.referenciaBancaria?.message}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default InformacionGeneralForm;
