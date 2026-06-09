import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import {
  alphanumericNoAccentsRegex,
  emailRegex,
  firstLetterUppercase,
  onlyNumbers,
  phoneNumberRegex,
} from "@/utils/regex";
import { useSellersForm } from "./SellersContext";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import DownArrow from "@/Asset/downArrow.svg";
import Cookies from "js-cookie";
import { getSellerTypes } from "../../../tipos-vendedores/services/sellersTypesActions";
import { getSubZonas } from "@/app/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/services/subZonasActions";
import { getColaboradores } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { getZonas } from "@/app/configuracion/configuracion-modulos/generales/catalogos/zonas/services/zonasActions";
import { subZonasActions } from "@/app/configuracion/configuracion-modulos/generales/catalogos/sub-zonas/services/subZonasSlice";
import { zonasActions } from "@/app/configuracion/configuracion-modulos/generales/catalogos/zonas/services/zonasSlice";
import { sellersActions } from "../../services/sellersSlice";

type ColaboradorOption = {
  label: string;
  labelNombre: string;
  value: string;
  valueSupervisor: string;
  nombreCompleto: string;
  telefono?: string;
  correo?: string;
};
export const checkboxSx = {
  padding: 0.5,
  "& .MuiSvgIcon-root": {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "1.5px solid #5B6670",
    backgroundColor: "transparent",
    path: {
      display: "none",
    },
  },
  "&.Mui-checked": {
    "& .MuiSvgIcon-root": {
      backgroundColor: "#4197CB",
      border: "none",
    },
  },
};

export const textFieldSx = (mode: string | null, disabled: boolean = false) => ({
  marginTop: "4px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "4.5vh",
    backgroundColor:
      mode === "view" || disabled ? "#E3E1E6" : "white",
    color: mode === "view" || disabled ? "#949DA4" : "#5D6D7E",
    "& fieldset": {
      borderColor: "#C1C5C8",
    },
    "&:hover fieldset": {
      borderColor: "#C1C5C8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C1C5C8",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#5D6D7D",
  },
  "& .Mui-focused": {
    color: "#5D6D7D",
  },
});


export const autocompleteSx = {
  "& .MuiAutocomplete-inputRoot": {
    padding: "4px",
  },
};


const comisionOptions = [  
  { value: "Global", label: "Global" },
  { value: "Variable", label: "Variable" },
]

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token")
  const dispatch: AppDispatch = useDispatch();
  const [typeSellersOptions, setTypeSellersOptions] = useState<{ label: string; value: string }[]>([]);
  const [colabOptions, setColabOptions] = useState<ColaboradorOption[]>([]);
  const [allColabOptions, setAllColabOptions] = useState<ColaboradorOption[]>([]);
  const zonas = useSelector((state: RootState) => state.zonas.zonas);
  const subZonas = useSelector((state: RootState) => state.subZonas.subzonas);
  const zonaOptions = zonas?.map((z) => ({ label: z.nombre, value: z.id })) || [];
  const subZonaOptions = subZonas?.map((sz) => ({ label: sz.nombre, value: sz.id })) || [];
  const [limiteComision, setLimiteComision] = useState<number>(100);
  const [colabData, setColabData] = useState({
    nombreCompleto: "",
    telefono: "",
    correo: "",
  });
  const sellers = useSelector(
    (state: RootState) => state.sellers.sellers
  );

  const { generalDataForm, currentSellers, keyConfig } =
    useSellersForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    trigger, // Destructure trigger from generalDataForm
  } = generalDataForm;
  const zonaSeleccionada = watch("zonaId"); 
  const tipoComisionValue = watch("tipoComision");
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
    if ((mode === "edit" || mode === "view") && currentSellers) {
      setValue("userProvidedId", currentSellers.id ?? "");
      setValue("userProvidedPrefix", keyConfig?.prefijo ?? "");
        setValue("isActive", currentSellers.estatus ? "true" : "false");
        setValue("tipoVendedorId", currentSellers.tipoVendedorId || "");
        setValue("colaboradorId", currentSellers.colaboradorId || "");
        setValue("supervisorId", currentSellers.supervisorId || "");
        setValue("zonaId", currentSellers.zonaId || "");
        setValue("subzonaId", currentSellers.subzonaId || "");
        setValue("tipoComision", currentSellers.tipoComision || "");
        setValue("porcentajeComisionGlobal", currentSellers.porcentajeComisionGlobal ?? 0);
      setValue("userProvidedId",currentSellers.userProvidedId ?? currentSellers.id );
          setTimeout(() => {
      trigger(); // Esto fuerza validación
    }, 100);
    }
  }, [mode, currentSellers, setValue, trigger]); 

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentSellers?.colaboradorId && colabOptions.length > 0) {
      const selectedColab = colabOptions.find(c => c.value === currentSellers.colaboradorId);
      if (selectedColab) {
        setColabData({
          nombreCompleto: selectedColab.nombreCompleto || "",
          telefono: selectedColab.telefono || "",
          correo: selectedColab.correo || "",
        });
      }
    }
  }, [mode, currentSellers, colabOptions]);


  useEffect(() => {
    const fetchTypeSeller = async () => {
      try {
        const token = Cookies.get("auth-token");
        const resp = await getSellerTypes({
          token,
          params: { isActive: ["true"] }, // Solo activos
        });
        const options = (resp.tiposVendedor || []).map((tiv) => ({
          label: tiv.nombre,
          value: tiv.id,
        }));
        setTypeSellersOptions(options);
      } catch (error) {
        setTypeSellersOptions([]);
      }
    };
    fetchTypeSeller();
  }, []);

  useEffect(() => {
    const fetchColab = async () => {
      try {
        const token = Cookies.get("auth-token");
        const resp = await getColaboradores({
          token,
          params: { estatus: ["true"] },
        });

        const allOptions: ColaboradorOption[] = (resp.colaboradores || []).map((colab) => ({
          label: `${colab.id} - ${colab.nombreCompleto ?? ""}`,
          labelNombre: colab.nombreCompleto ?? "",
          valueSupervisor: colab.id,
          value: colab.id,
          nombreCompleto: colab.nombreCompleto ?? "",
          telefono: colab.telefono ?? "",
          correo: colab.correoElectronico ?? "",
        }));

        setAllColabOptions(allOptions);

        // Esperar a que sellers esté disponible
        if (!sellers || sellers.length === 0) {
          setColabOptions(allOptions); // Evita filtrar mal
          return;
        }

        const usedColaboradorIds = sellers.map(s => s.colaboradorId);
        const currentColabId = currentSellers?.colaboradorId;

        const filteredOptions = allOptions.filter(
          (colab) =>
            !usedColaboradorIds.includes(colab.value) ||
            colab.value === currentColabId
        );

        setColabOptions(filteredOptions);
      } catch (error) {
        setColabOptions([]);
        setAllColabOptions([]);
      }
    };

    if (token && sellers) {
      fetchColab();
    }
  }, [sellers, currentSellers, token]);



  useEffect(() => {
    if (token) {
      dispatch(zonasActions.getZonas({ token, params: { isActive: ["true"] } }));
      dispatch(sellersActions.getSellers({token, params: {isActive: ["true"]}}));
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
  if (tipoComisionValue === "Global") {
    setLimiteComision(100);
  } else if (tipoComisionValue === "Variable") {
    setLimiteComision(0); // o el valor que quieras usar como condición en variable
  } else {
    setLimiteComision(100); // por defecto
  }
}, [tipoComisionValue]);

const porcentajeField = register("porcentajeComisionGlobal", {
  valueAsNumber: true,
  min: {
    value: 0,
    message: "Debe ser mínimo 0",
  },
});

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID  vendedor */}
        <div>
          <LabelTooltip
            label="*Clave tipo de vendedor"
            tooltip="Identificador único del Vendedor para uso interno de la empresa"
            htmlFor="Clave-vendedor"
          />
          <Input
            id="Clave-vendedor"
            type="text"
            placeholder="Clave Tipo de vendedor"
            value={watch("userProvidedId")}
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
          {errors.userProvidedId && (
            <span className="text-[#CF5459] text-xs">
              {errors.userProvidedId.message}
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
                isError={!!errors.userProvidedPrefix}
                disabled={mode !== "new"}
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

        {/* tipó vendedor */}
        <div>
          <LabelTooltip
            label="*Tipo de vendedor"
            tooltip="Selecciona el tipo de vendedor asignado al vendedor"
            htmlFor="tipov-vendedor"
          />
          <Autocomplete
            disablePortal
            options={typeSellersOptions}
            getOptionLabel={(option) => option.label}
            
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              typeSellersOptions.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("tipoVendedorId") ??
                    currentSellers?.tipoVendedor ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("tipoVendedorId", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("tipoVendedorId");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={option.value} {...rest}>
                  <Checkbox checked={selected} sx={checkboxSx} />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona el tipo de vendedor asignado al vendedor"
                {...params}
                error={!!errors.tipoVendedorId}
                helperText={errors.tipoVendedorId?.message}
                sx={textFieldSx(mode)}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* clave colaborador */}
        <div>
          <LabelTooltip
            label="*Clave colaborador"
            tooltip="Selecciona el colaborador que se va a asignar como vendedor. Solo se muestran los colaboradores registrados en el catálogo"
            htmlFor="fabricante"
          />
          <Autocomplete
            disablePortal
            options={colabOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              colabOptions.length > 0
                ? colabOptions.find(
                    (opt) =>
                      opt.value ===
                      (generalDataForm.watch("colaboradorId") ?? currentSellers?.colaboradorId ?? "")
                  ) ?? null
                : null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("colaboradorId", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("colaboradorId");

              // Si seleccionaste un colaborador, actualiza los valores de los campos auxiliares
              if (newValue) {
                setColabData({
                  nombreCompleto: newValue.nombreCompleto || "",
                  telefono: newValue.telefono || "",
                  correo: newValue.correo || "",
                });
              } else {
                setColabData({
                  nombreCompleto: "",
                  telefono: "",
                  correo: "",
                });
              }
            }}
            popupIcon={<DownArrow />}
            disabled={mode !== "new"}
              renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={option.value} {...rest}>
                  <Checkbox checked={selected} sx={checkboxSx} />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona una opción"
                {...params}
                error={!!errors.colaboradorId}
                helperText={errors.colaboradorId?.message}
                sx={textFieldSx(mode, mode !== "new")}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* Nombre */}
        <div>
          <LabelTooltip
            label="*Nombre"
            tooltip="Nombre completo del colaborador asignado como vendedor"
            htmlFor="name"
          />
          <Input
            id="name"
            type="text"
            placeholder="Nombre del colaborador"
            disabled
            value={colabData.nombreCompleto}
          />
        </div>

        {/* telefono */}
        <div>
          <LabelTooltip
            label="*Teléfono"
            tooltip="Teléfono del colaborador asignado como vendedor"
            htmlFor="Telefono"
          />
          <Input
            id="Telefono"
            type="text"
            placeholder="Teléfono del colaborador"
            disabled
            value={colabData.telefono}
          />
          
        </div>

        {/* correo */}
        <div>
          <LabelTooltip
            label="*Correo electrónico"
            tooltip="Correo electrónico del colaborador asignado como vendedor"
            htmlFor="correo"
          />
          <Input
            id="correo"
            type="text"
            placeholder="Correo electrónico del colaborador"
            disabled
            value={colabData.correo}
          />
          
        </div>

        {/* Supervisor */}
        <div>
          <LabelTooltip
            label="*Supervisor"
            tooltip="Selecciona el supervisor asignado a este Vendedor"
            htmlFor="Supervisor"
          />

          {(() => {
            const colaboradorSeleccionadoId = watch("colaboradorId");
            const opcionesSupervisorFiltradas = allColabOptions.filter(
              (opt) => opt.value !== colaboradorSeleccionadoId
            );
            return (
              <Autocomplete
                disablePortal
                options={opcionesSupervisorFiltradas}
                getOptionLabel={(option) => option.labelNombre}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.valueSupervisor
                }
                value={
                  opcionesSupervisorFiltradas.find(
                    (opt) =>
                      opt.value ===
                      (generalDataForm.watch("supervisorId") ??
                        currentSellers?.supervisorId ??
                        "")
                  ) ?? null
                }
                onChange={(_, newValue) => {
                  const selectedValue = newValue?.valueSupervisor ?? "";
                  setValue("supervisorId", selectedValue, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  clearErrors("supervisorId");
                }}
                popupIcon={<DownArrow />}
                disabled={mode === "view" || !colaboradorSeleccionadoId}
                renderOption={(props, option, { selected }) => {
                  const { key, ...rest } = props;
                  return (
                    <li key={option.valueSupervisor} {...rest}>
                      <Checkbox checked={selected} sx={checkboxSx} />
                      {option.labelNombre}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    placeholder="Selecciona el supervisor"
                    {...params}
                    error={!!errors.supervisorId}
                    helperText={errors.supervisorId?.message}
                    sx={textFieldSx(mode, mode === "view" || !colaboradorSeleccionadoId)}
                  />
                )}
                sx={autocompleteSx}
              />
            );
          })()}
        </div>


        {/* Zona */}
        <div>
          <LabelTooltip
            label="*Zona"
            tooltip="Selecciona la zona asignada al vendedor"
            htmlFor="Zona"
          />
          <Autocomplete
            disablePortal
            options={zonaOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              zonaOptions.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("zonaId") ??
                    currentSellers?.zona ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";

              // Limpiar subzona cuando cambia zona
              setValue("subzonaId", "", {
                shouldValidate: true,
                shouldDirty: true,
              });

              setValue("zonaId", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });

              clearErrors("zonaId");
              clearErrors("subzonaId");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={option.value} {...rest}>
                  <Checkbox checked={selected} sx={checkboxSx} />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona la zona"
                {...params}
                error={!!errors.zonaId}
                helperText={errors.zonaId?.message}
                sx={textFieldSx(mode)}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* Subzona */}
        <div>
          <LabelTooltip
            label="Subzona"
            tooltip="Selecciona la subzona asignada al vendedor, según la zona previamente seleccionada"
            htmlFor="fabricante"
          />
          <Autocomplete
            disablePortal
            options={subZonaOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              subZonaOptions.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("subzonaId") ??
                    currentSellers?.subzonaId ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("subzonaId", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("subzonaId");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={option.value} {...rest}>
                  <Checkbox checked={selected} sx={checkboxSx} />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona la Subzona"
                {...params}
                error={!!errors.subzonaId}
                helperText={errors.subzonaId?.message}
                sx={textFieldSx(mode)}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* Estatus */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la categoría del producto esta activa o inactiva"
            htmlFor="isActive"
          />
          <Select
            {...register("isActive")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("isActive") ??
              (mode !== "new" ? currentSellers?.estatus : "true")
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
              <SelectValue placeholder="Selecciona una opción" />
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

        {/* Tipo de comisión */}
        <div>
          <LabelTooltip
            label="*Tipo de comisión"
            tooltip="Tipo de comisión"
            htmlFor="Tipo-de-comisión"
          />
          <Autocomplete
            disablePortal
            options={comisionOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              comisionOptions.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("tipoComision") ??
                    currentSellers?.tipoComision ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("tipoComision", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("tipoComision");
            }}
            popupIcon={<DownArrow />}
            disabled={mode !== "new"}
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={option.value} {...rest}>
                  <Checkbox checked={selected} sx={checkboxSx} />
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona un tipo de comisión"
                {...params}
                error={!!errors.tipoComision}
                helperText={errors.tipoComision?.message}
                sx={textFieldSx(mode, mode !== "new")}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* comision Global */}
        <div>
          <LabelTooltip
            label="% De comisión global"
            tooltip="Captura la comisión global en porcentaje que va a recibir el vendedor"
            htmlFor="comision-global"
          />
          <Input
            id="comision-global"
            type="number"
            step="any"
            placeholder="Ingresa el porcentaje de comisión global"
            isError={!!errors.porcentajeComisionGlobal}
            disabled={mode !== "new" || !tipoComisionValue}
            {...porcentajeField}
          />
          {errors.porcentajeComisionGlobal && (
            <span className="text-[#CF5459] text-xs">
              {errors.porcentajeComisionGlobal?.message}
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
