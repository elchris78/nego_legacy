import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  alphanumericNoAccentsRegex,
  emailRegex,
  firstLetterUppercase,
  onlyNumbers,
} from "@/utils/regex";
import { Input } from "@/components/ui/input";
import { InputTags } from "@/components/ui/input-tags";
import { Label } from "@/components/ui/label";
import { LabelTooltip } from "@/components/ui/LabelTooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRestrictionConceptForm } from "./RestrictionConceptsContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function validEmails(emails: string[]): boolean {
  for (const email of emails) {
    if (!emailRegex.test(email.trim())) {
      return false; // Invalid email found
    }
  }
  return true; // All emails are valid
}

const GeneralDataForm = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { generalDataForm, currentRestrictionConcept, keyConfig } =
    useRestrictionConceptForm();
  const {
    register,
    formState: { errors },
    control, // Desestructuramos control
    setValue,
    clearErrors,
    setError,
    resetField,
    trigger, // Destructure trigger from generalDataForm
    watch,
  } = generalDataForm;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emails, setEmails] = useState<string[]>(
    mode === "new" ? [] : currentRestrictionConcept?.correosNotificacion || []
  );

  // Asignar valor a emails cuando cambia
  useEffect(() => {
    setValue("notificationEmails", emails, {
      shouldValidate: true,
      shouldDirty: true,
    });
    clearErrors("notificationEmails");

    // Validar correos electrónicos
    if (!validEmails(emails)) {
      setError("notificationEmails", {
        type: "manual",
        message: "Algunos correos electrónicos no son válidos.",
      });
    }
  }, [emails]);

  useEffect(() => {
    const requiresAuthorization = generalDataForm.watch(
      "requiresAuthorization"
    );
    if (requiresAuthorization === "false") {
      resetField("authorizationKey");
    }
  }, [generalDataForm.watch("requiresAuthorization")]);

  // Asignar valor por defecto en modo "new"
  useEffect(() => {
    if (mode === "new") {
      setValue("isActive", "true", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("requiresAuthorization", "false", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("requiresNotification", "false", {
        shouldValidate: true,
        shouldDirty: true,
      });

      clearErrors("isActive");
      clearErrors("requiresAuthorization");
      clearErrors("requiresNotification");
    }
  }, [mode, setValue]);

  // Asign default values only on editing
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && currentRestrictionConcept) {
      setValue("claveConcepto", currentRestrictionConcept.id);
      setValue("prefix", keyConfig?.prefijo || "");
      setValue(
        "isActive",
        currentRestrictionConcept?.estatus ? "true" : "false"
      );
      setValue(
        "requiresAuthorization",
        currentRestrictionConcept?.requiereAutorizacion ? "true" : "false"
      );
      setValue(
        "requiresNotification",
        currentRestrictionConcept?.requiereNotificacion ? "true" : "false"
      );
      setValue(
        "notificationEmails",
        currentRestrictionConcept?.correosNotificacion
      );
      setValue(
        "authorizationKey",
        currentRestrictionConcept?.claveAutorizacion
      );
      setValue("concept", currentRestrictionConcept?.concepto);
      setValue("description", currentRestrictionConcept?.descripcion);
      setValue("warning", currentRestrictionConcept?.advertencia);
      setValue("appliesTo", currentRestrictionConcept?.aplicaPara);

      trigger(); // Use the destructured trigger and trigger validation
    }
  }, [mode, currentRestrictionConcept, setValue, trigger]); // Update dependency array

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ID concepto de restricción */}
        <div>
          <LabelTooltip
            label="*Clave Concepto de restricción"
            tooltip="Clave único de concepto de restricción usado internamente en la empresa"
            htmlFor="id-restriction-concept"
          />
          <Input
            id="id-restriction-concept"
            type="text"
            placeholder="Clave Concepto de restricción"
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
                  if (value && value.length > keyConfig.longitudMaxima) {
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

        {/* Estatus del concepto de restricción */}
        <div>
          <LabelTooltip
            label="*Estatus"
            tooltip="Selecciona si el concepto de restricción de venta esta activo o inactivo"
            htmlFor="status-restriction-concept"
          />
          <Select
            {...register("isActive")}
            value={generalDataForm.getValues("isActive") ?? undefined}
            onValueChange={(value) => {
              setValue("isActive", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("isActive");
            }}
            disabled={mode === "view"}
          >
            <SelectTrigger error={!!errors.isActive}>
              <SelectValue placeholder="Selecciona un estatus" />
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

        {/* Concepto de restricción */}
        <div>
          <LabelTooltip
            label="*Concepto de restricción"
            tooltip="Define el motivo por el cual se restringe la venta y/o compra (ej. producto regulado, cliente moroso)."
            htmlFor="restriction-concept"
          />
          <Input
            id="restriction-concept"
            type="text"
            placeholder="Ingresa el concepto"
            isError={!!errors.concept}
            disabled={mode === "view"}
            {...register("concept", {
              required: "El concepto es requerido",
              minLength: {
                value: 3,
                message: "El concepto debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "El concepto no puede tener más de 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "La primera letra debe ser mayúscula.",
              },
            })}
          />
          {errors.concept && (
            <span className="text-[#CF5459] text-xs">
              {errors.concept?.message}
            </span>
          )}
        </div>

        {/* Descripción */}
        <div>
          <LabelTooltip
            label="*Descripción"
            tooltip="Detalla la razón o condiciones de la restricción."
            htmlFor="description-restriction-concept"
          />
          <Textarea
            id="description-restriction-concept"
            placeholder="Ingresa la descripción"
            disabled={mode === "view"}
            isError={!!errors.description}
            {...register("description", {
              required: "La descripción es requerida",
              minLength: {
                value: 3,
                message: "La descripción debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 100,
                message: "La descripción no puede tener más de 100 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "La primera letra debe ser mayúscula.",
              },
            })}
          />
          {errors.description && (
            <span className="text-[#CF5459] text-xs">
              {errors.description?.message}
            </span>
          )}
        </div>

        {/* Advertencia */}
        <div>
          <LabelTooltip
            label="*Advertencia"
            tooltip="Mensaje que se mostrará al usuario cuando intente realizar una venta restringida usando este concepto"
            htmlFor="warning-restriction-concept"
          />
          <Textarea
            id="warning-restriction-concept"
            placeholder="Ingresa la advertencia"
            disabled={mode === "view"}
            isError={!!errors.warning}
            {...register("warning", {
              required: "La advertencia es requerida",
              minLength: {
                value: 3,
                message: "La advertencia debe tener al menos 3 caracteres",
              },
              maxLength: {
                value: 300,
                message: "La advertencia no puede tener más de 300 caracteres",
              },
              pattern: {
                value: firstLetterUppercase,
                message: "La primera letra debe ser mayúscula.",
              },
            })}
          />
          {errors.warning && (
            <span className="text-[#CF5459] text-xs">
              {errors.warning?.message}
            </span>
          )}
        </div>

        {/* Aplica para */}
        <div>
          <LabelTooltip
            label="*Aplica para"
            tooltip="Selecciona si el concepto de restricción aplica para Ventas, Compras, o para ambas"
            htmlFor="applies-to-restriction-concept"
          />
          <RadioGroup
            {...register("appliesTo", {
              required: "El campo aplica para es requerido",
            })}
            disabled={mode === "view"}
            defaultValue={currentRestrictionConcept?.aplicaPara}
            value={generalDataForm.watch("appliesTo") ?? undefined}
            onValueChange={(value) => {
              setValue("appliesTo", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("appliesTo");
            }}
          >
            <div
              className={cn(
                "flex flex-row h-11 items-center gap-3 font-light border rounded-md p-2",
                errors.appliesTo ? "border-[#CF5459]" : "border-gray-300",
                mode === "view" && "bg-[#E3E1E6]"
              )}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="ventas"
                  value="Ventas"
                  disabled={mode === "view"}
                />
                <Label htmlFor="ventas" className="font-normal">
                  Ventas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="compras"
                  value="Compras"
                  disabled={mode === "view"}
                />
                <Label htmlFor="compras" className="font-normal">
                  Compras
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="ambas"
                  value="Ambas"
                  disabled={mode === "view"}
                />
                <Label htmlFor="ambas" className="font-normal">
                  Ambas
                </Label>
              </div>
            </div>
          </RadioGroup>
          {errors.appliesTo && (
            <span className="text-[#CF5459] text-xs">
              {errors.appliesTo?.message}
            </span>
          )}
        </div>

        {/* Requiere autorización */}
        <div>
          <LabelTooltip
            label="*Requiere autorización"
            tooltip="Activa si se necesita aprobación para proceder con la venta."
            htmlFor="requires-authorization-restriction-concept"
          />
          <Select
            {...register("requiresAuthorization")}
            disabled={mode === "view"}
            value={
              generalDataForm.watch("requiresAuthorization") ??
              (mode !== "new"
                ? currentRestrictionConcept?.requiereAutorizacion
                : "false")
            }
            onValueChange={(value) => {
              setValue("requiresAuthorization", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("requiresAuthorization");
            }}
          >
            <SelectTrigger error={!!errors.requiresAuthorization}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.requiresAuthorization && (
            <span className="text-[#CF5459] text-xs">
              {errors.requiresAuthorization?.message}
            </span>
          )}
        </div>

        {/* Clave de autorización */}
        {generalDataForm.watch("requiresAuthorization") === "true" &&
          mode !== "view" && (
            <div>
              <LabelTooltip
                label="Clave de autorización"
                tooltip="Código o contraseña requerida para autorizar la venta, si aplica."
                htmlFor="authorization-key-restriction-concept"
              />
              <div className="relative">
                <Input
                  id="authorization-key-restriction-concept"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Ingresa la clave de autorización"
                  isError={!!errors.authorizationKey}
                  className="pr-10"
                  {...register("authorizationKey", {
                    minLength: {
                      value: 3,
                      message:
                        "La clave de autorización debe tener al menos 3 caracteres",
                    },
                    maxLength: {
                      value: 8,
                      message:
                        "La clave de autorización no puede tener más de 8 caracteres",
                    },
                    validate: (value) => {
                      if (
                        generalDataForm.watch("requiresAuthorization") ===
                          "true" &&
                        !value
                      ) {
                        return "La clave de autorización es obligatoria si se requiere autorización.";
                      }
                      return true;
                    },
                  })}
                />
                <span
                  className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500 hover:text-gray-600 transition-all"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                >
                  {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              {errors.authorizationKey && (
                <span className="text-[#CF5459] text-xs">
                  {errors.authorizationKey?.message}
                </span>
              )}
            </div>
          )}

        {/* Requiere notificación */}
        <div>
          <LabelTooltip
            label="*Requiere notificación"
            tooltip="Activa si se necesita notificación cuando se realice una compra o venta de un producto con este concepto"
            htmlFor="requires-notification-restriction-concept"
          />
          <Select
            {...register("requiresNotification")}
            disabled={mode === "view"}
            value={generalDataForm.watch("requiresNotification") ?? undefined}
            onValueChange={(value) => {
              setValue("requiresNotification", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              clearErrors("requiresNotification");
            }}
          >
            <SelectTrigger error={!!errors.requiresNotification}>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.requiresNotification && (
            <span className="text-[#CF5459] text-xs">
              {errors.requiresNotification?.message}
            </span>
          )}
        </div>

        {/* Correo de notificación */}
        {generalDataForm.watch("requiresNotification") === "true" && (
          <div>
            <LabelTooltip
              label="Correo de notificación"
              tooltip="Correo electrónico para enviar la notificación de selección del producto. Se podrá agregar más de 1, y se deberá separar por comas (,)."
              htmlFor="notification-email-restriction-concept"
            />
            <Controller
              name="notificationEmails"
              control={control}
              rules={{
                validate: (list: string[]) =>
                  (list && list?.length === 0) ||
                  validEmails(list) ||
                  "Algunos correos no son válidos",
              }}
              render={({ field }) => (
                <InputTags
                  id="notification-email-restriction-concept"
                  placeholder="Ingresa el correo"
                  value={field.value || []}
                  onChange={(list) => {
                    field.onChange(list);
                    setEmails(list);
                  }}
                  isError={!!errors.notificationEmails}
                  disabled={mode === "view"}
                  validateRegex={emailRegex}
                />
              )}
            />
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-sm text-gray-500">
                Presiona Enter o coma para agregar múltiples correos
              </span>
              {errors.notificationEmails && (
                <span className="text-[#CF5459] text-xs">
                  {errors.notificationEmails.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <span className="font-bold text-[#5D6D7E] text-sm mb-4">
        * Campos obligatorios
      </span>
    </>
  );
};

export default GeneralDataForm;
