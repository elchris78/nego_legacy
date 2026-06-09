"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { monedasActions } from "../../services/monedasSlice";

import type { Monedas } from "../../services/monedasTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";


interface GeneralDataFormValues {
  monedaSatId: string;
  descripcion: string;
  isActive: string;
  userProvidedId?: string;
  userProvidedPrefix?: string;
  id: any;
  paisId?: string;
  tipoCambio?: string;
}

interface MonedasContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentMonedas: Monedas | null;
  isLoadingMonedas: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const MonedasContext = createContext<MonedasContext | undefined>(
  undefined
);

// Proveedor del contexto
export const MonedasProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Monedas"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentMonedas, setCurrentMonedas] =
    useState<Monedas | null>(null);
  const [isLoadingMonedas, setIsLoadingMonedas] = useState(false);
  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });
  const router = useRouter();
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentMoneda();
    }
  }, [mode, id]);

  const getCurrentMoneda = async () => {
    try {
      setIsLoadingMonedas(true);
      const resultAction = await dispatch(
        monedasActions.getMonedaById({
          token,
          id,
        })
      );
      if (monedasActions.getMonedaById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const restrictionConcept =
        monedasActions.getMonedaById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;
      setCurrentMonedas(restrictionConcept?.moneda || null);
    } catch (error: any) {
      console.error("Error al obtener Monedas:", error);
    } finally {
      setIsLoadingMonedas(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { monedaSatId, descripcion, paisId, tipoCambio, userProvidedId, ...restBody } =
          data;

        body = {
          ...restBody,
          monedaSatId: monedaSatId?.trim(),
          descripcion: descripcion?.trim(),
          paisId: paisId?.trim(),
          tipoCambio: tipoCambio,
        };

        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = userProvidedId?.trim();
        }

        if (mode === "new" && keyConfig?.tienePrefijo) {
          if (keyConfig.tipoPrefijo === "Fijo") {
            body.userProvidedPrefix = keyConfig.prefijo;
          } else if (keyConfig.tipoPrefijo === "Variable") {
            body.userProvidedPrefix = data.userProvidedPrefix?.trim();
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
    <MonedasContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentMonedas,
        isLoadingMonedas,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </MonedasContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useMonedasForm = () => {
  const context = useContext(MonedasContext);
  if (!context) {
    throw new Error(
      "useMonedasContext must be used within a MonedasProvider"
    );
  }
  return context;
};
