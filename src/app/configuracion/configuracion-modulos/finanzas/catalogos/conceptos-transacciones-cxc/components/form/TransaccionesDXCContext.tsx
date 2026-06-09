"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { transaccionesDXCActions } from "../../services/transaccionesDXCSlice";

import type { TransaccionesDXC} from "../../services/transaccionesDXCTypes";
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
  tipoRelacionSat: string;
  requiereAutorizacion: boolean;
  generaDocumento: string;
  afectaDepositos: boolean;
  validaReferencias: boolean;
  observaciones: string;
  cancelaNotaCredito: boolean;
  cancelaPago: boolean;
  formaPago: string;
  origen: string;
}

interface TransaccionesDXCContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentTransaccionesDXC: TransaccionesDXC | null;
  isLoadingTransaccionesDXC: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const TransaccionesDXCContext = createContext<TransaccionesDXCContext | undefined>(
  undefined
);

// Proveedor del contexto
export const TransaccionesDXCProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosTransaccionesCuentasPorCobrar"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentTransaccionesDXC, setCurrentTransaccionesDXC] =
    useState<TransaccionesDXC | null>(null);
  const [isLoadingTransaccionesDXC, setIsLoadingTransaccionesDXC] = useState(false);
  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });
  const router = useRouter();
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentTransaccionesDXC();
    }
  }, [mode, id]);

  const getCurrentTransaccionesDXC = async () => {
    try {
      setIsLoadingTransaccionesDXC(true);
      const resultAction = await dispatch(
        transaccionesDXCActions.getTransaccionesDXCById({
          token,
          id,
        })
      );
      if (transaccionesDXCActions.getTransaccionesDXCById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const restrictionConcept =
        transaccionesDXCActions.getTransaccionesDXCById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;
      setCurrentTransaccionesDXC(restrictionConcept?.conceptoTransaccion || null);
    } catch (error: any) {
      console.error("Error :", error);
    } finally {
      setIsLoadingTransaccionesDXC(false);
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
        tipoRelacionSat,
        requiereAutorizacion,
        generaDocumento,
        afectaDepositos,
        validaReferencias,
        observaciones,
        cancelaNotaCredito,
        cancelaPago,
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
        tipoRelacionSat: tipoRelacionSat?.trim() || "",
        requiereAutorizacion: Boolean(requiereAutorizacion), // Aseguramos que sea booleano
        generaDocumento: generaDocumento?.trim() || "",
        afectaDepositos: Boolean(afectaDepositos), // Aseguramos que sea booleano
        validaReferencias: Boolean(validaReferencias), // Aseguramos que sea booleano
        observaciones: observaciones?.trim() || "", // Aseguramos que sea strin
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
    <TransaccionesDXCContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentTransaccionesDXC,
        isLoadingTransaccionesDXC,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </TransaccionesDXCContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useTransaccionesDXCForm = () => {
  const context = useContext(TransaccionesDXCContext);
  if (!context) {
    throw new Error(
      "useTransaccionesDXCContext must be used within a TransaccionesDXCProvider"
    );
  }
  return context;
};
