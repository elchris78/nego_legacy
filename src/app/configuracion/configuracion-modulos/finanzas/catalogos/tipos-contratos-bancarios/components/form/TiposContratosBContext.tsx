"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { tiposContratosBActions } from "../../services/tiposContratosBSlice";

import type { TiposContratosB} from "../../services/tiposContratosBTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";


export interface GeneralDataFormValues {
  nombre: string;
  numeroContrato: string;
  estatus: string;
  userProvidedId: string;
  userProvidedPrefix: string;
}

interface TiposContratosBContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentTiposContratosB: TiposContratosB | null;
  isLoadingTiposContratosB: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const TiposContratosBContext = createContext<TiposContratosBContext | undefined>(
  undefined
);

// Proveedor del contexto
export const TiposContratosBProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("TiposContratosBancarios"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentTiposContratosB, setCurrentTiposContratosB] =
    useState<TiposContratosB | null>(null);
  const [isLoadingTiposContratosB, setIsLoadingTiposContratosB] = useState(false);
  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });
  const router = useRouter();
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentTiposContratosB();
    }
  }, [mode, id]);

  const getCurrentTiposContratosB = async () => {
    try {
      setIsLoadingTiposContratosB(true);
      const resultAction = await dispatch(
        tiposContratosBActions.getTiposContratosBById({
          token,
          id,
        })
      );
      if (tiposContratosBActions.getTiposContratosBById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const restrictionConcept =
        tiposContratosBActions.getTiposContratosBById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;
      setCurrentTiposContratosB(restrictionConcept?.tipoContrato || null);
    } catch (error: any) {
      console.error("Error :", error);
    } finally {
      setIsLoadingTiposContratosB(false);
    }
  };

  const handleSubmitForms = async () => {
  let hasErrors = false;
  let body: any = {};

  await generalDataForm.handleSubmit(
    (data) => {
      const {
        estatus,
        userProvidedId,
        numeroContrato,
        nombre,
        ...restBody
      } = data;

      body = {
        ...restBody,
        nombre: nombre?.trim() || "",
        numeroContrato: numeroContrato?.trim() || "",
        estatus: estatus === "true",
        userProvidedId: userProvidedId?.trim() || "",
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
    <TiposContratosBContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentTiposContratosB,
        isLoadingTiposContratosB,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </TiposContratosBContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useTiposContratosBForm = () => {
  const context = useContext(TiposContratosBContext);
  if (!context) {
    throw new Error(
      "useTiposContratosBContext must be used within a TiposContratosBProvider"
    );
  }
  return context;
};
