"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { restrictionConceptsActions } from "../../services/restrictionConceptsSlice";

import type { RestrictionConcept } from "../../services/restrictionConceptsTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveConcepto: string;
  prefix?: string;
  concept: string;
  description: string;
  warning: string;
  appliesTo: string;
  requiresAuthorization: string;
  authorizationKey: string;
  requiresNotification: string;
  notificationEmails: string[];
  isActive: string;
}

interface RestrictionConceptsContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentRestrictionConcept: RestrictionConcept | null;
  isLoadingRestrictionConcept: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

const customClassesError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

// Crear el contexto
const RestrictionConceptsContext = createContext<
  RestrictionConceptsContext | undefined
>(undefined);

// Proveedor del contexto
export const RestrictionConceptsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosRestriccion"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentRestrictionConcept, setCurrentRestrictionConcept] =
    useState<RestrictionConcept | null>(null);
  const [isLoadingRestrictionConcept, setIsLoadingRestrictionConcept] =
    useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentRestrictionConcept();
    }
  }, [mode, id]);

  const getCurrentRestrictionConcept = async () => {
    try {
      setIsLoadingRestrictionConcept(true);
      const resultAction = await dispatch(
        restrictionConceptsActions.getRestrictionConceptById({
          token,
          id,
        })
      );
      if (
        restrictionConceptsActions.getRestrictionConceptById.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      const restrictionConcept =
        restrictionConceptsActions.getRestrictionConceptById.fulfilled.match(
          resultAction
        )
          ? resultAction.payload
          : null;

      setCurrentRestrictionConcept(
        restrictionConcept?.conceptoRestriccionVenta || null
      );
    } catch (error: any) {
      console.error("Error al obtener el concepto de devolución:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar el concepto de restricción.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/generales/catalogos/conceptos-restricciones"
        );
      });
    } finally {
      setIsLoadingRestrictionConcept(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveConcepto,
          prefix,
          concept,
          description,
          warning,
          isActive,
          appliesTo,
          authorizationKey,
          requiresNotification,
          requiresAuthorization,
          notificationEmails,
          ...restBody
        } = data;

        body = {
          ...restBody,
          concepto: concept?.trim(),
          descripcion: description?.trim(),
          advertencia: warning?.trim(),
          estatus: isActive === "true",
          requiereAutorizacion: requiresAuthorization === "true",
          aplicaPara: appliesTo,
          claveAutorizacion: authorizationKey?.trim(),
          requiereNotificacion: requiresNotification === "true",
          correosNotificacion: notificationEmails,
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveConcepto?.trim();
        }

        // Si el modo es nuevo y el prefijo es Fijo, asignar el prefijo fijo de la configuración
        // Si el modo es nuevo y el prefijo es Variable, asignar el prefijo del campo
        if (mode === "new" && keyConfig?.tienePrefijo) {
          if (keyConfig.tipoPrefijo === "Fijo") {
            body.userProvidedPrefix = keyConfig.prefijo;
          } else if (keyConfig.tipoPrefijo === "Variable") {
            body.userProvidedPrefix = prefix?.trim();
          }
        }
      },
      (errors) => {
        hasErrors = true;
        console.error("Form errors:", errors);
      }
    )();

    if (!hasErrors) {
      return body;
    } else {
      console.error(
        "Form has errors, not submitting:",
        generalDataForm.formState.errors
      );
      return undefined;
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <RestrictionConceptsContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentRestrictionConcept,
        isLoadingRestrictionConcept,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </RestrictionConceptsContext.Provider>
  );
};

// Hook para usar el contexto
export const useRestrictionConceptForm = () => {
  const context = useContext(RestrictionConceptsContext);
  if (!context) {
    throw new Error(
      "useRestrictionConcepts debe ser usado dentro de RestrictionConceptsProvider"
    );
  }
  return context;
};
