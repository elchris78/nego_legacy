import { useEffect, useRef, useState } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DownArrow from "@/Asset/downArrow.svg";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { useSucursalForm } from "./SucursalesFormContext";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import Cookies from "js-cookie";
import { getColaboradores } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import { zonasActions } from "@/app/configuracion/configuracion-modulos/generales/catalogos/zonas/services/zonasSlice";
import { subZonasActions } from "@/app/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/services/subZonasSlice";
import { Controller } from "react-hook-form";
import { Option } from "@/components/ui/multiselect";
import { getCountries } from "@/app/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes/services/fabricantesActions";
import { alphanumericNoAccentsRegex, emailRegex, lettersNumbersSpecialsFirstUppercase, onlyNumbers, phoneNumberRegex } from "@/lib/utils/regex";
import { FiUpload } from "react-icons/fi";
import { getPostalCodeData } from "../../services/sucursalesActions";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ui/combobox";
import ViewImageModal from "@/components/ui/Modals/ViewImageModal";
import { set } from "date-fns";

const GeneralDataForm = () => {
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const token = Cookies.get("auth-token")
    const dispatch: AppDispatch = useDispatch();
    const {infoGeneralForm, domicilioFiscalForm, domicilioParticularForm,  currentSucursal, keyConfig } = useSucursalForm();
    const {
        register,
        formState: { errors },
        setValue,
        clearErrors,
        trigger: triggerInfo, 
        watch
    } = infoGeneralForm;

    const {
      register: registerFiscal,
      setValue: setFiscalValue,
      clearErrors: clearFiscalErrors,
      trigger: triggerFiscal,
      watch: watchFiscal,
      formState: { errors: fiscalErrors },
    } = domicilioFiscalForm;

    const {
      register: registerParticular,
      setValue: setParticularValue,
      clearErrors: clearParticularErrors,
      trigger: triggerParticular,
      watch: watchParticular,
      formState: { errors: ParticularErrors },
    } = domicilioParticularForm;


    const zonaSeleccionada = watch("ZonaId"); 
    const fileInputRefImagen = useRef<HTMLInputElement>(null);
    const fileInputRefComprobanteFiscal = useRef<HTMLInputElement>(null);
    const fileInputRefComprobanteAlterno = useRef<HTMLInputElement>(null);
    const [vendedorOptions, setVendedorOptions] = useState<{ label: string; value: string }[]>([]);
    const [countriesOptions, setCountriesOptions] = useState<Option[]>([]);
    const [colaboradoresOptions, setColaboradoresOptions] = useState<{ label: string; value: string }[]>([]);
    const zonas = useSelector((state: RootState) => state.zonas.zonas);
    const subZonas = useSelector((state: RootState) => state.subZonas.subzonas);
    const zonaOptions = zonas?.map((z) => ({ label: z.nombre, value: z.id })) || [];
    const subZonaOptions = subZonas?.map((sz) => ({ label: sz.nombre, value: sz.id })) || [];
    
    const [coloniasOptions, setColoniasOptions] = useState<{ label: string; value: string }[]>([]);
    const [estadoNombre, setEstadoNombre] = useState("");
    const [ciudadNombre, setCiudadNombre] = useState("");

    const [coloniasParticularOptions, setColoniasParticularOptions] = useState<{ label: string; value: string }[]>([]);
    const [estadoNombreParticular, setEstadoNombreParticular] = useState("");
    const [ciudadNombreParticular, setCiudadNombreParticular] = useState("");
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
    // Estados independientes para cada input de archivo
  const [imagenFileName, setImagenFileName] = useState("");
  const [comprobanteFiscalFileName, setComprobanteFiscalFileName] = useState("");
  const [comprobanteAlternoFileName, setComprobanteAlternoFileName] = useState("");
  const [errorImage, setErrorImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [enableManualFieldsFiscal, setEnableManualFieldsFiscal] = useState({
    estado: false,
    ciudad: false,
    colonia: false
  });

  const [enableManualFieldsParticular, setEnableManualFieldsParticular] = useState({
    estado: false,
    ciudad: false,
    colonia: false
  });

  const imageUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : typeof infoGeneralForm.watch("Imagen") === "string"
      ? infoGeneralForm.watch("Imagen")
      : currentSucursal?.imagen || "";

  // Handlers independientes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validImageExtensions = /\.(jpg|jpeg|png)$/i;
      if (!validImageExtensions.test(file.name)) {
        setErrorImage(
          "El archivo debe ser una imagen con extensión .jpg, .jpeg, .png."
        );
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      setImagenFileName(file.name);
      setValue("Imagen", file);
      clearErrors("Imagen");
      setErrorImage("");
    }
  };


  const handleComprobanteFiscalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobanteFiscalFileName(file.name);
      setValue("ComprobanteFiscal", file);
      clearErrors("ComprobanteFiscal");
    }
  };
  const handleComprobanteAlternoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setComprobanteAlternoFileName(file.name);
      setValue("ComprobanteAlterno", file);
      clearErrors("ComprobanteAlterno");
    }
  };


  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true", {
        shouldValidate: true,
        shouldDirty: true,
      });

      clearErrors("estatus");
    }
  }, [mode, setValue]);
  
  useEffect(() => {
  if ((mode === "edit" || mode === "view") && currentSucursal) {
    const sucursal = currentSucursal;

    // ✅ General
    setValue("UserProvidedId", sucursal.id ?? "");
    setValue("UserProvidedPrefix", keyConfig?.prefijo ?? "");
    setValue("estatus", sucursal.estatus?.toString() ?? "true");
    setValue("Imagen", sucursal.imagen ?? "");
    setValue("Nombre", sucursal.nombre  ?? "");
    setValue("Telefono", sucursal.telefono ?? "");
    setValue("ResponsablePrincipal", sucursal.responsablePrincipal ?? "");
    setValue("ResponsableSecundario", sucursal.responsableSecundario ?? "");
    setValue("HorarioAtencion", sucursal.horarioAtencion ?? "");
    setValue("CorreoContacto", sucursal.correoContacto ?? "");
    setValue("ZonaId", sucursal.zonaId ?? "");
    setValue("SubzonaId", sucursal.subzonaId ?? "");

    // ✅ Domicilio Fiscal
    setFiscalValue("Pais", sucursal.domicilioFiscal?.pais ?? "");
    setFiscalValue("CodigoPostal", sucursal.domicilioFiscal?.codigoPostal ?? "");
    setFiscalValue("Colonia", sucursal.domicilioFiscal?.colonia ?? "");
    setFiscalValue("Calle", sucursal.domicilioFiscal?.calle ?? "");
    setFiscalValue("NumeroExterior", sucursal.domicilioFiscal?.numeroExterior ?? "");
    setFiscalValue("NumeroInterior", sucursal.domicilioFiscal?.numeroInterior ?? "");
    setFiscalValue("ComprobanteDomicilio", sucursal.domicilioFiscal?.comprobanteDomicilio ?? "");
    setFiscalValue("CiudadNombre", sucursal.domicilioFiscal?.ciudadNombre ?? "");
    setFiscalValue("EstadoNombre", sucursal.domicilioFiscal?.estadoNombre ?? "");

    // ✅ Domicilio Particular
    setParticularValue("Pais", sucursal.domicilioParticular?.pais ?? "");
    setParticularValue("CodigoPostal", sucursal.domicilioParticular?.codigoPostal ?? "");
    setParticularValue("Colonia", sucursal.domicilioParticular?.colonia ?? "");
    setParticularValue("Calle", sucursal.domicilioParticular?.calle ?? "");
    setParticularValue("NumeroExterior", sucursal.domicilioParticular?.numeroExterior ?? "");
    setParticularValue("NumeroInterior", sucursal.domicilioParticular?.numeroInterior ?? "");
    setParticularValue("TelefonoParticular", sucursal.domicilioParticular?.telefonoParticular ?? "");
    setParticularValue("ComprobanteDomicilio", sucursal.domicilioParticular?.comprobanteDomicilio ?? "");
    setParticularValue("CiudadNombre", sucursal.domicilioParticular?.ciudadNombre ?? "");
    setParticularValue("EstadoNombre", sucursal.domicilioParticular?.estadoNombre ?? "");
    setValue("UserProvidedId",sucursal.userProvidedId ?? sucursal.id );
    // ✅ Validación si la necesitas
    triggerInfo
    triggerFiscal();
    triggerParticular

    // ✅ Archivos seleccionados
    if (typeof sucursal.imagen === "string") {
      setImagenFileName(sucursal.imagen.split("/").pop() || "");
    }

    if (typeof sucursal.domicilioFiscal?.comprobanteDomicilio === "string") {
      setComprobanteFiscalFileName(
        sucursal.domicilioFiscal.comprobanteDomicilio.split("/").pop() || ""
      );
    }

    if (typeof sucursal.domicilioParticular?.comprobanteDomicilio === "string") {
      setComprobanteAlternoFileName(
        sucursal.domicilioParticular.comprobanteDomicilio.split("/").pop() || ""
      );
    }

  }
}, [mode, currentSucursal]);


  useEffect(() => {
      const fetchColab = async () => {
        try {
          const token = Cookies.get("auth-token");
          const resp = await getColaboradores({
            token,
            params: { estatus: ["true"], tipoColaborador:["Interno"] }, // Solo activos
          });
          const options = (resp.colaboradores || []).map((colab) => ({
            label: colab.nombreCompleto ?? "", // Para el supervisor
            value: colab.id,
          }));
          setVendedorOptions(options);
          setColaboradoresOptions(options);
        } catch (error) {
          setVendedorOptions([]);
          setColaboradoresOptions([]);
        }
      };
      fetchColab();
    }, []);


  useEffect(() => {
    if (token) {
      dispatch(zonasActions.getZonas({ token, params: { isActive: ["true"] } }));
    }
  }, []);

  useEffect(() => {
  if (token && zonaSeleccionada) {
    dispatch(
      subZonasActions.getSubZonas({
        token,
        params: { isActive: ["true"], zonaClave: [zonaSeleccionada] },
      })
    );
  }
}, [token, zonaSeleccionada]);

  useEffect(() => {
    if (!token) return;
    const fetchCountries = async () => {
      const resp = await getCountries({ token });
      const options = resp.map((country) => ({
        value: country.c_Pais,
        label: country.descripcion,
      }));
      setCountriesOptions(options);
    };

    fetchCountries();
  }, [token]);

  useEffect(() => {
    const codigoPostalFiscal = watchFiscal("CodigoPostal");
    const codigoPostalParticular = watchParticular("CodigoPostal");

    const fetchPostalData = async (
      codigoPostal: string,
      isFiscal: boolean
    ) => {
      try {
        const resp = await getPostalCodeData({
          token,
          codigoPostal,
        });

        const colonias = resp.colonias || [];
        const estados = resp.estados || [];
        const ciudades = resp.ciudades || [];

        const coloniaOptions = colonias.map((col: any) => ({
          value: col.nombre,
          label: col.nombre,
        }));

        const estado = estados[0]?.nombre || "";
        const ciudad = ciudades[0]?.nombre || "";

        if (isFiscal) {
          setColoniasOptions(coloniaOptions);
          setEstadoNombre(estado);
          if (ciudad) {
            setFiscalValue("CiudadNombre", ciudad);
          }
          setEnableManualFieldsFiscal({
            estado: !estado,
            ciudad: !ciudad,
            colonia: !coloniaOptions.length,
          });
        } else {
          setColoniasParticularOptions(coloniaOptions);
          setEstadoNombreParticular(estado);
          setCiudadNombreParticular(ciudad);
          if (ciudad) {
            setParticularValue("CiudadNombre", ciudad);
          }
          setEnableManualFieldsParticular({
            estado: !estado,
            ciudad: !ciudad,
            colonia: !coloniaOptions.length,
          });
        }
      } catch (error) {
        if (isFiscal) {
          setColoniasOptions([]);
          setEstadoNombre("");
          setCiudadNombre("");
          setEnableManualFieldsFiscal({
            estado: true,
            ciudad: true,
            colonia: true,
          });
        } else {
          setColoniasParticularOptions([]);
          setEstadoNombreParticular("");
          setCiudadNombreParticular("");
          setEnableManualFieldsParticular({
            estado: true,
            ciudad: true,
            colonia: true,
          });
        }
        console.error("Error al obtener datos del código postal:", error);
      }
    };
    if (codigoPostalFiscal && codigoPostalFiscal.length === 5) {
      fetchPostalData(codigoPostalFiscal, true);
    }

    if (codigoPostalParticular && codigoPostalParticular.length === 5) {
      fetchPostalData(codigoPostalParticular, false);
    }
  }, [
    watchFiscal("CodigoPostal"),
    watchParticular("CodigoPostal"),
  ]);

  const prevPaisFiscalRef = useRef<string | undefined>();
const prevPaisParticularRef = useRef<string | undefined>();

useEffect(() => {
  const currentPaisFiscal = watchFiscal("Pais");
  const currentPaisParticular = watchParticular("Pais");

  // --- Cambio en País Fiscal ---
  if (
    prevPaisFiscalRef.current &&
    prevPaisFiscalRef.current !== currentPaisFiscal
  ) {
    setFiscalValue("CodigoPostal", "", { shouldValidate: true, shouldDirty: true });
    setFiscalValue("Colonia", "", { shouldValidate: true, shouldDirty: true });
    setFiscalValue("Calle", "", { shouldValidate: true, shouldDirty: true });
    setFiscalValue("NumeroExterior", "", { shouldValidate: true, shouldDirty: true });
    setFiscalValue("NumeroInterior", "", { shouldValidate: true, shouldDirty: true });
    setFiscalValue("ComprobanteDomicilio", "", { shouldValidate: true, shouldDirty: true });
    setColoniasOptions([]);
    setEstadoNombre("");
    setCiudadNombre("");
  }
  prevPaisFiscalRef.current = currentPaisFiscal;

  // --- Cambio en País Particular ---
  if (
    prevPaisParticularRef.current &&
    prevPaisParticularRef.current !== currentPaisParticular
  ) {
    setParticularValue("CodigoPostal", "", { shouldValidate: true, shouldDirty: true });
    setParticularValue("Colonia", "", { shouldValidate: true, shouldDirty: true });
    setParticularValue("Calle", "", { shouldValidate: true, shouldDirty: true });
    setParticularValue("NumeroExterior", "", { shouldValidate: true, shouldDirty: true });
    setParticularValue("NumeroInterior", "", { shouldValidate: true, shouldDirty: true });
    setParticularValue("ComprobanteDomicilio", "", { shouldValidate: true, shouldDirty: true });
    setColoniasParticularOptions([]);
    setEstadoNombreParticular("");
    setCiudadNombreParticular("");
  }
  prevPaisParticularRef.current = currentPaisParticular;
}, [
  watchFiscal("Pais"),
  watchParticular("Pais"),
]);


  return (
    <Accordion type="multiple" defaultValue={["general", "fiscal"]}  className="w-full space-y-4">
      {/* Datos generales */}
      <AccordionItem value="general" >
        <AccordionTrigger className="rounded border px-4 py-2 flex items-center">
          Datos generales
        </AccordionTrigger>
        <AccordionContent className="p-4 border-t">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Clave */}
            <div className="flex-1">
              <LabelTooltip
                label="*Clave sucursal"
                tooltip="Identificador único de la sucursal para uso interno de la empresa"
                htmlFor="clave-sucursal"
              />
              <Input
                id="clave-sucursal"
                type="text"
                placeholder="Ingresa clave de sucursal"
                value={watch("UserProvidedId")}
                disabled={
                  mode !== "new" ||
                  (keyConfig?.tipoClave !== "Numérico" &&
                    keyConfig?.tipoClave !== "Alfanumérico")
                }
                {...register("UserProvidedId", {
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
                  minLength: {
                    value: 1,
                    message: "La clave debe tener al menos 1 caracter",
                  },
                  validate: (value) => {
                    if (mode === "new" && keyConfig?.longitudMaxima) {
                      if (value && value.length > keyConfig.longitudMaxima) {
                        return `La clave no puede exceder los ${keyConfig.longitudMaxima} caracteres`;
                      }
                    }
                    return true;
                  },
                })}
              />
              {errors.UserProvidedId && (
                <span className="text-[#CF5459] text-xs">
                  {errors.UserProvidedId.message}
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
                    htmlFor="prefix-sucursal"
                  />
                  <Input
                    id="prefix-sucursal"
                    type="text"
                    placeholder="Prefijo personalizado"
                    isError={!!errors.UserProvidedPrefix}
                    disabled={mode !== "new"}
                    {...register("UserProvidedPrefix", {
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
                  {errors.UserProvidedPrefix && (
                    <span className="text-[#CF5459] text-xs">
                      {errors.UserProvidedPrefix.message}
                    </span>
                  )}
                </div>
            )}


            {/* Estatus de la sucursal */}
            <div className="flex-1">
              <LabelTooltip
                label="*Estatus"
                tooltip="Selecciona si la sucursal se encuentra activa o inactiva"
                htmlFor="status-sucursal"
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
                  infoGeneralForm.watch("estatus") ??
                  (mode !== "new"
                    ? currentSucursal?.estatus
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

            {/* Imagen */}
            <div className="flex-1">
              <LabelTooltip
              label="Imagen"
              tooltip="Selecciona la imagen"
              htmlFor="imagen"
              />
              <div className="relative flex items-center">
              <Input
                id="imagen"
                type="text"
                placeholder="Inserte imagen de sucursal"
                value={
                imagenFileName
                  ? `Archivo seleccionado - ${imagenFileName}`
                  : ""
                }
                readOnly
                isError={!!errors.Imagen}
                disabled={mode === "view"}
                className="pr-16" // Más espacio a la derecha
                onClick={() => {
                if (mode !== "view" && fileInputRefImagen.current) {
                  fileInputRefImagen.current.click();
                }
                }}
              />
              {/* Botón para abrir el selector de archivos */}
              {mode !== "view" && (
                <button
                type="button"
                onClick={() => fileInputRefImagen.current?.click()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                tabIndex={-1}
                aria-label="Seleccionar archivo"
                >
                <FiUpload size={20} />
                </button>
              )}
              </div>
              <input
              type="file"
              accept="image/*"
              ref={fileInputRefImagen}
              className="hidden"
              onChange={handleFileChange}
              />
              {errors.Imagen && (
              <span className="text-[#CF5459] text-xs">
                {errors.Imagen?.message}
              </span>
              )}
              {imageUrl && imageUrl !== "" && (
                <Button
                  type="button"
                  variant="link"
                  className=" text-[#4197CB]"
                  onClick={() => setShowImageModal(true)}
                >
                  Ver imagen
                </Button>
              )}

              {/* 🔽 Modal para mostrar la imagen */}
              <ViewImageModal
                open={showImageModal}
                onClose={() => setShowImageModal(false)}
                imagen={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : typeof infoGeneralForm.watch("Imagen") === "string"
                      ? (infoGeneralForm.watch("Imagen") as string)
                      : currentSucursal?.imagen || ""
                }
              />
              {errorImage && (
                <span className="text-[#CF5459] text-xs">
                  {errorImage}
                </span>
              )}
            </div>

          </div>
          <div className="h-2"/>
          <div className="flex flex-col md:flex-row gap-4">

            {/* Nombre de sucursal */}
            <div className="flex-1">
              <LabelTooltip
                label="*Nombre de Sucursal"
                tooltip="Nombre de la sucursal"
                htmlFor="nombre-sucursal"
              />
              <Input
                id="nombre-sucursal"
                placeholder="Ingrese nombre de sucursal"
                disabled={mode === "view"}
                {...register("Nombre", {
                  required: "El nombre es obligatorio",
                maxLength: {
                  value: 150,
                  message:
                    "La sucursal no puede contener más de 150 caracteres.",
                },
                pattern: {
                  value: /^[A-ZÁÉÍÓÚÑ]/,
                  message: "El nombre debe comenzar con mayúscula.",
                },
                  })}
                isError={!!errors.Nombre}
                />
              {errors.Nombre && (
                <span className="text-[#CF5459] text-xs">
                  {errors.Nombre.message}
                </span>
              )}
            </div>

            {/* Teléfono */}
            <div className="flex-1">
              <LabelTooltip
                label="*Teléfono"
                tooltip="Ingrese el teléfono"
                htmlFor="telefono"
              />
              <Input
                id="telefono"
                placeholder="Ingrese teléfono"
                disabled={mode === "view"}
                {...register("Telefono", {
                  required: "El teléfono es obligatorio",
                  maxLength: {
                  value: 10,
                  message:
                    "El número de teléfono no puede contener más de 10 dígitos.",
                  },
                  pattern: {
                  value: phoneNumberRegex,
                  message: "El teléfono debe contener solo números.",
                  },
                })}
                isError={!!errors.Telefono}
              />
              {errors.Telefono && (
                <span className="text-[#CF5459] text-xs">
                  {errors.Telefono.message}
                </span>
              )}
            </div>

            {/* Responsable principal */}
            <div className="flex-1">
              <LabelTooltip
                label="*Responsable principal"
                tooltip="Seleccione al responsable principal"
                htmlFor="responsable-principal"
              />
              <Controller
                control={infoGeneralForm.control}
                name="ResponsablePrincipal"
                rules={{ required: "Campo requerido" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mode === "view"}
                  >
                    <SelectTrigger error={!!errors.ResponsablePrincipal}>
                      <SelectValue placeholder="Selecciona responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {colaboradoresOptions.map((colab) => (
                          <SelectItem key={colab.value} value={colab.value}>
                            {colab.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ResponsablePrincipal && (
                <span className="text-[#CF5459] text-xs">
                  {errors.ResponsablePrincipal.message}
                </span>
              )}
            </div>

          </div>
          <div className="h-2"/>
          <div className="flex flex-col md:flex-row gap-4">

            {/* Responsable secundario */}
            <div className="flex-1">
            <LabelTooltip
              label="Responsable secundario"
              tooltip="Seleccione al responsable secundario"
              htmlFor="responsable-secundario"
            />
            <Controller
              control={infoGeneralForm.control}
              name="ResponsableSecundario"
              render={({ field }) => {
                const responsablePrincipalId = watch("ResponsablePrincipal");
                const optionsFiltradas = colaboradoresOptions.filter(
                  (colab) => colab.value !== responsablePrincipalId
                );

                return (
                  <Select onValueChange={field.onChange} value={field.value} 
                    disabled={mode === "view"}
                  >
                    <SelectTrigger error={!!errors.ResponsableSecundario}>
                      <SelectValue placeholder="Selecciona responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {optionsFiltradas.map((colab) => (
                          <SelectItem key={colab.value} value={colab.value}>
                            {colab.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.ResponsableSecundario && (
              <span className="text-[#CF5459] text-xs">
                {errors.ResponsableSecundario.message}
              </span>
            )}
          </div>


            {/* Horario */}
            <div className="flex-1">
              <LabelTooltip
                label="Horario de atención"
                tooltip="Descripción del rango de días y horas en que la sucursal opera o brinda atención"
                htmlFor="horario"
              />
              <Input 
                id="horario" 
                placeholder="Inserte su horario" 
                disabled={mode === "view"}
                 {...register("HorarioAtencion", {
                  pattern: {
                    value: /^[0-9]{1,2}:[0-9]{2} - [0-9]{1,2}:[0-9]{2}$/,
                    message: "Formato inválido. Ejemplo: 09:00 - 17:00",
                  },
                })}
              />
              {errors.HorarioAtencion && (
                <span className="text-[#CF5459] text-xs">
                  {errors.HorarioAtencion.message}
                </span>
              )}
            </div>

            {/* Correo de contacto */}
            <div className="flex-1">
              <LabelTooltip
                label="*Correo de contacto"
                tooltip="Ingrese su correo de contacto"
                htmlFor="correo-contacto"
              />
              <Input
              id="correo-contacto"
              disabled={mode === "view"}
              placeholder="Ingrese correo"
              {...register("CorreoContacto", {
                required: "El correo de contacto es obligatorio",
                maxLength: {
                value: 50,
                message:
                  "El correo electrónico no puede contener más de 50 caracteres.",
              },
                pattern: {
                  value: emailRegex,
                  message: "Debe tener formato de correo electrónico",
                },
              })}
              isError={!!errors.CorreoContacto}
              />
              {errors.CorreoContacto && (
                <span className="text-[#CF5459] text-xs">
                  {errors.CorreoContacto.message}
                </span>
              )}
            </div>
          </div>
          <div className="h-2"/>
          <div className="flex flex-col md:flex-row gap-4">

            {/* Zona */}
            <div className="flex-1">
              <LabelTooltip
                label="Zona"
                tooltip="Seleccione una zona"
                htmlFor="zona"
              />
              <Select
                value={watch("ZonaId") || ""}
                onValueChange={(value) => {
                  setValue("ZonaId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  clearErrors("ZonaId");
                  // Limpiar subzona al cambiar zona
                  setValue("SubzonaId", "");
                }}
                disabled={mode === "view"}
              >
                <SelectTrigger error={!!errors.ZonaId}>
                  <SelectValue placeholder="Selecciona una zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {zonaOptions.map((zona) => (
                      <SelectItem key={zona.value} value={zona.value}>
                        {zona.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.ZonaId && (
                <span className="text-[#CF5459] text-xs">
                  {errors.ZonaId.message}
                </span>
              )}
            </div>


            {/* Subzona */}
            <div className="flex-1">
              <LabelTooltip
                label="Subzona"
                tooltip="Seleccione una subzona"
                htmlFor="subzona"
              />
              <Select
                value={watch("SubzonaId") || ""}
                onValueChange={(value) => {
                  setValue("SubzonaId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  clearErrors("SubzonaId");
                }}
                disabled={mode === "view" || !watch("ZonaId")}
              >
                <SelectTrigger error={!!errors.SubzonaId}>
                  <SelectValue placeholder="Selecciona una subzona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subZonaOptions.map((subzona) => (
                      <SelectItem key={subzona.value} value={subzona.value}>
                        {subzona.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.SubzonaId && (
                <span className="text-[#CF5459] text-xs">
                  {errors.SubzonaId.message}
                </span>
              )}
            </div>

            <div className="flex-1" />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Domicilio fiscal */}
      <AccordionItem value="fiscal">
        <AccordionTrigger className="rounded border px-4 py-2 flex items-center">
          Domicilio fiscal
        </AccordionTrigger>
        <AccordionContent className="p-4 border-t">
          <div className="flex flex-col md:flex-row gap-4">

            {/* País */}
          <div className="flex-1">
            <LabelTooltip
              label="*País"
              tooltip="Ingrese el país"
              htmlFor="pais"
            />
            <ComboBox
              options={countriesOptions} // ✅ usa los mismos valores
              placeholder="Selecciona un país"
              disabled={mode === "view"}
              defaultValue={watchFiscal("Pais") || undefined} // ✅ mantiene el valor seleccionado
              hasError={!!fiscalErrors.Pais}
              onSelect={(value) => {
                setFiscalValue("Pais", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                clearFiscalErrors("Pais");
              }}
              {...registerFiscal("Pais",{
                required:"campo requerido"
              })}
            />
            {fiscalErrors.Pais && (
              <span className="text-[#CF5459] text-xs">
                {fiscalErrors.Pais?.message}
              </span>
            )}
          </div>


            {/* Código Postal */}
            <div className="flex-1">
              <LabelTooltip
                label="*Código postal"
                tooltip="Ingrese el código postal"
                htmlFor="codigo-postal"
              />
              <Input
                id="codigo-postal"
                placeholder="Ingrese código postal"
                disabled={mode === "view"}
                value={watchFiscal("CodigoPostal") || ""}
                {...registerFiscal("CodigoPostal", {
                required: "El codigo postal es obligatorio",
                minLength:{
                  value:5,
                  message:
                    "El codigo postal debe tener 5 numeros.",
                },
                maxLength: {
                value: 5,
                message:
                    "El codigo postal debe tener 5 numeros.",
                },
                pattern: {
                  value: onlyNumbers,
                  message: "Debe ser mumeros",
                },
              })}
                onChange={(e) =>
                  setFiscalValue("CodigoPostal", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                
                isError={!!fiscalErrors.CodigoPostal}
                helperText={fiscalErrors.CodigoPostal?.message}
              />
            </div>

            {/* Estado */}
            <div className="flex-1">
              <LabelTooltip
                label="*Estado"
                tooltip="Ingrese un estado"
                htmlFor="estado"
              />
              <Input
                id="estado"
                placeholder="Ingrese estado"
                value={estadoNombre || watchFiscal("EstadoNombre") || ""}
                disabled={mode === "view" || !watchFiscal("Pais") || (watchFiscal("Pais") === "MEX" && !enableManualFieldsFiscal.estado)}
                onChange={(e) => setEstadoNombre(e.target.value)}
              />
            </div>
          </div>

          <div className="h-2" />
          <div className="flex flex-col md:flex-row gap-4">

            {/* Ciudad */}
            <div className="flex-1">
              <LabelTooltip
                label="*Ciudad"
                tooltip="Ingrese una ciudad"
                htmlFor="ciudad"
              />
              <Input
                id="ciudad"
                placeholder="Ingrese ciudad"
                value={ciudadNombre || watchFiscal("CiudadNombre") || ""}
                 {...registerFiscal("CiudadNombre")}
                disabled={mode === "view" || !watchFiscal("Pais") || (watchFiscal("Pais") === "MEX" && !enableManualFieldsFiscal.ciudad)}
                onChange={(e) => setCiudadNombre(e.target.value)}
              />
            </div>

            {/* Colonia */}
            <div className="flex-1">
              <LabelTooltip
                label="*Colonia"
                tooltip="Seleccione una colonia"
                htmlFor="colonia"
              />
              {watchFiscal("Pais") !== "MEX" || enableManualFieldsFiscal.colonia ? (
                <Input
                  id="colonia"
                  type="text"
                  placeholder="Ingrese colonia"
                  disabled={mode === "view" }
                  value={watchFiscal("Colonia") || ""}
                  isError={!!fiscalErrors.Colonia}
                  onChange={(e) =>
                    setFiscalValue("Colonia", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
              ) : (
                <ComboBox
                  options={coloniasOptions}
                  placeholder="Selecciona una colonia"
                  disabled={mode === "view"}
                  defaultValue={watchFiscal("Colonia") || undefined}
                  hasError={!!fiscalErrors.Colonia}
                  onSelect={(value) => {
                    setFiscalValue("Colonia", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    clearFiscalErrors("Colonia");
                  }}
                  {...registerFiscal("Colonia", {
                    required: "campo requerido",
                  })}
                />
              )}
              {fiscalErrors.Colonia?.message && (
                <p className="text-red-500 text-sm mt-1">{fiscalErrors.Colonia.message}</p>
              )}
            </div>

            {/* Calle */}
            <div className="flex-1">
              <LabelTooltip
                label="*Calle"
                tooltip="Ingrese una calle"
                htmlFor="calle"
              />
              <Input
                id="calle"
                placeholder="Ingrese calle"
                disabled={mode === "view"}
                {...registerFiscal("Calle",{
                  required: "campo requerido"
                })}
                value={watchFiscal("Calle") || ""}
                onChange={(e) =>
                  setFiscalValue("Calle", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                isError={!!fiscalErrors.Calle}
                helperText={fiscalErrors.Calle?.message}
              />
            </div>
          </div>

          <div className="h-2" />
          <div className="flex flex-col md:flex-row gap-4">

            {/* Número exterior */}
            <div className="flex-1">
              <LabelTooltip
                label="*Número exterior"
                tooltip="Ingrese un número exterior"
                htmlFor="numero-exterior"
              />
              <Input
                id="numero-exterior"
                placeholder="Inserte número exterior"
                disabled={mode === "view"}
                value={watchFiscal("NumeroExterior") || ""}
                {...registerFiscal("NumeroExterior",{
                  required: "campo requerido"
                })}
                onChange={(e) =>
                  setFiscalValue("NumeroExterior", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                isError={!!fiscalErrors.NumeroExterior}
                helperText={fiscalErrors.NumeroExterior?.message}
              />
            </div>

            {/* Número interior */}
            <div className="flex-1">
              <LabelTooltip
                label="Número interior"
                tooltip="Ingrese un número interior"
                htmlFor="numero-interior"
              />
              <Input
                id="numero-interior"
                placeholder="Inserte número interior"
                disabled={mode === "view"}
                value={watchFiscal("NumeroInterior") || ""}
                onChange={(e) =>
                  setFiscalValue("NumeroInterior", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                isError={!!fiscalErrors.NumeroInterior}
                helperText={fiscalErrors.NumeroInterior?.message}
              />
            </div>
            {/* Comprobante de domicilio*/}
            <div className="flex-1">
              <LabelTooltip
              label="Comprobante de domicilio"
              tooltip="Seleccione comprobante de domicilio"
              htmlFor="comprobante-domicilio"
              />
              <div className="relative flex items-center">
              <Input
                id="comprobante-domicilio"
                type="text"
                placeholder="Inserte imagen de comprobante"
                value={
                comprobanteFiscalFileName
                  ? `Archivo seleccionado - ${comprobanteFiscalFileName}`
                  : ""
                }
                readOnly
                isError={!!errors.ComprobanteFiscal}
                disabled={mode === "view"}
                className="pr-16" // Más espacio a la derecha
                onClick={() => {
                if (mode !== "view" && fileInputRefComprobanteFiscal.current) {
                  fileInputRefComprobanteFiscal.current.click();
                }
                }}
              />
              {/* Botón para abrir el selector de archivos */}
              {mode !== "view" && (
                <button
                type="button"
                onClick={() => fileInputRefComprobanteFiscal.current?.click()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                tabIndex={-1}
                aria-label="Seleccionar archivo"
                >
                <FiUpload size={20} />
                </button>
              )}
              </div>
              <input
              type="file"
              accept="image/*"
              ref={fileInputRefComprobanteFiscal}
              className="hidden"
              onChange={handleComprobanteFiscalChange}
              />
              {errors.ComprobanteFiscal && (
              <span className="text-[#CF5459] text-xs">
                {errors.ComprobanteFiscal.message}
              </span>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>


      {/* Domicilio alterno */}
      <AccordionItem value="alterno" className="pb-5">
        <AccordionTrigger className="rounded border px-4 py-2 flex items-center">
          Domicilio alterno
        </AccordionTrigger>
        <AccordionContent className="p-4 border-t">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* País */}
            <div className="flex-1">
              <LabelTooltip
                label="País"
                tooltip="Ingrese el país"
                htmlFor="pais"
              />
              <ComboBox
                options={countriesOptions} // ✅ usa los mismos valores
                placeholder="Selecciona un país"
                disabled={mode === "view"}
                defaultValue={watchParticular("Pais") || undefined} // ✅ mantiene el valor seleccionado
                hasError={!!ParticularErrors.Pais}
                onSelect={(value) => {
                  setParticularValue("Pais", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  clearParticularErrors("Pais");
                }}
              />
            </div>

            {/* Código Postal */}
            <div className="flex-1">
              <LabelTooltip
                label="Código postal"
                tooltip="Ingrese el código postal"
                htmlFor="codigo-postal"
              />
              <Input
                id="codigo-postal"
                placeholder="Ingrese código postal"
                disabled={mode === "view"}
                value={watchParticular("CodigoPostal") || ""}
                {...registerParticular("CodigoPostal", {
                minLength:{
                  value:5,
                  message:
                    "El codigo postal debe tener 5 numeros.",
                },
                maxLength: {
                value: 5,
                message:
                    "El codigo postal debe tener 5 numeros.",
                },
                pattern: {
                  value: onlyNumbers,
                  message: "Debe ser mumeros",
                },
              })}
                onChange={(e) =>
                  setParticularValue("CodigoPostal", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                
                isError={!!ParticularErrors.CodigoPostal}
                helperText={ParticularErrors.CodigoPostal?.message}
              />
            </div>

            {/* Estado */}
            <div className="flex-1">
              <LabelTooltip
                label="Estado"
                tooltip="Ingrese un estado"
                htmlFor="estado"
              />
              <Input
                id="estado"
                placeholder="Ingrese estado"
                value={estadoNombreParticular || watchParticular("EstadoNombre") || ""}
                disabled={mode === "view"|| !watchParticular("Pais") || (watchParticular("Pais") === "MEX" && !enableManualFieldsParticular.estado)}
                onChange={(e) => setEstadoNombreParticular(e.target.value)}
              />
            </div>
          </div>

          <div className="h-2" />
            <div className="flex flex-col md:flex-row gap-4">

              {/* Ciudad */}
              <div className="flex-1">
                <LabelTooltip
                  label="Ciudad"
                  tooltip="Ingrese una ciudad"
                  htmlFor="ciudad"
                />
                <Input
                  id="ciudad"
                  placeholder="Ingrese ciudad"
                  value={ciudadNombreParticular || watchParticular("CiudadNombre") || ""}
                 {...registerParticular("CiudadNombre")}
                  disabled={mode === "view" || !watchParticular("Pais") || (watchParticular("Pais") === "MEX" && !enableManualFieldsParticular.ciudad)}
                  onChange={(e) => setCiudadNombreParticular(e.target.value)}
                />
              </div>

              {/* Colonia */}
              <div className="flex-1">
                <LabelTooltip
                  label="Colonia"
                  tooltip="Seleccione una colonia"
                  htmlFor="colonia"
                />
                {watchParticular("Pais") !== "MEX" || enableManualFieldsParticular.colonia ? (
                  <Input
                    id="colonia"
                    type="text"
                    placeholder="Ingrese colonia"
                    disabled={mode === "view" }
                    value={watchParticular("Colonia") || ""}
                    isError={!!ParticularErrors.Colonia}
                    onChange={(e) =>
                      setParticularValue("Colonia", e.target.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                ) : (
                  <ComboBox
                    options={coloniasParticularOptions}
                    placeholder="Selecciona una colonia"
                    disabled={mode === "view"}
                    defaultValue={watchParticular("Colonia") || undefined}
                    hasError={!!ParticularErrors.Colonia}
                    onSelect={(value) => {
                      setParticularValue("Colonia", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      clearParticularErrors("Colonia");
                    }}
                    {...registerParticular("Colonia", {
                      required: "campo requerido",
                    })}
                  />
                )}
                {ParticularErrors.Colonia?.message && (
                  <p className="text-red-500 text-sm mt-1">{ParticularErrors.Colonia.message}</p>
                )}
              </div>

              {/* Calle */}
              <div className="flex-1">
                <LabelTooltip
                  label="Calle"
                  tooltip="Ingrese una calle"
                  htmlFor="calle"
                />
                <Input
                  id="calle"
                  placeholder="Ingrese calle"
                  disabled={mode === "view"}
                  value={watchParticular("Calle") || ""}
                  onChange={(e) =>
                    setParticularValue("Calle", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  isError={!!ParticularErrors.Calle}
                  helperText={ParticularErrors.Calle?.message}
                />
              </div>
            </div>

          <div className="h-2" />
            <div className="flex flex-col md:flex-row gap-4">

              {/* Número exterior */}
              <div className="flex-1">
                <LabelTooltip
                  label="Número exterior"
                  tooltip="Ingrese un número exterior"
                  htmlFor="numero-exterior"
                />
                <Input
                  id="numero-exterior"
                  placeholder="Inserte número exterior"
                  disabled={mode === "view"}
                  value={watchParticular("NumeroExterior") || ""}
                  onChange={(e) =>
                    setParticularValue("NumeroExterior", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  isError={!!ParticularErrors.NumeroExterior}
                  helperText={ParticularErrors.NumeroExterior?.message}
                />
              </div>

              {/* Número interior */}
              <div className="flex-1">
                <LabelTooltip
                  label="Número interior"
                  tooltip="Ingrese un número interior"
                  htmlFor="numero-interior"
                />
                <Input
                  id="numero-interior"
                  placeholder="Inserte número interior"
                  disabled={mode === "view"}
                  value={watchParticular("NumeroInterior") || ""}
                  onChange={(e) =>
                    setParticularValue("NumeroInterior", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  isError={!!ParticularErrors.NumeroInterior}
                  helperText={ParticularErrors.NumeroInterior?.message}
                />
              </div>

              {/* Teléfono particular */}
              <div className="flex-1">
                <LabelTooltip
                  label="Teléfono particular"
                  tooltip="Ingrese un teléfono particular"
                  htmlFor="telefono-particular"
                />
                <Input
                  id="telefono-particular"
                  placeholder="Inserte teléfono particular"
                  disabled={mode === "view"}
                  value={watchParticular("TelefonoParticular") || ""}
                  {...registerParticular("TelefonoParticular", {
                    maxLength: {
                    value: 10,
                    message:
                      "El número de teléfono no puede contener más de 10 dígitos.",
                    },
                    pattern: {
                    value: phoneNumberRegex,
                    message: "El teléfono debe contener solo números.",
                    },
                  })}
                  onChange={(e) =>
                    setParticularValue("TelefonoParticular", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  isError={!!ParticularErrors.TelefonoParticular}
                  helperText={ParticularErrors.TelefonoParticular?.message}
                />
              </div>
            </div>

          <div className="h-2" />
            <div className="flex flex-col md:flex-row gap-4">

              {/* Comprobante de domicilio */}
                <div className="flex-1">
                <LabelTooltip
                label="Comprobante de domicilio"
                tooltip="Seleccione comprobante de domicilio"
                htmlFor="comprobante-domicilio"
                />
                <div className="relative flex items-center">
                <Input
                  id="comprobante-domicilio"
                  type="text"
                  placeholder="Inserte imagen de comprobante"
                  value={
                  comprobanteAlternoFileName
                    ? `Archivo seleccionado - ${comprobanteAlternoFileName}`
                    : ""
                  }
                  readOnly
                  isError={!!errors.ComprobanteAlterno}
                  disabled={mode === "view"}
                  className="pr-16" // Más espacio a la derecha
                  onClick={() => {
                  if (mode !== "view" && fileInputRefComprobanteAlterno.current) {
                    fileInputRefComprobanteAlterno.current.click();
                  }
                  }}
                />
                {/* Botón para abrir el selector de archivos */}
                {mode !== "view" && (
                  <button
                  type="button"
                  onClick={() => fileInputRefComprobanteAlterno.current?.click()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                  tabIndex={-1}
                  aria-label="Seleccionar archivo"
                  >
                  <FiUpload size={20} />
                  </button>
                )}
                </div>
                <input
                type="file"
                accept="image/*"
                ref={fileInputRefComprobanteAlterno}
                className="hidden"
                onChange={handleComprobanteAlternoChange}
                />
                {errors.ComprobanteAlterno && (
                <span className="text-[#CF5459] text-xs">
                  {errors.ComprobanteAlterno.message}
                </span>
                )}
              </div>
              <div className="flex-1" />
              <div className="flex-1" />
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default GeneralDataForm;