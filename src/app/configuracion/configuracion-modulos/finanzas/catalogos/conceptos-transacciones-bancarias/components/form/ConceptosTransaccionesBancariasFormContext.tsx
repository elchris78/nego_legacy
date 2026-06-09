"use client";

import { createContext, useContext, useEffect } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { conceptosTransaccionesBancariasActions } from "../../services/conceptosTransaccionesBancariasSlice";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch } from "@/lib/store/store";
import type { GeneralDataFormValues } from "../../services/conceptosTransaccionesBancariasTypes";
import type { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import showAlert from "@/lib/utils/alerts";
import Loading from "@/components/ui/Modals/loading";

interface ConceptosTransaccionesBancariasContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const ConceptosTransaccionesBancariasContext = createContext<
  ConceptosTransaccionesBancariasContext | undefined
>(undefined);

// Proveedor del contexto
export const ConceptosTransaccionesBancariasProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation(
    "ConceptosTransaccionesBancarias"
  );

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentConcepto();
    }
  }, [mode, id]);

  const getCurrentConcepto = async () => {
    if (!id) return;
    try {
      const response = await dispatch(
        conceptosTransaccionesBancariasActions.getConceptoTransaccionBancariaById(
          {
            token,
            id,
          }
        )
      ).unwrap();
    } catch (error: any) {
      showAlert({
        success: false,
        message: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  const handleSubmitForms = async () => {
    const isValid = await generalDataForm.trigger();

    if (!isValid) {
      const errors = generalDataForm.formState.errors;
      return { isValid, errors };
    }

    const {
      userProvidedId,
      userProvidedPrefix,
      concepto,
      observaciones,
      estatus,
      validaReferencia,
      ...restValues
    } = generalDataForm.getValues();

    let body: any = {
      ...restValues,
      concepto: concepto?.trim(),
      observaciones: observaciones?.trim(),
      estatus: estatus === "true",
      validaReferencia: validaReferencia === "true",
    };

    if (mode === "edit" && id) {
      return { isValid, values: body };
    }

    // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
    if (
      mode === "new" &&
      (keyConfig?.tipoClave === "Numérico" ||
        keyConfig?.tipoClave === "Alfanumérico")
    ) {
      body.userProvidedId = userProvidedId?.trim();
    }

    // Si el modo es nuevo y el prefijo es Fijo, asignar el prefijo fijo de la configuración
    // Si el modo es nuevo y el prefijo es Variable, asignar el prefijo del campo
    if (mode === "new" && keyConfig?.tienePrefijo) {
      if (keyConfig.tipoPrefijo === "Fijo") {
        body.userProvidedPrefix = keyConfig.prefijo;
      } else if (keyConfig.tipoPrefijo === "Variable") {
        body.userProvidedPrefix = userProvidedPrefix?.trim();
      }
    }

    return {
      isValid,
      values: body,
    };
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <ConceptosTransaccionesBancariasContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </ConceptosTransaccionesBancariasContext.Provider>
  );
};

// Hook para usar el contexto
export const useConceptosTransaccionesBancariasContext = () => {
  const context = useContext(ConceptosTransaccionesBancariasContext);
  if (!context) {
    throw new Error(
      "useConceptosTransaccionesBancariasContext must be used within a ConceptosTransaccionesBancariasProvider"
    );
  }
  return context;
};
