"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { empaquesActions } from "../../services/empaquesSlice";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch } from "@/lib/store/store";
import type { Empaque } from "../../services/empaquesTypes";
import type { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveEmpaque: string;
  prefix?: string;
  descripcion: string;
  isActive: string;
  unidadSat: string;
}

interface EmpaquesContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentEmpaque: Empaque | null;
  isLoadingEmpaque: boolean;
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
const EmpaquesContext = createContext<EmpaquesContext | undefined>(undefined);

// Proveedor del contexto
export const EmpaquesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading  } = useKeyConfigValidation("Empaques");

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentEmpaque, setCurrentEmpaque] = useState<Empaque | null>(null);
  const [isLoadingEmpaque, setIsLoadingEmpaque] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentRestrictionConcept();
    }
  }, [mode, id]);

  const getCurrentRestrictionConcept = async () => {
    try {
      setIsLoadingEmpaque(true);
      const resultAction = await dispatch(
        empaquesActions.getEmpaqueById({
          token,
          id,
        })
      );
      if (empaquesActions.getEmpaqueById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      const restrictionConcept = empaquesActions.getEmpaqueById.fulfilled.match(
        resultAction
      )
        ? resultAction.payload
        : null;

      setCurrentEmpaque(restrictionConcept?.empaque || null);
    } catch (error: any) {
      console.error("Error al obtener el concepto de devolución:", error);
      Swal.fire({
        title: "Error",
        text: "Error al consultar la información del fabricante.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/empaques"
        );
      });
    } finally {
      setIsLoadingEmpaque(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { claveEmpaque, prefix, descripcion, isActive, unidadSat, ...restBody } =
          data;

        body = {
          ...restBody,
          descripcion: descripcion.trim(),
          estatus: isActive === "true",
          unidadSat: unidadSat,
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveEmpaque?.trim();
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
    <EmpaquesContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentEmpaque,
        isLoadingEmpaque,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </EmpaquesContext.Provider>
  );
};

// Hook para usar el contexto
export const useEmpaquesContextForm = () => {
  const context = useContext(EmpaquesContext);
  if (!context) {
    throw new Error(
      "useEmpaquesContext must be used within a EmpaquesProvider"
    );
  }
  return context;
};
