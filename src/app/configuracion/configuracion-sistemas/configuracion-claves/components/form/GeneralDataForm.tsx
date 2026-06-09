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
import { useKeyConfigurationForm } from "./KeyConfigurationContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import Cookies from "js-cookie";
import { keyConfigurationActions } from "../../services/keyConfigurationSlice"; 
import { alphanumericNoAccentsRegex, onlyNumbers } from "@/lib/utils/regex";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isPrefijoEnabled, setIsPrefijoEnabled] = useState(false);
  const [isPrefijoFieldEnabled, setIsPrefijoFieldEnabled] = useState(false);
  const [longitudMaxima, setLongitudMaxima] = useState(8)
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();
  const catalogos = useSelector((state: RootState) => state.keyConfigurationReducer.catalogos);
  const tiposClave  = useSelector((state: RootState) => state.keyConfigurationReducer.tiposClave);
  const keyConfiguration = useSelector(
    (state: RootState) => state.keyConfigurationReducer.keyConfiguration
  );
  const { generalDataForm, currentKeyConfiguration } = useKeyConfigurationForm();
  const tienePrefijoValue = generalDataForm.watch("tienePrefijo");
  const tipoIdValue = generalDataForm.watch("tipoClave");
  const tipoPrefijoValue = generalDataForm.watch("tipoPrefijo");
  
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    trigger, // Destructure trigger from generalDataForm
  } = generalDataForm;

  // Asign default values only on editing
    useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentKeyConfiguration) {
      setValue("modulo", currentKeyConfiguration.modulo ?? "", { shouldValidate: true, shouldDirty: true });
      setValue("catalogo", currentKeyConfiguration.catalogo ?? "", { shouldValidate: true, shouldDirty: true });
      setValue("tipoClave", currentKeyConfiguration.tipoClave ?? "", { shouldValidate: true, shouldDirty: true });
      setValue("tienePrefijo", currentKeyConfiguration.tienePrefijo ? "true" : "false", { shouldValidate: true, shouldDirty: true });
      setValue("tipoPrefijo", currentKeyConfiguration.tipoPrefijo ?? "", { shouldValidate: true, shouldDirty: true });
      setValue("prefijo", currentKeyConfiguration.prefijo ?? "", { shouldValidate: true, shouldDirty: true });
      setValue("longitudMaxima", currentKeyConfiguration.longitudMaxima ?? 0, { shouldValidate: true, shouldDirty: true });
   
      trigger();
    }
  }, [mode, currentKeyConfiguration, setValue, trigger]);

  
  useEffect(() => {
    if (token) {
      dispatch(keyConfigurationActions.getCatsType({ token }));
    }
  }, [token, dispatch]);
  
  useEffect(() => {
    // Habilita o deshabilita campos de prefijo
    setIsPrefijoEnabled(tienePrefijoValue === "true");
  }, [tienePrefijoValue]);

  useEffect(() => {
    setIsPrefijoFieldEnabled(
      tienePrefijoValue === "true" && tipoPrefijoValue === "Fijo"
    );
  }, [tienePrefijoValue, tipoPrefijoValue]);

useEffect(() => {
  // Solo actualiza el límite superior para validación, sin setear el valor
  if (tipoIdValue === "Numérico" || tipoIdValue === "Numérico autoincrementable") {
    setLongitudMaxima(8);
  } else if (tipoIdValue === "Alfanumérico") {
    setLongitudMaxima(50);
  } else {
    setLongitudMaxima(100); // Valor por defecto si no aplica otro
  }
}, [tipoIdValue]);




useEffect(() => {
  if (tienePrefijoValue === "false") {
    setValue("tipoPrefijo", "");
    setValue("prefijo", "");
    clearErrors(["tipoPrefijo", "prefijo"]);
  }
}, [tienePrefijoValue, setValue, clearErrors]);
useEffect(() => {
  const tipoPrefijoActual = generalDataForm.getValues("tipoPrefijo");
  const prefijoActual = generalDataForm.getValues("prefijo");

  if (
    isPrefijoEnabled &&
    tipoPrefijoActual === "Variable" &&
    prefijoActual !== ""
  ) {
    setValue("prefijo", "");
    clearErrors("prefijo");
  }
}, [tipoPrefijoValue, isPrefijoEnabled, generalDataForm, setValue, clearErrors]);

const valorActualCatalogo = currentKeyConfiguration?.catalogo;

const catalogosDisponibles = catalogos?.filter((catalogo) =>
  catalogo.value === valorActualCatalogo ||
  !keyConfiguration?.some(
    (config) => config.catalogo === catalogo.value
  )
);
useEffect(() => {
  if (!isPrefijoFieldEnabled) {
    setValue("prefijo", "");
    clearErrors("prefijo");
  }
}, [isPrefijoFieldEnabled, setValue, clearErrors]);



  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Módulo */}
        <div>
          <LabelTooltip label="*Módulo" tooltip="Selecciona una opción" htmlFor="modulo" />
          <Select
            {...register("modulo", {
              required: "Campo requerido",
            })}
            disabled={mode === "view"}
            value={generalDataForm.watch("modulo")}
             onValueChange={(value) => {
              setValue("modulo", value, { shouldValidate: true, shouldDirty: true });
              clearErrors("modulo");
            }}
          >
            <SelectTrigger error={!!errors.modulo}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
             <SelectGroup>
              <SelectItem value="ConfiguracionGeneral">Configuración General</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.modulo && <span className="text-[#CF5459] text-xs">{errors.modulo?.message}</span>}
        </div>

        {/* Catálogo */}
        <div>
          <LabelTooltip label="*Catálogo" tooltip="Selecciona una opción" htmlFor="catalogo" />
          <Select
            {...register("catalogo", {
              required: "Campo requerido",
            })}
            disabled={mode === "view" || !generalDataForm.watch("modulo")}
            value={generalDataForm.watch("catalogo")}
            onValueChange={(value) => {
              setValue("catalogo", value, { shouldValidate: true, shouldDirty: true });
              clearErrors("catalogo");
            }}
          >
            <SelectTrigger error={!!errors.catalogo}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
             <SelectContent>
              <SelectGroup>
                {catalogosDisponibles?.map((catalogo) => (
                  <SelectItem key={catalogo.value} value={catalogo.value}>
                    {catalogo.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.catalogo && <span className="text-[#CF5459] text-xs">{errors.catalogo?.message}</span>}
        </div>

        {/* Tipo ID */}
        <div>
          <LabelTooltip label="*Tipo clave" tooltip="Selecciona una opción" htmlFor="tipoId" />
          <Select
            {...register("tipoClave", {
              required: "Campo requerido",
            })}
            disabled={mode === "view"}
            value={generalDataForm.watch("tipoClave")}
            onValueChange={(value) => {
              setValue("tipoClave", value, { shouldValidate: true, shouldDirty: true });
              clearErrors("tipoClave");
            }}
          >
            <SelectTrigger error={!!errors.tipoClave}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tiposClave?.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipoClave && <span className="text-[#CF5459] text-xs">{errors.tipoClave?.message}</span>}
        </div>

        {/* Tiene prefijo (único booleano) */}
        <div>
          <LabelTooltip label="*Tiene prefijo" tooltip="Selecciona una opción" htmlFor="tienePrefijo" />
          <Select
            disabled={mode === "view"}
            value={
              generalDataForm.watch("tienePrefijo") ??
              (mode !== "new"
                ? currentKeyConfiguration?.tienePrefijo === true
                  ? "true"
                  : "false"
                : "false")
            }
            onValueChange={(value) => {
              setValue("tienePrefijo", value, { shouldValidate: true, shouldDirty: true });
              clearErrors("tienePrefijo");
            }}
          >
            <SelectTrigger error={!!errors.tienePrefijo}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Habilitado (Sí)</SelectItem> 
                <SelectItem value="false">Deshabilitado (No) </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tienePrefijo && <span className="text-[#CF5459] text-xs">{errors.tienePrefijo?.message}</span>}
        </div>

        {/* Tipo de prefijo */}
        <div>
          <LabelTooltip
            label={`${isPrefijoEnabled ? "*Tipo de prefijo" : "Tipo de prefijo"}`}
            tooltip="Selecciona una opción"
            htmlFor="tipoPrefijo"
          />
          <Select
            disabled={mode === "view" || !isPrefijoEnabled }
            value={generalDataForm.watch("tipoPrefijo")}
            onValueChange={(value) => {
              setValue("tipoPrefijo", value, { shouldValidate: true, shouldDirty: true });
              clearErrors("tipoPrefijo");
            }}
          >
            <SelectTrigger error={!!errors.tipoPrefijo}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Variable">Variable</SelectItem>
                <SelectItem value="Fijo">Fijo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipoPrefijo && <span className="text-[#CF5459] text-xs">{errors.tipoPrefijo?.message}</span>}
        </div>

        {/* Prefijo */}
        <div>
          <LabelTooltip
            label={`${ isPrefijoFieldEnabled ? "*Prefijo" : "Prefijo"}`}
            tooltip="Ingresa el prefijo"
            htmlFor="prefijo"
          />
          <Input
            id="prefijo"
            type="text"
            placeholder="Ingresa el prefijo"
            isError={!!errors.prefijo}
            disabled={mode === "view"  || !isPrefijoFieldEnabled}
            {...register("prefijo", {
              pattern: {
                value: alphanumericNoAccentsRegex,
                message: "El prefijo debe ser alfanumérico",
              },
              validate: (value) => {
                if (isPrefijoFieldEnabled) {
                  if (!value) return "Campo requerido";
                  if (value.length < 1) return "Debe tener al menos 1 carácter";
                  if (value.length > 3) return "No puede exceder 3 caracteres";
                }
                return true;
              },
            })}
          />
          {errors.prefijo && <span className="text-[#CF5459] text-xs">{errors.prefijo?.message}</span>}
        </div>


        {/* Longitud máxima */}
        <div>
          <LabelTooltip label="*Longitud máxima" tooltip="La longitud para el tipo Numérico o Numérico autoincrementable será de un máximo de 8 caracteres, y para el tipo Alfanumérico será de hasta 50 caracteres." htmlFor="longitud" />
          <Input
            id="longitud"
            placeholder="Ingresa la longitud máxima"
            isError={!!errors.longitudMaxima}
            disabled={mode === "view"}
            {...register("longitudMaxima", {
              required: "Campo requerido",
              pattern: 
              { value: onlyNumbers,
                message:'Solo se aceptan números'
              },
              min: {
                value: 1,
                message: "La longitud debe ser mayor a 0",
              },
              max: {
                value: longitudMaxima,
                message: `No puede exceder los ${longitudMaxima} caracteres`,
              },
            })}
          />
          {errors.longitudMaxima && <span className="text-[#CF5459] text-xs">{errors.longitudMaxima?.message}</span>}
        </div>
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm">* Campos obligatorios</span>
    </>
  );
};

export default GeneralDataForm;
