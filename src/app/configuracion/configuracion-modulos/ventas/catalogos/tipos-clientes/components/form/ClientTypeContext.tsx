"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { AppDispatch } from "@/lib/store/store";
import { clientTypesActions } from "../../services/clientTypesSlice";

import type { ClientType } from "../../services/clientTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveTipoCliente: string;
  prefix?: string;
  name: string;
  description: string;
  isActive: string;
}

interface ClientTypesContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentClientType: ClientType | null;
  isLoadingClientType: boolean;
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
const ClientTypesContext = createContext<ClientTypesContext | undefined>(
  undefined
);

// Proveedor del contexto
export const ClientTypesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const router = useRouter();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("TipoClientes"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentClientType, setCurrentClientType] = useState<ClientType | null>(
    null
  );
  const [isLoadingClientType, setIsLoadingClientType] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentClientType();
    }
  }, [mode, id]);

  const getCurrentClientType = async () => {
    try {
      setIsLoadingClientType(true);
      const resultAction = await dispatch(
        clientTypesActions.getClientTypeById({
          token,
          id,
        })
      );
      if (clientTypesActions.getClientTypeById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const restrictionConcept =
        clientTypesActions.getClientTypeById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;
      setCurrentClientType(restrictionConcept?.tipoCliente || null);
    } catch (error: any) {
      console.error("Error al obtener el concepto de devolución:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar el tipo de cliente.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/ventas/catalogos/tipos-clientes"
        );
      });
    } finally {
      setIsLoadingClientType(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveTipoCliente,
          prefix,
          name,
          description,
          isActive,
          ...restBody
        } = data;

        body = {
          ...restBody,
          nombre: name?.trim(),
          descripcion: description?.trim(),
          estatus: isActive === "true",
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveTipoCliente?.trim();
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
    <ClientTypesContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentClientType,
        isLoadingClientType,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </ClientTypesContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useClientTypesForm = () => {
  const context = useContext(ClientTypesContext);
  if (!context) {
    throw new Error(
      "useClientTypesContext must be used within a ClientTypesProvider"
    );
  }
  return context;
};
