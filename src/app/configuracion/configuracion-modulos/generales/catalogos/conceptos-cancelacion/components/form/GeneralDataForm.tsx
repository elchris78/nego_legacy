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
  lettersAndNumbers,
  onlyNumbers,
} from "@/utils/regex";
import { useCancelacionConceptForm } from "./CancelacionContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import { CancelConceptsActions } from "../../services/conceptosCancelSlice";
import Cookies from "js-cookie";

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token");
  const dispatch: AppDispatch = useDispatch();
  const motivosSat = useSelector(
    (state: RootState) => state.ConceptoCancelacion.motivosSat
  );
  const [selectedMotivoSatId, setSelectedMotivoSatId] = useState<string>("");
  const { generalDataForm, currentCancelacion, keyConfig } =
    useCancelacionConceptForm();
  const {
    register,
    formState: { errors },
    setValue,
    clearErrors,
    trigger,
  } = generalDataForm;

  useEffect(() => {
    if (mode === "new") {
      setValue("estatus", "true");
    }
  }, [mode, setValue]);

  // Asign default values only on editing
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentCancelacion) {
      setValue("claveConcepto", currentCancelacion.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue(
        "estatus", 
        currentCancelacion?.estatus === true ? "true" : "false"
      );
      setValue("concepto", currentCancelacion?.concepto!);
      setValue("afectaA", currentCancelacion?.afectaA || "");
      setSelectedMotivoSatId(currentCancelacion.motivoSatId || "");
      setValue("motivoSat", currentCancelacion?.motivoSatId || "");

      trigger()
    }
  }, [mode, currentCancelacion, setValue, trigger]);

  useEffect(() => {
    dispatch(
      CancelConceptsActions.getMotivosSat({ token: token ?? undefined })
    );
  }, [dispatch, token]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID concepto de devolución */}
        <div>
          <LabelTooltip
            label="*Clave Concepto de Cancelación"
            tooltip="Identificador único del concepto de cancelación, usado internamente en la empresa"
            htmlFor="id-return-concept"
          />
          <Input
            id="id-return-concept"
            type="text"
            placeholder="Clave Concepto de Cancelación"
            isError={!!errors.claveConcepto}
            disabled={
              mode !== "new" ||
              (keyConfig?.tipoClave !== "Numérico" &&
                keyConfig?.tipoClave !== "Alfanumérico")
            }
            {...register("claveConcepto", {
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
                  if (value && value.length > keyConfig?.longitudMaxima) {
                    return `La clave no puede exceder los ${keyConfig.longitudMaxima} caracteres`;
                  }
                }
              },
            })}
          />
          {errors.claveConcepto && (
            <span className="text-[#CF5459] text-xs">
              {errors.claveConcepto?.message}
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

        {/* Estatus del concepto de devolución */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el concepto está activo o inactivo."
            htmlFor="status-area"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("estatus", newValue);
              clearErrors("estatus");
            }}
            {...register("estatus")}
            value={
              generalDataForm.watch("estatus") ??
              (mode !== "new"
                ? currentCancelacion?.estatus === true
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

        {/* Nombre del concepto de devolución */}
        <div>
          <LabelTooltip
            label="*Concepto de cancelación"
            tooltip="Nombre o descripción del concepto por el cual se realiza la cancelación."
            htmlFor="name-return-concept"
          />
          <Input
            id="name-return-concept"
            type="text"
            placeholder="Ingresa el concepto de cancelación"
            isError={!!errors.concepto}
            {...register("concepto", {
              required: "El Concepto de cancelación es requerido",
              minLength: {
                value: 3,
                message:
                  "El Concepto de cancelación debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 50,
                message:
                  "El Concepto de cancelación no puede exceder los 50 caracteres",
              },
              pattern: {
                value: lettersAndNumbers,
                message:
                  "El concepto debe iniciar con mayúscula y no contener caracteres especiales",
              },
            })}
            disabled={mode === "view"}
          />
          {errors.concepto && (
            <span className="text-[#CF5459] text-xs">
              {errors.concepto?.message}
            </span>
          )}
        </div>

        {/* Afecta a */}
        <div>
          <LabelTooltip
            label="*Afecta"
            tooltip="Selecciona si el concepto tiene un impacto en Ventas, Compras, o en Notas de crédito"
            htmlFor="affect-to"
          />
          <Select
            onValueChange={(newValue) => {
              setValue("afectaA", newValue);
              clearErrors("afectaA");
            }}
            {...register("afectaA", {
              required: "EL valor es requerido",
            })}
            // defaultValue={undefined}
            // value={undefined}
            value={generalDataForm.watch("afectaA")}
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.afectaA}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={"Ventas"}>Ventas</SelectItem>
                <SelectItem value={"Compras"}>Compras</SelectItem>
                <SelectItem value={"Notas de crédito"}>
                  Notas de crédito
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.afectaA && (
            <span className="text-[#CF5459] text-xs">
              {errors.afectaA?.message}
            </span>
          )}
        </div>

        <div>
          <LabelTooltip
            label="*Motivo SAT"
            tooltip="Código o motivo de cancelación según el catálogo del SAT (Servicio de Administración Tributaria)."
            htmlFor="Motivo-SAT"
          />
          <Select
          {...register("motivoSat", {
              required: "EL valor es requerido",
            })}
            onValueChange={(newMotivoSatId) => {
              const motivoSeleccionado = motivosSat.find(
                (motivo) => motivo.c_Periodicidad === newMotivoSatId
              );

              if (motivoSeleccionado) {
                setSelectedMotivoSatId(newMotivoSatId);
                setValue("motivoSat", motivoSeleccionado.c_Periodicidad);
                clearErrors("motivoSat");
              }
            }}
            value={selectedMotivoSatId}
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.motivoSat}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {motivosSat?.map((motivo) => (
                  <SelectItem
                    key={motivo.c_Periodicidad}
                    value={motivo.c_Periodicidad}
                  >
                    {motivo.descripcion}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.motivoSat && (
            <span className="text-[#CF5459] text-xs">
              {errors.motivoSat?.message}
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
