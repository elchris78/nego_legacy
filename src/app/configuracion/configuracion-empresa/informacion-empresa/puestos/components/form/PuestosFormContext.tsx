"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";

import type { Puestos } from "../../services/puestosTypes";
import { getPuestosById } from "../../services/puestosAction";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  clavePuesto: string;
  prefix?: string;
  estatus: string;
  nombre: string;
  descripcion: string;
  aplicaPara: string[];
}

interface PuestosFormContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentPuestos: Puestos | null;
  isLoadingPuestos: boolean;
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
const PuestosFormContext = createContext<PuestosFormContext | undefined>(
  undefined
);

// Proveedor del contexto
export const PuestosFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Puestos"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentPuestos, setCurrentPuestos] = useState<Puestos | null>(null);
  const [isLoadingPuestos, setIsLoadingPuestos] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
        getCurrentPuestos();
    }
  }, [mode, id]);

  const getCurrentPuestos = async () => {
    setIsLoadingPuestos(true);
    try {
      const response = await getPuestosById({
        token,
        id,
      });

      if (response && response.success) {
        setCurrentPuestos(response.puesto);
        console.log("Departamento obtenido:", response.puesto);
      } else {
        console.error("Error: Departamento no encontrado o éxito false.");
      }
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la clasificación de clientes.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-empresa/informacion-empresa/puestos"
        );
      });
    } finally {
      setIsLoadingPuestos(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { clavePuesto, prefix, nombre, descripcion, ...restBody } = data;

        body = {
          ...restBody,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          estatus: restBody.estatus === "true" || restBody.estatus === "true", // asegúrate que sea booleano
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = clavePuesto?.trim();
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
    <PuestosFormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        currentPuestos: currentPuestos,
        isLoadingPuestos: isLoadingPuestos,
        keyConfig,
      }}
    >
      {children}
    </PuestosFormContext.Provider>
  );
};

// Hook para usar el contexto
export const usePuestosForm = () => {
  const context = useContext(PuestosFormContext);
  if (!context) {
    throw new Error("usePuestosForm must be used within a PuestosFormProvider");
  }
  return context;
};
