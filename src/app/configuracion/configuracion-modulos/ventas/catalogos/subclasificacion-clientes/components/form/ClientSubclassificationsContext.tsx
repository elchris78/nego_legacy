"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";

import type { ClientSubclassification } from "../../services/clientsSubclassificationTypes";
import { getClientSubclassificationById } from "../../services/clientsSubclassificationSlice";
import showAlert from "@/lib/utils/alerts";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveSubclasificacion: string;
  prefix?: string;
  estatus: string;
  nombre: string;
  descripcion: string;
}

interface ClientSubclassificationContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentClientSubclassification: ClientSubclassification | null;
  isLoadingClientSubclassification: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const ClientSubclassificationContext = createContext<
  ClientSubclassificationContext | undefined
>(undefined);

// Proveedor del contexto
export const ClientSubclassificationsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("SubclasificacionesClientes"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id") ?? null;

  // Redux
  const entity = useSelector(
    (state: RootState) => state.clientSubclassification.clientSubclassification
  );
  const loading = useSelector(
    (state: RootState) => state.clientSubclassification.loading
  );

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { claveSubclasificacion, prefix, nombre, descripcion, estatus, ...restBody } =
          data;
        body = {
          ...restBody,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          estatus: estatus === "true",
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveSubclasificacion?.trim();
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

  // UseEffects
  useEffect(() => {
  const fetchClientSubclassification = async () => {
    if (mode !== "new" && id) {
      try {
        await dispatch(
          getClientSubclassificationById({ token, request: { id } })
        );
      } catch (error) {
        showAlert({
          success: false,
          message: `Ocurrió un error al recuperar la información. ${error}`,
        });
      }
    }
  };

  fetchClientSubclassification();
}, [mode, id, token, dispatch]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <ClientSubclassificationContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentClientSubclassification: entity,
        isLoadingClientSubclassification: loading,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </ClientSubclassificationContext.Provider>
  );
};

// Hook para usar el contexto
export const useClientSubclassifications = () => {
  const context = useContext(ClientSubclassificationContext);
  if (!context) {
    throw new Error(
      "useClientSubclassifications debe ser usado dentro de un ClientSubclassificationsProvider"
    );
  }
  return context;
};
