"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";

import type { CXP } from "../../services/cxpsTypes";
import { getCuentaPorPagarById } from "../../services/CXPSlice";
import showAlert from "@/lib/utils/alerts";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";


interface GeneralDataFormValues {
  claveCXP: string; // Opcional, si se quiere asignar un ID específico
  prefix?: string; // Opcional, si se quiere asignar un prefijo específico
  estatus: string;
  tipoDocumento: string;
  origen?: string;
}

interface CuentaPorPagarContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentCXP: CXP | null;
  isLoadingCXP: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const CuentaPorPagarContext = createContext<
  CuentaPorPagarContext | undefined
>(undefined);

// Proveedor del contexto
export const CXPProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();

  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("TipoDocumentosCuentasPorPagar"); // Hook para validar la configuración de claves


  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = (searchParams.get("id"));


  // Redux
  const entity = useSelector((state: RootState) => state.cxps.tipoDocumento);
  const loading = useSelector((state: RootState) => state.cxps.loading);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveCXP,
          prefix,
          tipoDocumento,
          origen,
          ...restBody } = data;
        body = {
          ...restBody,
          tipoDocumento: tipoDocumento.trim(),
          // origen: (origen ?? "").trim(),
        };
        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveCXP?.trim();
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
      (error) => {
        hasErrors = true;
      }
    )();

    if (hasErrors) return;

    if (mode === "new") {
      // Crear
    } else if (mode === "edit") {
      // Editar
    }

    return body;
  };

  // UseEffects 
  useEffect(() => {
    const fetchIndividual = async () => {
      if (mode !== "new" && id) {
        try {
          await dispatch(getCuentaPorPagarById({ token, request: { id } }));
        } catch (error) {
          showAlert({success: false, message: `Ocurrió un error al recuperar la información. ${error}`})
        }
      }
    };

    fetchIndividual();
  }, [mode, id, token, dispatch]);
  
  if (isKeyConfigLoading) {
    return <Loading />
  }
  return (
    <CuentaPorPagarContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentCXP: entity,
        isLoadingCXP: loading,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </CuentaPorPagarContext.Provider>
  );
};

// Hook para usar el contexto
export const useCXPs = () => {
  const context = useContext(CuentaPorPagarContext);
  if (!context) {
    throw new Error(
      "useCXPs debe ser usado dentro de un CXPProvider"
    );
  }
  return context;
};
