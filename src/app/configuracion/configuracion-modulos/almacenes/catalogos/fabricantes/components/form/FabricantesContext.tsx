"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

import { fabricanteActions } from "../../services/fabricanteSlice";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch } from "@/lib/store/store";
import type { Fabricante } from "../../services/fabricantesTypes";
import type { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveFabricante: string;
  prefix?: string;
  estatus: string;
  nombre: string;
  pais: string;
  codigoPostal: string;
  estado: string;
  ciudad: string;
  colonia: string;
  calle: string;
  numero: string;
  telefono: string;
  correo: string;
  contactoAdicional: string;
}

interface FabricantesContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentFabricante: Fabricante | null;
  isLoadingFabricante: boolean;
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
const FabricantesContext = createContext<FabricantesContext | undefined>(
  undefined
);

// Proveedor del contexto
export const FabricantesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Fabricantes"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentFabricante, setCurrentFabricante] = useState<Fabricante | null>(
    null
  );
  const [isLoadingFabricante, setIsLoadingFabricante] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentFabricante();
    }
  }, [mode, id]);

  const getCurrentFabricante = async () => {
    try {
      setIsLoadingFabricante(true);
      const resultAction = await dispatch(
        fabricanteActions.getFabricanteById({
          token,
          id,
        })
      );
      if (fabricanteActions.getFabricanteById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const fabricante = fabricanteActions.getFabricanteById.fulfilled.match(
        resultAction
      )
        ? resultAction.payload
        : null;
      setCurrentFabricante(fabricante?.fabricante || null);
    } catch (error) {
      console.error("Error al obtener el fabricante:", error);
      Swal.fire({
        title: "Error",
        text: "Error al consultar la información del fabricante.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes"
        );
      });
    } finally {
      setIsLoadingFabricante(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveFabricante,
          prefix,
          estatus,
          nombre,
          codigoPostal,
          pais,
          estado,
          ciudad,
          calle,
          colonia,
          numero,
          correo,
          telefono,
          contactoAdicional,
          ...restBody
        } = data;

        body = {
          ...restBody,
          estatus: estatus === "true",
          nombre: nombre?.trim(),
          codigoPostal: codigoPostal?.trim(),
          paisClave: pais,
          estado: estado?.trim(),
          ciudad: ciudad?.trim(),
          calle: calle?.trim(),
          colonia: colonia?.trim(),
          numeroExterior: numero?.trim(),
          correo: correo?.trim(),
          telefono: telefono?.trim(),
          contactoAdicional: contactoAdicional?.trim(),
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveFabricante?.trim();
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
    <FabricantesContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentFabricante,
        isLoadingFabricante,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </FabricantesContext.Provider>
  );
};

// Hook para usar el contexto
export const useFabricantesContextForm = () => {
  const context = useContext(FabricantesContext);
  if (!context) {
    throw new Error(
      "useFabricantesContext must be used within a FabricantesProvider"
    );
  }
  return context;
};
