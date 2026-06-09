"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { sellersTypesActions } from "../../services/sellersTypesSlice";

import type { SellersType } from "../../services/sellersTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { GetCatalogoClaves } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationActions";
import Swal from "sweetalert2";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

const customClassesError = {
  container: "swal2-container",
  popup: "swal-popup-error",
  confirmButton: "swal-confirm-button",
  title: "swal-title",
  actions: "swal-actions",
};

interface GeneralDataFormValues {
  name: string;
  description: string;
  isActive: string;
  userProvidedId?: string;
  userProvidedPrefix?: string;
  id: any;
}

interface SellersTypesContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentSellersType: SellersType | null;
  isLoadingSellersType: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const SellersTypesContext = createContext<SellersTypesContext | undefined>(
  undefined
);

// Proveedor del contexto
export const SellersTypesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("TiposVendedor"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentSellersType, setCurrentSellersType] =
    useState<SellersType | null>(null);
  const [isLoadingSellersType, setIsLoadingSellersType] = useState(false);
  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });
  const router = useRouter();
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentSellersType();
    }
  }, [mode, id]);

  const getCurrentSellersType = async () => {
    try {
      setIsLoadingSellersType(true);
      const resultAction = await dispatch(
        sellersTypesActions.getSellersTypeById({
          token,
          id,
        })
      );
      if (sellersTypesActions.getSellersTypeById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const restrictionConcept =
        sellersTypesActions.getSellersTypeById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;
      setCurrentSellersType(restrictionConcept?.tipoVendedor || null);
    } catch (error: any) {
      console.error("Error al obtener el concepto de devolución:", error);
    } finally {
      setIsLoadingSellersType(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const { name, description, isActive, userProvidedId, ...restBody } =
          data;

        body = {
          ...restBody,
          nombre: name?.trim(),
          descripcion: description?.trim(),
          estatus: isActive === "true",
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
    <SellersTypesContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentSellersType,
        isLoadingSellersType,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </SellersTypesContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useSellersTypesForm = () => {
  const context = useContext(SellersTypesContext);
  if (!context) {
    throw new Error(
      "useSellersTypesContext must be used within a SellersTypesProvider"
    );
  }
  return context;
};
