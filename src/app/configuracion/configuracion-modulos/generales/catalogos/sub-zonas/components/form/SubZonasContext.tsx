"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { subZonasActions } from "../../services/subZonasSlice";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";

import type { SubZona } from "../../services/subZonasTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveSubzona: string;
  prefix: string;
  isActive: string;
  zona: string;
  name: string;
  description: string;
}

interface SubZonasContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentSubZona: SubZona | null;
  isLoadingSubZona: boolean;
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
const SubZonasContext = createContext<SubZonasContext | undefined>(undefined);

// Proveedor del contexto
export const SubZonasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("SubZonas"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentSubZona, setCurrentSubZona] = useState<SubZona | null>(null);
  const [isLoadingSubZona, setIsLoadingSubZona] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentSubZona();
    }
  }, [mode, id]);

  const getCurrentSubZona = async () => {
    setIsLoadingSubZona(true);
    try {
      setIsLoadingSubZona(true);

      const resultAction = await dispatch(
        subZonasActions.getSubZonaById({
          token,
          id,
        })
      );
      if (subZonasActions.getSubZonaById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      const subZona = subZonasActions.getSubZonaById.fulfilled.match(
        resultAction
      )
        ? resultAction.payload
        : null;

      setCurrentSubZona(subZona?.subZona ?? null);
    } catch (error) {
      console.error("Error fetching subzona:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la subzona.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/generales/catalogos/sub-zonas"
        );
      });
    } finally {
      setIsLoadingSubZona(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveSubzona,
          prefix,
          zona,
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
          zonaId: zona,
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveSubzona?.trim();
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
    <SubZonasContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentSubZona,
        isLoadingSubZona,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </SubZonasContext.Provider>
  );
};

// Hook para usar el contexto
export const useSubZonasForm = () => {
  const context = useContext(SubZonasContext);
  if (!context) {
    throw new Error("useSubZonasForm must be used within a SubZonasProvider");
  }
  return context;
};
