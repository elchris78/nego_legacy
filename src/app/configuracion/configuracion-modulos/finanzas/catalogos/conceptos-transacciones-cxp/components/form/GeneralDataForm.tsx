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
  lettersNumbersSpecialsFirstUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { GeneralDataFormValues, useTransaccionesDXPForm } from "./TransaccionesDXPContext";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import DownArrow from "@/Asset/downArrow.svg";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { transaccionesDXPActions } from "../../services/transaccionesDXPSlice";
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
  { value: "afectaCheques", label: "Afecta Cheques" },
  { value: "validaReferencia", label: "Valida Referencia" },
  { value: "cancelaNotaCredito", label: "Cancela Nota de Crédito" },
  { value: "cancelaPago", label: "Cancela Pago" },
  { value: "requiereAutorizacion", label: "Requiere Autorización" },
  { value: "requiereNotaCredito", label: "Requiere NotaCredito" },
];

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token")
  const dispatch: AppDispatch = useDispatch();
  const transaccionesDXP = useSelector(
    (state: RootState) => state.transaccionesDXP.transaccionesDXP
  );

  const formasPago = useSelector(
    (state: RootState) => state.transaccionesDXP.catalogoFormasPago
  );
 
  const { generalDataForm, currentTransaccionesDXP, keyConfig } =
    useTransaccionesDXPForm();
  
  useEffect(() => {
    if (token) {
      dispatch(transaccionesDXPActions.getCatalogoFormasPago({ token }));
      dispatch(transaccionesDXPActions.getTransaccionesDXP({token, params: {isActive: ["true"]}}) )
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
      clearErrors("estatus");
    }
  }, [mode, setValue]);

  // Asign default values only on editing
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentTransaccionesDXP) {
      setValue("userProvidedId", currentTransaccionesDXP.id ?? "");
      setValue("userProvidedPrefix", keyConfig?.prefijo ?? "");
      setValue("conceptoTransaccion", currentTransaccionesDXP.conceptoTransaccion, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("estatus", currentTransaccionesDXP.estatus ? "true" : "false", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("contrapartidaId", currentTransaccionesDXP.contrapartidaId ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });        
        setValue("origen", currentTransaccionesDXP.origen ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("tipoTransaccion", currentTransaccionesDXP.tipoTransaccion ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("formaPago", currentTransaccionesDXP.formaPago ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("requiereAutorizacion", currentTransaccionesDXP.requiereAutorizacion ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("afectaCheques", currentTransaccionesDXP.afectaCheques ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("validaReferencia", currentTransaccionesDXP.validaReferencia ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("observaciones", currentTransaccionesDXP.observaciones ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("cancelaNotaCredito", currentTransaccionesDXP.cancelaNotaCredito ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("cancelaPago", currentTransaccionesDXP.cancelaPago ?? "", {
          shouldValidate: true,
          shouldDirty: true,
        });
      setValue(
        "userProvidedId",
        currentTransaccionesDXP.userProvidedId ?? currentTransaccionesDXP.id ?? "",
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      trigger(); 
    }
  }, [mode, currentTransaccionesDXP, setValue, trigger]); 

  const selectedBooleans = requerimientosOptions
  .filter((opt) => watch(opt.value as keyof GeneralDataFormValues) === true)
  .map((opt) => opt.value);

  useEffect(() => {
    register("tipoTransaccion", { required: "Campo requerido" });
    register("formaPago", { required: "Campo requerido" });

  }, [register]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID  concepto */}
        <div>
          <LabelTooltip
            label="*Clave de concepto"
            tooltip="Identificador único alfanumérico asignado al concepto de transacción. Permite su referencia dentro de los procesos contables o administrativos."
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
            tooltip="Indica la condición operativa del concepto (Activo/Inactivo). Solo los conceptos activos están disponibles para ser utilizados en nuevas transacciones."
            htmlFor="isActive"
          />
          <Select
            {...register("estatus")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new" ? currentTransaccionesDXP?.estatus : "true")
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
            tooltip="origen"
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
            label="*Concepto de transacción DXP"
            tooltip="Nombre asignado al concepto dentro de la empresa. Representa la descripción visible para el usuario al registrar movimientos."
            htmlFor="Concepto-transaccion-CXP"
          />
          <Input
            id="Concepto-transaccion-CXP"
            type="text"
            placeholder="Ingresa descripción"
            isError={!!errors.conceptoTransaccion}
            disabled={mode === "view"}
            {...register("conceptoTransaccion", {
              required: "Campo requerido",
              pattern: {
                value: firstLetterUppercase,
                message: "El concepto debe comenzar con mayúscula",
              },
              minLength: {
                value: 3,
                message: "El concepto debe tener mas de 3 caracteres"
              },
              maxLength: {
                value: 100,
                message: "El concepto no debe exceder de los 100 caracteres"
              }
            })}
          />
          {errors.conceptoTransaccion && (
            <span className="text-[#CF5459] text-xs">
              {errors.conceptoTransaccion?.message}
            </span>
          )}
        </div>

        {/* Contrapartida */}
        <div>
          <LabelTooltip
            label="*Contrapartida"
            tooltip="Cuenta contable o clasificador asociado al concepto, que se utiliza para reflejar el impacto financiero de la transacción."
            htmlFor="Contrapartida"
          />
          <Autocomplete
            disablePortal
            options={
              (transaccionesDXP ?? []).filter((option) => {
                // Si estamos en modo edición, excluye el mismo ID actual
                if (mode === "edit" && currentTransaccionesDXP) {
                  return option.id !== currentTransaccionesDXP.id;
                }
                return true;
              })
            }
            getOptionLabel={(option) => option.conceptoTransaccion ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={
              transaccionesDXP?.find(
                (opt) =>
                  opt.id ===
                  (generalDataForm.watch("contrapartidaId") ??
                    currentTransaccionesDXP?.contrapartidaId ??
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
            tooltip="Categoría que define la naturaleza del movimiento financiero ya sea como Cargo o como Abono"
            htmlFor="tipo-transaccion"
          />
          <Autocomplete
            disablePortal
            options={claveColabOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={
              claveColabOptions.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("tipoTransaccion") ?? currentTransaccionesDXP?.tipoTransaccion ?? "")
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
            onBlur={async () => {
              const value = generalDataForm.watch("tipoTransaccion");
              if (!value) await trigger("tipoTransaccion");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={checkboxSx} />
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

        </div>

        {/* Forma de Pago */}
        <div>
          <LabelTooltip
            label="*Forma de Pago"
            tooltip="Método mediante el cual se efectúa o espera realizar la transacción (por ejemplo: transferencia, efectivo, cheque, tarjeta bancaria, etc.)."
            htmlFor="Forma-Pago"
          />
          <Autocomplete
            disablePortal
            options={formasPago}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            value={
              formasPago.find(
                (opt) =>
                  opt.value ===
                  (generalDataForm.watch("formaPago") ?? currentTransaccionesDXP?.formaPago ?? "")
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
            onBlur={async () => {
              const value = generalDataForm.watch("formaPago");
              if (!value) await trigger("formaPago");
            }}
            popupIcon={<DownArrow />}
            disabled={mode === "view"}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={checkboxSx} />
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
