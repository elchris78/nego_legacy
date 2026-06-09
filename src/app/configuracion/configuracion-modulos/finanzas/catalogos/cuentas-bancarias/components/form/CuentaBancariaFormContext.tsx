"use client";

import { createContext, useContext, useEffect } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { cuentasBancariasActions } from "../../services/cuentasBancariasSlice";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { AppDispatch } from "@/lib/store/store";
import type { GeneralDataFormValues } from "../../services/cuentasBancariasTypes";
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
const CuentaBancariaContext = createContext<CuentaBancariaContext | undefined>(
  undefined
);

// Proveedor del contexto
export const CuentaBancariaProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("CuentasBancarias");

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentCuentaBancaria();
    }
  }, [mode, id]);

  const getCurrentCuentaBancaria = async () => {
    try {
      await dispatch(
        cuentasBancariasActions.getCuentaBancariaById({
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
      numeroCuenta,
      descripcion,
      plaza,
      sucursal,
      clabe,
      swift,
      estatus,
      ...restValues
    } = generalDataForm.getValues();

    let body: any = {
      ...restValues,
      numeroCuenta: numeroCuenta?.trim(),
      descripcion: descripcion?.trim(),
      plaza: plaza?.trim(),
      sucursal: sucursal?.trim(),
      clabe: clabe?.trim(),
      swift: swift?.trim(),
      estatus: estatus === "true",
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
    <CuentaBancariaContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </CuentaBancariaContext.Provider>
  );
};

export const useCuentaBancariaContext = () => {
  const context = useContext(CuentaBancariaContext);
  if (!context) {
    throw new Error(
      "useCuentaBancariaContext must be used within a CuentaBancariaProvider"
    );
  }
  return context;
};
