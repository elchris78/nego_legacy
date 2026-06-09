"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { returnConceptsActions } from "../../services/returnConceptsSlice";

import type { ReturnConcept } from "../../services/ReturnConceptTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveConcepto: string;
  prefix?: string;
  isActive: string;
  name: string;
  affectTo: string;
}

interface ReturnConceptsContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentReturnConcept: ReturnConcept | null;
  isLoadingReturnConcept: boolean;
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
const ReturnConceptsContext = createContext<ReturnConceptsContext | undefined>(
  undefined
);

// Proveedor del contexto
export const ReturnConceptsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosDevolucion"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentReturnConcept, setCurrentReturnConcept] =
    useState<ReturnConcept | null>(null);
  const [isLoadingReturnConcept, setIsLoadingReturnConcept] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentReturnConcept();
    }
  }, [mode, id]);

  const getCurrentReturnConcept = async () => {
    try {
      setIsLoadingReturnConcept(true);
      const resultAction = await dispatch(
        returnConceptsActions.getReturnConceptById({
          token,
          id,
        })
      );
      if (
        returnConceptsActions.getReturnConceptById.rejected.match(resultAction)
      ) {
        throw resultAction.payload;
      }

      const returnConcept =
        returnConceptsActions.getReturnConceptById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;

      setCurrentReturnConcept(returnConcept?.conceptoDevolucion ?? null);
    } catch (error: any) {
      console.error("Error al obtener el concepto de devolución:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la clasificación de clientes.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/generales/catalogos/conceptos-devolucion"
        );
      });
    } finally {
      setIsLoadingReturnConcept(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { claveConcepto, prefix, name, affectTo, isActive, ...restBody } =
          data;

        body = {
          ...restBody,
          concepto: name?.trim(),
          afectaA: affectTo,
          estatus: isActive === "true",
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
    <ReturnConceptsContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentReturnConcept,
        isLoadingReturnConcept,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </ReturnConceptsContext.Provider>
  );
};

// Hook para usar el contexto
export const useReturnConceptForm = () => {
  const context = useContext(ReturnConceptsContext);
  if (!context) {
    throw new Error(
      "useReturnConcepts debe ser usado dentro de ReturnConceptsProvider"
    );
  }
  return context;
};
