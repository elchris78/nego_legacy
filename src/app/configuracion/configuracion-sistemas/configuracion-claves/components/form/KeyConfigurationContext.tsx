"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { keyConfigurationActions } from "../../services/keyConfigurationSlice";

import type { GetCatalogoClave } from "../../services/keyConfigurationTypes";
import { GetCatalogoClaves } from "../../services/keyConfigurationActions";

interface GeneralDataFormValues {
  modulo: string;
  catalogo: string;
  tipoClave: string;
  tienePrefijo: string;
  tipoPrefijo: string;
  prefijo: string;
  longitudMaxima: number
}

interface KeyConfigurationContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentKeyConfiguration: GetCatalogoClave | null;
  isLoadingKeyConfiguration: boolean;
  isFormComplete: boolean;
}

// Crear el contexto
const KeyConfigurationContext = createContext<KeyConfigurationContext | undefined>(
  undefined
);

// Proveedor del contexto
export const KeyConfigurationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentKeyConfiguration, setCurrentKeyConfiguration] = useState<GetCatalogoClave | null>(
    null
  );
  const [isLoadingKeyConfiguration, setIsLoadingKeyConfiguration] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentKeyConfiguration();
    }
  }, [mode, id]);

  const getCurrentKeyConfiguration = async () => {
    try {
      setIsLoadingKeyConfiguration(true);
      const result = await GetCatalogoClaves({
        token,
        params: { catalogo: id ?? undefined},
      });
      console.log(`que es esto ${id}`)
      setCurrentKeyConfiguration(result);
    } catch (error: any) {
      console.error("Error al obtener el concepto de devolución:", error);
    } finally {
      setIsLoadingKeyConfiguration(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { modulo, catalogo, tienePrefijo, longitudMaxima, ...restBody } = data;

        body = {
          ...restBody,
          modulo: modulo?.trim(),
          catalogo: catalogo?.trim(),
          tienePrefijo: tienePrefijo === "true",
          longitudMaxima: Number(longitudMaxima)
        };
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

  return (
    <KeyConfigurationContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentKeyConfiguration,
        isLoadingKeyConfiguration,
        isFormComplete: generalDataForm.formState.isValid,
      }}
    >
      {children}
    </KeyConfigurationContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useKeyConfigurationForm = () => {
  const context = useContext(KeyConfigurationContext);
  if (!context) {
    throw new Error(
      "useKeyConfigurationContext must be used within a KeyConfigurationProvider"
    );
  }
  return context;
};
