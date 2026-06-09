"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";

import { getTipoAlmacenajeById } from "../../services/tipoAlmacenajeAction";
import { TipoAlmacenaje } from "../../services/tipoAlmacenaje";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Swal from "sweetalert2";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveTiposAlmacenaje: string;
  prefix?: string;
  tipo: string;
}

interface TiposAlmacenajeFormContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentTiposAlmacenaje: TipoAlmacenaje | null;
  isLoadingTiposAlmacenaje: boolean;
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
const TiposAlmacenajeFormContext = createContext<
  TiposAlmacenajeFormContext | undefined
>(undefined);

// Proveedor del contexto
export const EstatusProdFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading} = useKeyConfigValidation("TiposAlmacenaje"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentTiposAlmacenaje, setCurrentTiposAlmacenaje] = useState<TipoAlmacenaje | null>(
    null
  );
  const [isLoadingTiposAlmacenaje, setIsLoadingTiposAlmacenaje] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      
        getCurrentTipoAlmacenaje();
    }
  }, [mode, id]);

  const getCurrentTipoAlmacenaje = async () => {
    setIsLoadingTiposAlmacenaje(true);
    try {
      const response = await getTipoAlmacenajeById({
        token,
        id,
      });

      if (response && response.success) {
        setCurrentTiposAlmacenaje(response.tipoAlmacenaje);
        console.log("Departamento obtenido:", response.tipoAlmacenaje);
      } else {
        console.error("Error.");
      }
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar el estatus de producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes"
        );
      });
    } finally {
      setIsLoadingTiposAlmacenaje(false);
    }
  };

  const handleSubmitForms = async () => {
  let hasErrors = false;
  let body: any = {};

  await generalDataForm.handleSubmit(
    (data) => {
      const {
        claveTiposAlmacenaje,
        prefix,
        tipo,
      } = data;

      // Si es modo "edit", solo enviar nombre y estatus
      if (mode === "edit") {
        body = {
          tipo: tipo.trim(),
        };
        return;
      }

      // Para modo "new"
      body = {
        tipo: tipo.trim(),
      };

      if (
        keyConfig?.tipoClave === "Numérico" ||
        keyConfig?.tipoClave === "Alfanumérico"
      ) {
        body.userProvidedId = claveTiposAlmacenaje?.trim();
      }

      if (keyConfig?.tienePrefijo) {
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
    console.error("Form has errors, not submitting:", generalDataForm.formState.errors);
    return undefined;
  }
};

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <TiposAlmacenajeFormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        currentTiposAlmacenaje,
        isLoadingTiposAlmacenaje,
        keyConfig,
      }}
    >
      {children}
    </TiposAlmacenajeFormContext.Provider>
  );
};

// Hook para usar el contexto
export const useTiposAlmacenajeForm = () => {
  const context = useContext(TiposAlmacenajeFormContext);
  if (!context) {
    throw new Error(
      "useTiposAlmacenajeForm must be used within a TiposAlmacenajeProvider"
    );
  }
  return context;
};
