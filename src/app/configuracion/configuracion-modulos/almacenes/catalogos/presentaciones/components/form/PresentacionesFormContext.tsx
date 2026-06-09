"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";

import { getPresentacionesById } from "../../services/presentacionesAction";
import { Presentaciones } from "../../services/presentacionesTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  clavePresentacion: string;
  prefix?: string;
  estatus: string;
  descripcion: string;
}

interface PresentacionesFormContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentPresentaciones: Presentaciones | null;
  isLoadingPresentaciones: boolean;
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
const PresentacionesFormContext = createContext<
  PresentacionesFormContext | undefined
>(undefined);

// Proveedor del contexto
export const PresentacionesFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading  } = useKeyConfigValidation("Presentaciones"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentPresentaciones, setCurrentPresentaciones] =
    useState<Presentaciones | null>(null);
  const [isLoadingPresentaciones, setIsLoadingPresentaciones] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
        getCurrentPresentaciones();
    }
  }, [mode, id]);

  const getCurrentPresentaciones = async () => {
    setIsLoadingPresentaciones(true);
    try {
      const response = await getPresentacionesById({
        token,
        id,
      });

      if (response && response.success) {
        setCurrentPresentaciones(response.presentacion);
        console.log("Departamento obtenido:", response.presentacion);
      } else {
        console.error("Error: Departamento no encontrado o éxito false.");
      }
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la presentación.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/presentaciones"
        );
      });
    } finally {
      setIsLoadingPresentaciones(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { clavePresentacion, prefix, descripcion, ...restBody } = data;

        body = {
          ...restBody,
          descripcion: descripcion.trim(),
          estatus: restBody.estatus === "true" || restBody.estatus === "true", // asegúrate que sea booleano
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = clavePresentacion?.trim();
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
    <PresentacionesFormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        currentPresentaciones: currentPresentaciones,
        isLoadingPresentaciones: isLoadingPresentaciones,
        keyConfig,
      }}
    >
      {children}
    </PresentacionesFormContext.Provider>
  );
};

// Hook para usar el contexto
export const usePresentacionesForm = () => {
  const context = useContext(PresentacionesFormContext);
  if (!context) {
    throw new Error(
      "usePresentacionesForm must be used within a PresentacionesFormProvider"
    );
  }
  return context;
};
