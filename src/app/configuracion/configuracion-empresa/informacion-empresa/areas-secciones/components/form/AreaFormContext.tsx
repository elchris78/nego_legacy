"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { areasActions } from "../../services/areasSlice";
import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { AppDispatch } from "@/lib/store/store";
import type { Area } from "../../services/areaTypes";
import type { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveArea: string;
  prefix?: string;
  estatus: string;
  nombre: string;
  descripcion?: string;
  responsibleId?: string;
}

interface AreaFormContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentArea: Area | null;
  isLoadingArea: boolean;
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
const AreaFormContext = createContext<AreaFormContext | undefined>(undefined);

// Proveedor del contexto
export const AreaFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();

  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Areas");

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [isLoadingArea, setIsLoadingArea] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentArea();
    }
  }, [mode, id]);

  const getCurrentArea = async () => {
    try {
      setIsLoadingArea(true);
      const resultAction = await dispatch(
        areasActions.getAreaById({ token, id })
      );
      if (areasActions.getAreaById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      const area = areasActions.getAreaById.fulfilled.match(resultAction)
        ? resultAction.payload
        : null;
      setCurrentArea(area?.area!);
    } catch (error) {
      console.error("Error fetching area:", error);
      Swal.fire({
        title: "Error",
        text: "Error al consultar la información del área.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-empresa/informacion-empresa/areas-secciones"
        );
      });
    } finally {
      setIsLoadingArea(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveArea,
          nombre,
          descripcion,
          estatus,
          responsibleId,
          ...restBody
        } = data;

        body = {
          ...restBody,
          nombre: nombre?.trim(),
          estatus: estatus === "true",
          descripcion: descripcion?.trim(),
          idResponsable: responsibleId,
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveArea?.trim();
        }

        // Si el modo es nuevo y el prefijo es Fijo, asignar el prefijo fijo de la configuración
        // Si el modo es nuevo y el prefijo es Variable, asignar el prefijo del campo
        if (mode === "new" && keyConfig?.tienePrefijo) {
          if (keyConfig.tipoPrefijo === "Fijo") {
            body.userProvidedPrefix = keyConfig.prefijo;
          } else if (keyConfig.tipoPrefijo === "Variable") {
            body.userProvidedPrefix = data.prefix?.trim();
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
    <AreaFormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentArea,
        isLoadingArea,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </AreaFormContext.Provider>
  );
};

// Hook para usar el contexto
export const useAreaForm = () => {
  const context = useContext(AreaFormContext);
  if (!context) {
    throw new Error("useAreaForm must be used within a AreaFormProvider");
  }
  return context;
};
