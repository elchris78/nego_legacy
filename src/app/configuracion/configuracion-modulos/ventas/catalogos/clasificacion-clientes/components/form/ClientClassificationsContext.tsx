"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch } from "@/lib/store/store";
import type { ClientClassification } from "../../services/clientesClassificationTypes";
import { clientClassificationsActions } from "../../services/clientClassificationsSlice";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveClasificacion: string;
  prefix?: string;
  isActive: string;
  name: string;
  description: string;
}

interface ClientClassificationsContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentClientClassification: ClientClassification | null;
  isLoadingClientClassification: boolean;
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
const ClientClassificationsContext = createContext<
  ClientClassificationsContext | undefined
>(undefined);

// Proveedor del contexto
export const ClientClassificationsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ClasificacionesClientes"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentClientClassification, setCurrentClientClassification] =
    useState<ClientClassification | null>(null);
  const [isLoadingClientClassification, setIsLoadingClientClassification] =
    useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentClientClassification();
    }
  }, [mode, id]);

  const getCurrentClientClassification = async () => {
    try {
      setIsLoadingClientClassification(true);
      const resultAction = await dispatch(
        clientClassificationsActions.getClientClassification({
          token,
          id,
        })
      );
      if (
        clientClassificationsActions.getClientClassification.rejected.match(
          resultAction
        )
      ) {
        throw resultAction.payload;
      }

      const clientClassification =
        clientClassificationsActions.getClientClassification.fulfilled.match(
          resultAction
        )
          ? resultAction.payload
          : null;

      setCurrentClientClassification(clientClassification?.clasificacion!);
    } catch (error) {
      console.error("Error al obtener la clasificación del cliente:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la clasificación de clientes.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/ventas/catalogos/clasificacion-clientes"
        );
      });
    } finally {
      setIsLoadingClientClassification(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveClasificacion,
          prefix,
          name,
          description,
          isActive,
          ...restBody
        } = data;

        body = {
          ...restBody,
          nombre: name.trim(),
          descripcion: description.trim(),
          estatus: isActive === "true",
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveClasificacion?.trim();
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
    <ClientClassificationsContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentClientClassification,
        isLoadingClientClassification,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </ClientClassificationsContext.Provider>
  );
};

// Hook para usar el contexto
export const useClientClassifications = () => {
  const context = useContext(ClientClassificationsContext);
  if (!context) {
    throw new Error(
      "useClientClassifications debe ser usado dentro de un ClientClassificationsProvider"
    );
  }
  return context;
};
