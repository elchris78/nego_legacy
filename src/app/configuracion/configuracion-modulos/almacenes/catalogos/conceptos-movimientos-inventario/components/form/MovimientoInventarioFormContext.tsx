"use client";

import { createContext, useContext, useEffect } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { movimientosInventarioActions } from "../../services/movimientosInventariosSlice";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch } from "@/lib/store/store";
import type { GeneralDataFormValues } from "../../services/movimientosInventarioTypes";
import type { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import showAlert from "@/lib/utils/alerts";
import Loading from "@/components/ui/Modals/loading";

interface CuentaBancariaContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const MovimientoInventarioContext = createContext<
  CuentaBancariaContext | undefined
>(undefined);

// Proveedor del contexto
export const MovimientoInventarioProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosMovimientoInventario");

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentMovimientoInventario();
    }
  }, [mode, id]);

  const getCurrentMovimientoInventario = async () => {
    try {
      const response = await dispatch(
        movimientosInventarioActions.getMovimientoInventarioById({
          id,
          token,
        })
      ).unwrap();
    } catch (error: any) {
      showAlert({
        success: false,
        message: error.message || "Ocurrió un error inesperado.",
      });
    }
  };

  const handleSubmitForms = async () => {
    const isValid = await generalDataForm.trigger();

    if (!isValid) {
      const errors = generalDataForm.formState.errors;
      return { isValid, errors };
    }

    const {
      userProvidedId,
      userProvidedPrefix,
      estatus,
      concepto,
      ...restValues
    } = generalDataForm.getValues();

    let body: any = {
      ...restValues,
      estatus: estatus === "true",
      concepto: concepto.trim(),
    };

    if (mode === "edit" && id) {
      return { isValid, values: body };
    }

    // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
    if (
      mode === "new" &&
      (keyConfig?.tipoClave === "Numérico" ||
        keyConfig?.tipoClave === "Alfanumérico")
    ) {
      body.userProvidedId = userProvidedId?.trim();
    }

    // Si el modo es nuevo y el prefijo es Fijo, asignar el prefijo fijo de la configuración
    // Si el modo es nuevo y el prefijo es Variable, asignar el prefijo del campo
    if (mode === "new" && keyConfig?.tienePrefijo) {
      if (keyConfig.tipoPrefijo === "Fijo") {
        body.userProvidedPrefix = keyConfig.prefijo;
      } else if (keyConfig.tipoPrefijo === "Variable") {
        body.userProvidedPrefix = userProvidedPrefix?.trim();
      }
    }

    return {
      isValid,
      values: body,
    };
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <MovimientoInventarioContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </MovimientoInventarioContext.Provider>
  );
};

export const useMovimientoInventarioContext = () => {
  const context = useContext(MovimientoInventarioContext);
  if (!context) {
    throw new Error(
      "useMovimientoInventarioContext must be used within a MovimientoInventarioProvider"
    );
  }
  return context;
};
