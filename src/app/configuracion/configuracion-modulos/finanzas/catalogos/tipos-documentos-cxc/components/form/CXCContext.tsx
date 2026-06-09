"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";

import type { CXC } from "../../services/cxcsTypes";
import { getCuentaPorCobrarById } from "../../services/CXCSlice";
import showAlert from "@/lib/utils/alerts";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";


interface GeneralDataFormValues {
  claveCXC: string; // Opcional, si se quiere asignar un ID específico
  prefix?: string; // Opcional, si se quiere asignar un prefijo específico
  estatus: string;
  tipoDocumento: string;
  origen?: string;
}

interface CuentaPorCobrarContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentCXC: CXC | null;
  isLoadingCXC: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const CuentaPorCobrarContext = createContext<
  CuentaPorCobrarContext | undefined
>(undefined);

// Proveedor del contexto
export const CXCProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();

  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("TipoDocumentosCuentasPorCobrar"); // Hook para validar la configuración de claves


  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = (searchParams.get("id"));


  // Redux
  const entity = useSelector((state: RootState) => state.cxcs.tipoDocumento);
  const loading = useSelector((state: RootState) => state.cxcs.loading);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveCXC,
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
          body.userProvidedId = claveCXC?.trim();
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
          await dispatch(getCuentaPorCobrarById({ token, request: { id } }));
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
    <CuentaPorCobrarContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentCXC: entity,
        isLoadingCXC: loading,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </CuentaPorCobrarContext.Provider>
  );
};

// Hook para usar el contexto
export const useCXCs = () => {
  const context = useContext(CuentaPorCobrarContext);
  if (!context) {
    throw new Error(
      "useCXCs debe ser usado dentro de un CXCProvider"
    );
  }
  return context;
};
