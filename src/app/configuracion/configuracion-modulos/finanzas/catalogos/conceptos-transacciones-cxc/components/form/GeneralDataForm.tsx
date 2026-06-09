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
  alphanumericRegex,
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { GeneralDataFormValues, useTransaccionesDXCForm } from "./TransaccionesDXCContext";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import DownArrow from "@/Asset/downArrow.svg";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { transaccionesDXCActions } from "../../services/transaccionesDXCSlice";
import MultipleSelector from "@/components/ui/multiselect";

const checkboxSx = {
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

const textFieldSx = (mode: string | null) => ({
  marginTop: "4px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "4.5vh",
    backgroundColor: mode === "view" ? "#E3E1E6" : "white",  
    color: mode === "view" ? "#949DA4" : "#5D6D7E",
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

const autocompleteSx = {
  "& .MuiAutocomplete-inputRoot": {
    padding: "4px",
  },
};


const claveColabOptions = [  
  { value: "Cargo", label: "Cargo" },
  { value: "Abono", label: "Abono" },
]

const requerimientosOptions = [
  { value: "afectaDepositos", label: "Afecta Depósitos" },
  { value: "validaReferencias", label: "Valida Referencias" },
  { value: "cancelaNotaCredito", label: "Cancela Nota de Crédito" },
  { value: "cancelaPago", label: "Cancela Pago" },
  { value: "requiereAutorizacion", label: "Requiere Autorización" },
];

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token")
  const dispatch: AppDispatch = useDispatch();
  const transaccionesDXC = useSelector(
    (state: RootState) => state.transaccionesDXC.transaccionesDXC
  );
  const tiposRelacion = useSelector(
    (state: RootState) => state.transaccionesDXC.catalogoTiposRelacion
  );

  const formasPago = useSelector(
    (state: RootState) => state.transaccionesDXC.catalogoFormasPago
  );
 
  const { generalDataForm, currentTransaccionesDXC, keyConfig } =
    useTransaccionesDXCForm();
  
  useEffect(() => {
    if (token) {
      dispatch(transaccionesDXCActions.getCatalogoTiposRelacion({ token }));
      dispatch(transaccionesDXCActions.getCatalogoFormasPago({ token }));
      dispatch(transaccionesDXCActions.getTransaccionesDXC({token, params: {isActive: ["true"]}}) )
    }
  }, []);
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    trigger, // Destructure trigger from generalDataForm
  } = generalDataForm;

  // Asignar valor por defecto en modo "new"
  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("generaDocumento", "Ninguno", {
        shouldValidate: true,
        shouldDirty: true,
      });
      clearErrors("generaDocumento");
      clearErrors("estatus");
    }
  }, [mode, setValue]);

  // Asign default values only on editing
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentTransaccionesDXC) {
      setValue("userProvidedId", currentTransaccionesDXC.id ?? "");
      setValue("userProvidedPrefix", keyConfig?.prefijo ?? "");
      setValue("conceptoTransaccion", currentTransaccionesDXC.conceptoTransaccion, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("estatus", currentTransaccionesDXC.estatus ? "true" : "false", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("contrapartidaId", currentTransaccionesDXC.contrapartidaId ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });        
        setValue("origen", currentTransaccionesDXC.origen ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("tipoTransaccion", currentTransaccionesDXC.tipoTransaccion ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("tipoRelacionSat", currentTransaccionesDXC.tipoRelacionSat ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("formaPago", currentTransaccionesDXC.formaPago ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("requiereAutorizacion", currentTransaccionesDXC.requiereAutorizacion ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("generaDocumento", currentTransaccionesDXC.generaDocumento ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("afectaDepositos", currentTransaccionesDXC.afectaDepositos ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("validaReferencias", currentTransaccionesDXC.validaReferencias ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("observaciones", currentTransaccionesDXC.observaciones ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("cancelaNotaCredito", currentTransaccionesDXC.cancelaNotaCredito ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("cancelaPago", currentTransaccionesDXC.cancelaPago ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
      setValue(
        "userProvidedId",
        currentTransaccionesDXC.userProvidedId ?? currentTransaccionesDXC.id ?? "",
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      trigger(); 
    }
  }, [mode, currentTransaccionesDXC, setValue, trigger]); 

  const selectedBooleans = requerimientosOptions
  .filter((opt) => watch(opt.value as keyof GeneralDataFormValues) === true)
  .map((opt) => opt.value);

  useEffect(() => {
  register("tipoTransaccion", { required: "Campo requerido" });
  register("tipoRelacionSat", { required: "Campo requerido" });
  register("formaPago", { required: "Campo requerido" });

}, [register]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID  concepto */}
        <div>
          <LabelTooltip
            label="*Clave de concepto"
            tooltip="Identificador único del concepto para uso interno de la empresa"
            htmlFor="Clave-concepto"
          />
          <Input
            id="Clave-concepto"
            type="text"
            placeholder="Ingresa clave de concepto"
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

        {/* Estatus */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si la categoría del producto esta activa o inactiva"
            htmlFor="isActive"
          />
          <Select
            {...register("estatus")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new" ? currentTransaccionesDXC?.estatus : "true")
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
              <SelectValue placeholder="Selecciona una opción" />
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

        {/* tipó vendedor */}
        <div>
          <LabelTooltip
            label="*Origen "
            tooltip="Selecciona el tipo de vendedor asignado al vendedor"
            htmlFor="Origen "
          />
          <Input
            id="Origen "
            type="text"
            placeholder="No reservado"
            disabled
            value={watch("origen")}
          />
        </div>

        {/* Concepto de transacción DXC */}
        <div>
          <LabelTooltip
            label="*Concepto de transacción DXC"
            tooltip="Concepto de transacción DXC"
            htmlFor="Concepto-transaccion-DXC"
          />
          <Input
            id="Concepto-transaccion-DXC"
            type="text"
            placeholder="Ingresa descripción"
            isError={!!errors.conceptoTransaccion}
            disabled={mode === "view"}
            {...register("conceptoTransaccion", {
              required: "Campo requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El nombre debe comenzar con mayúscula",
              }
            })}
          />
        </div>

        {/* Contrapartida */}
        <div>
          <LabelTooltip
            label="*Contrapartida"
            tooltip="Contrapartida"
            htmlFor="Contrapartida"
          />
          <Autocomplete
            disablePortal
            options={
              (transaccionesDXC ?? []).filter((option) => {
                // Si estamos en modo edición, excluye el mismo ID actual
                if (mode === "edit" && currentTransaccionesDXC) {
                  return option.id !== currentTransaccionesDXC.id;
                }
                return true;
              })
            }
            getOptionLabel={(option) => option.conceptoTransaccion ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={
              transaccionesDXC?.find(
                (opt) =>
                  opt.id ===
                  (generalDataForm.watch("contrapartidaId") ??
                    currentTransaccionesDXC?.contrapartidaId ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.id ?? "";
              setValue("contrapartidaId", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("contrapartidaId");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  checked={selected}
                  sx={checkboxSx}
                />
                {option.conceptoTransaccion}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona una opción"
                {...params}
                error={!!errors.contrapartidaId}
                helperText={errors.contrapartidaId?.message}
                sx={textFieldSx(mode)}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* Tipo de transacción */}
        <div>
          <LabelTooltip
            label="*Tipo de transacción"
            tooltip="Tipo de transacción"
            htmlFor="tipo-transaccion"
          />
          <Autocomplete
            disablePortal
            options={claveColabOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              claveColabOptions.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("tipoTransaccion") ??
                    currentTransaccionesDXC?.tipoTransaccion ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("tipoTransaccion", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("tipoTransaccion");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  checked={selected}
                  sx={checkboxSx}
                />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona una opción"
                {...params}
                error={!!errors.tipoTransaccion}
                helperText={errors.tipoTransaccion?.message}
                sx={textFieldSx(mode)}
              />
            )}
            sx={autocompleteSx}
          />
          {errors.tipoTransaccion && (
            <span className="text-[#CF5459] text-xs">
              {errors.tipoTransaccion?.message}
            </span>
          )}
        </div>

        {/* Tipo de Relación SAT */}
        <div>
          <LabelTooltip
            label="*Tipo de Relación SAT"
            tooltip="Tipo de Relación SAT"
            htmlFor="Tipo-Relacion-SAT"
          />
          <Autocomplete
            disablePortal
            options={tiposRelacion}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              tiposRelacion.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("tipoRelacionSat") ??
                    currentTransaccionesDXC?.tipoRelacionSat ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("tipoRelacionSat", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("tipoRelacionSat");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  checked={selected}
                  sx={checkboxSx}
                />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona el tipo de Relación SAT"
                {...params}
                error={!!errors.tipoRelacionSat}
                helperText={errors.tipoRelacionSat?.message}
                sx={textFieldSx(mode)}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* Forma de Pago */}
        <div>
          <LabelTooltip
            label="*Forma de Pago"
            tooltip="Selecciona la sForma de Pago"
            htmlFor="Forma-Pago"
          />
          <Autocomplete
            disablePortal
            options={formasPago}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            value={
              formasPago.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("formaPago") ??
                    currentTransaccionesDXC?.formaPago ??
                    "")
              ) ?? null
            }
            onChange={(_, newValue) => {
              const selectedValue = newValue?.value ?? "";
              setValue("formaPago", selectedValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("formaPago");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  checked={selected}
                  sx={checkboxSx}
                />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                placeholder="Selecciona la Forma de Pago"
                {...params}
                error={!!errors.formaPago}
                helperText={errors.formaPago?.message}
                sx={textFieldSx(mode)}
              />
            )}
            sx={autocompleteSx}
          />
        </div>

        {/* Requerimientos */}
        <div>
          <LabelTooltip
            label="Requerimientos"
            tooltip="Requerimientos"
            htmlFor="Requerimientos"
            className="mb-1"
          />
        <MultipleSelector
          value={requerimientosOptions.filter((opt) => selectedBooleans.includes(opt.value))}
          options={requerimientosOptions}
          placeholder="Selecciona requerimientos"
          allowSingleSelect={false}
          showCheckboxes
          disabled={mode === "view"}
          onChange={(selectedOptions) => {
            requerimientosOptions.forEach(({ value }) => {
              const key = value as keyof GeneralDataFormValues;
              const isSelected = selectedOptions.some((opt) => opt.value === value);
              setValue(key, isSelected, {
                shouldValidate: true,
                shouldDirty: true,
              });
            });
          }}
        />
        </div>

        {/* Genera documento */}
        <div>
          <LabelTooltip
            label="*Genera documento"
            tooltip="Genera documento"
            htmlFor="Genera-documento"
          />
          <Select
            {...register("generaDocumento")}
            disabled={mode === "view"}
            value={generalDataForm.watch("generaDocumento") ?? "Ninguno"} // Default to "Ninguno"
            onValueChange={(value) => {
              setValue("generaDocumento", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("generaDocumento");
            }}
          >
            <SelectTrigger error={!!errors.generaDocumento}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Ninguno">Ninguno</SelectItem>
                <SelectItem value="Nota de crédito">Nota de crédito</SelectItem>
                <SelectItem value="Complemento de pago">Complemento de pago</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.generaDocumento && (
            <span className="text-[#CF5459] text-xs">
              {errors.generaDocumento?.message}
            </span>
          )}
        </div>

        <div>
          <LabelTooltip
            label="*Observaciones"
            tooltip="Campo de texto libre para registrar comentarios adicionales, notas aclaratorias o información complementaria sobre el concepto."
            htmlFor="Observaciones"
          />
          <Input
            id="Observaciones"
            type="text"
            placeholder="Ingresa las Observaciones"
            isError={!!errors.observaciones}
            disabled={mode === "view"}
            {...register("observaciones", {
              required: "Campo requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "La observacion debe comenzar con mayúscula",
              },
              minLength: {
                value: 2,
                message: "La observacion debe tener minimo 2 caracteres"
              },
              maxLength: {
                value: 250,
                message: "La observacion no debe exceder de los 250 caracteres"
              }
            })}
          />
          {errors.observaciones && (
            <span className="text-[#CF5459] text-xs">
              {errors.observaciones?.message}
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
