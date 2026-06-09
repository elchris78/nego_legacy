"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";

import { getEstatusProdById } from "../../services/estatusProdAction";
import { Estatus } from "../../services/estatusProdTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Swal from "sweetalert2";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveEstatus: string;
  prefix?: string;
  estatus: string;
  nombre: string;
}

interface EstatusProdFormContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentEstatusProd: Estatus | null;
  isLoadingEstatusProd: boolean;
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
const EstatusProdFormContext = createContext<
  EstatusProdFormContext | undefined
>(undefined);

// Proveedor del contexto
export const EstatusProdFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading  } = useKeyConfigValidation("EstatusProductos"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentEstatusProd, setCurrentEstatusProd] = useState<Estatus | null>(
    null
  );
  const [isLoadingEstatusProd, setIsLoadingEstatusProd] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      
        getCurrentEstatusProd();
    }
  }, [mode, id]);

  const getCurrentEstatusProd = async () => {
    setIsLoadingEstatusProd(true);
    try {
      const response = await getEstatusProdById({
        token,
        id,
      });

      if (response && response.success) {
        setCurrentEstatusProd(response.estatusProducto);
        console.log("Departamento obtenido:", response.estatusProducto);
      } else {
        console.error("Error: Departamento no encontrado o éxito false.");
      }
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar el estatus de producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/estatus-de-producto"
        );
      });
    } finally {
      setIsLoadingEstatusProd(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { claveEstatus, prefix, nombre, ...restBody } = data;

        body = {
          ...restBody,
          nombre: nombre.trim(),
          estatus: restBody.estatus === "true" || restBody.estatus === "true", // asegúrate que sea booleano
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveEstatus?.trim();
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
    <EstatusProdFormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        currentEstatusProd: currentEstatusProd,
        isLoadingEstatusProd: isLoadingEstatusProd,
        keyConfig,
      }}
    >
      {children}
    </EstatusProdFormContext.Provider>
  );
};

// Hook para usar el contexto
export const useEstatusProdForm = () => {
  const context = useContext(EstatusProdFormContext);
  if (!context) {
    throw new Error(
      "useEstatusProdForm must be used within a EstatusProdFormProvider"
    );
  }
  return context;
};
