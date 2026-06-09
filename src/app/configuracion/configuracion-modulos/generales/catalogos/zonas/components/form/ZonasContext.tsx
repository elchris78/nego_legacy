"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { zonasActions } from "../../services/zonasSlice";

import type { Zona } from "../../services/zonasTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveZona: string;
  prefix?: string;
  isActive: string;
  name: string;
  description: string;
}

interface ZonasContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentZona: Zona | null;
  isLoadingZona: boolean;
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
const ZonasContext = createContext<ZonasContext | undefined>(undefined);

// Proveedor del contexto
export const ZonasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Zonas");

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentZona, setCurrentZona] = useState<Zona | null>(null);
  const [isLoadingZona, setIsLoadingZona] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentZona();
    }
  }, [mode, id]);

  const getCurrentZona = async () => {
    setIsLoadingZona(true);
    try {
      setIsLoadingZona(true);

      const resultAction = await dispatch(
        zonasActions.getZonaById({
          token,
          id,
        })
      );
      if (zonasActions.getZonaById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      const zona = zonasActions.getZonaById.fulfilled.match(resultAction)
        ? resultAction.payload
        : null;

      setCurrentZona(zona?.zona ?? null);
    } catch (error) {
      console.error("Error fetching zona:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la zona.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/generales/catalogos/zonas"
        );
      });
    } finally {
      setIsLoadingZona(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { claveZona, prefix, name, description, isActive, ...restBody } =
          data;

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
          body.userProvidedId = claveZona?.trim();
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
    <ZonasContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentZona,
        isLoadingZona,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </ZonasContext.Provider>
  );
};

// Hook para usar el contexto
export const useZonasForm = () => {
  const context = useContext(ZonasContext);
  if (!context) {
    throw new Error("useZonasForm must be used within a ZonasProvider");
  }
  return context;
};
