"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { getCancelConceptsById } from "../../services/conceptosCancelAction";

import { AppDispatch } from "@/lib/store/store";
import type { CancelConcepts } from "../../services/cancelConceptsTypes";
import type { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveConcepto: string;
  prefix?: string;
  estatus: string;
  concepto: string;
  afectaA: string;
  motivoSat: string;
  motivoSatId: string;
}

interface CancelacionConceptsContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentCancelacion: CancelConcepts | null;
  isLoadingCancelacion: boolean;
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
const CancelacionConceptsContext = createContext<
  CancelacionConceptsContext | undefined
>(undefined);

// Proveedor del contexto
export const CancelacionConceptsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosCancelacion"); // Hook para validar la configuración de claves

  const [isLoadingCancelacion, setIsLoadingCancelacion] = useState(false);
  const [currentCancelacion, setCurrentCancelacion] =
    useState<CancelConcepts | null>(null);

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      getCurrentCancelConcepts();
    }
  }, [mode, id]);

  const getCurrentCancelConcepts = async () => {
    setIsLoadingCancelacion(true);
    try {
      const response = await getCancelConceptsById({
        token,
        id,
      });

      if (response && response.success) {
        setCurrentCancelacion(response.conceptoCancelacion);
        // console.log("conceptos de cancelacion obtenido:", response.conceptoCancelacion);
      } else {
        console.error(
          "Error: conceptos de cancelacion no encontrado o éxito false."
        );
      }
    } catch (error) {
      console.error("Error al obtener el conceptos de cancelacion:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la información del concepto de cancelación.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/generales/catalogos/conceptos-cancelacion"
        );
      });
    } finally {
      setIsLoadingCancelacion(false);
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
          concepto,
          afectaA,
          motivoSat,
          estatus,
          ...restBody
        } = data;

        body = {
          ...restBody,
          concepto: concepto?.trim(),
          afectaA: afectaA,
          motivoSat: motivoSat,
          estatus: estatus === "true",
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
    <CancelacionConceptsContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentCancelacion,
        isLoadingCancelacion,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </CancelacionConceptsContext.Provider>
  );
};

// Hook para usar el contexto
export const useCancelacionConceptForm = () => {
  const context = useContext(CancelacionConceptsContext);
  if (!context) {
    throw new Error(
      "useReturnConcepts debe ser usado dentro de CancelacionConceptsProvider"
    );
  }
  return context;
};
