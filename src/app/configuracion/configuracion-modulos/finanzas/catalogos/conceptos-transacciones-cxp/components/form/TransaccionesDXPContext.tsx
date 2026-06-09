"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { transaccionesDXPActions } from "../../services/transaccionesDXPSlice";

import type { TransaccionesDXP} from "../../services/transaccionesDXPTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";


export interface GeneralDataFormValues {
  conceptoTransaccion: string;
  estatus: string;
  userProvidedId: string;
  userProvidedPrefix: string;
  contrapartidaId: string;
  tipoTransaccion: string;
  observaciones: string;
  formaPago: string;
  origen: string;
  requiereAutorizacion?: boolean;
  requiereNotaCredito?: boolean;
  afectaCheques?: boolean;
  cancelaNotaCredito?: boolean;
  cancelaPago?: boolean;
  validaReferencia?: boolean;
}

interface TransaccionesDXPContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentTransaccionesDXP: TransaccionesDXP | null;
  isLoadingTransaccionesDXP: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const TransaccionesDXPContext = createContext<TransaccionesDXPContext | undefined>(
  undefined
);

// Proveedor del contexto
export const TransaccionesDXPProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosTransaccionesCuentasPorPagar"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentTransaccionesDXP, setCurrentTransaccionesDXP] =
    useState<TransaccionesDXP | null>(null);
  const [isLoadingTransaccionesDXP, setIsLoadingTransaccionesDXP] = useState(false);
  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });
  const router = useRouter();
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentTransaccionesDXP();
    }
  }, [mode, id]);

  const getCurrentTransaccionesDXP = async () => {
    try {
      setIsLoadingTransaccionesDXP(true);
      const resultAction = await dispatch(
        transaccionesDXPActions.getTransaccionesDXPById({
          token,
          id,
        })
      );
      if (transaccionesDXPActions.getTransaccionesDXPById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const restrictionConcept =
        transaccionesDXPActions.getTransaccionesDXPById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;
      setCurrentTransaccionesDXP(restrictionConcept?.conceptoTransaccion || null);
    } catch (error: any) {
      console.error("Error :", error);
    } finally {
      setIsLoadingTransaccionesDXP(false);
    }
  };

  const handleSubmitForms = async () => {
  let hasErrors = false;
  let body: any = {};

  await generalDataForm.handleSubmit(
    (data) => {
      const {
        conceptoTransaccion,
        estatus,
        userProvidedId,
        contrapartidaId,
        tipoTransaccion,
        requiereAutorizacion,
        requiereNotaCredito,
        afectaCheques,
        cancelaNotaCredito,
        cancelaPago,
        validaReferencia,
        observaciones,
        formaPago,
        ...restBody
      } = data;

      body = {
        ...restBody,
        conceptoTransaccion: conceptoTransaccion?.trim() || "",
        estatus: estatus === "true",
        userProvidedId: userProvidedId?.trim() || "",
        contrapartidaId: contrapartidaId?.trim() || null,
        tipoTransaccion: tipoTransaccion?.trim() || "",
        requiereAutorizacion: Boolean(requiereAutorizacion), // Aseguramos que sea booleano
        afectaCheques: Boolean(afectaCheques), // Aseguramos que sea booleano
        validaReferencia: Boolean(validaReferencia), // Aseguramos que sea booleano
        requiereNotaCredito: Boolean(requiereNotaCredito),
        observaciones: observaciones?.trim() || "", // Aseguramos que sea booleano
        cancelaNotaCredito: Boolean(cancelaNotaCredito), // Aseguramos que sea booleano
        cancelaPago: Boolean(cancelaPago), // Aseguramos que sea booleano
        formaPago: formaPago?.trim() || "",
      };

      if (
        mode === "new" &&
        (keyConfig?.tipoClave === "Numérico" ||
          keyConfig?.tipoClave === "Alfanumérico")
      ) {
        body.userProvidedId = userProvidedId?.trim();
      }

      if (mode === "new" && keyConfig?.tienePrefijo) {
        if (keyConfig.tipoPrefijo === "Fijo") {
          body.userProvidedPrefix = keyConfig.prefijo;
        } else if (keyConfig.tipoPrefijo === "Variable") {
          body.userProvidedPrefix = data.userProvidedPrefix?.trim();
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
    <TransaccionesDXPContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentTransaccionesDXP,
        isLoadingTransaccionesDXP,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </TransaccionesDXPContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useTransaccionesDXPForm = () => {
  const context = useContext(TransaccionesDXPContext);
  if (!context) {
    throw new Error(
      "useTransaccionesDXPContext must be used within a TransaccionesDXPProvider"
    );
  }
  return context;
};
