"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { sellersActions } from "../../services/sellersSlice";

import type { Sellers} from "../../services/sellersTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";


interface GeneralDataFormValues {
  userProvidedId: string;
  userProvidedPrefix: string;
  tipoVendedorId: string;
  colaboradorId: string;
  supervisorId: string;
  zonaId: string;
  subzonaId: string;
  tipoComision: string;
  isActive: string;
  porcentajeComisionGlobal: number;
}

interface SellersContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentSellers: Sellers | null;
  isLoadingSellers: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const SellersContext = createContext<SellersContext | undefined>(
  undefined
);

// Proveedor del contexto
export const SellersProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Vendedores"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentSellers, setCurrentSellers] =
    useState<Sellers | null>(null);
  const [isLoadingSellers, setIsLoadingSellers] = useState(false);
  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });
  const router = useRouter();
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentSellers();
    }
  }, [mode, id]);

  const getCurrentSellers = async () => {
    try {
      setIsLoadingSellers(true);
      const resultAction = await dispatch(
        sellersActions.getSellersById({
          token,
          id,
        })
      );
      if (sellersActions.getSellersById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const restrictionConcept =
        sellersActions.getSellersById.fulfilled.match(resultAction)
          ? resultAction.payload
          : null;
      setCurrentSellers(restrictionConcept?.vendedor || null);
    } catch (error: any) {
      console.error("Error al obtener el concepto de devolución:", error);
    } finally {
      setIsLoadingSellers(false);
    }
  };

  const handleSubmitForms = async () => {
  let hasErrors = false;
  let body: any = {};

  await generalDataForm.handleSubmit(
    (data) => {
      const {
        isActive,
        userProvidedId,
        tipoVendedorId,
        colaboradorId,
        supervisorId,
        zonaId,
        subzonaId,
        tipoComision,
        porcentajeComisionGlobal,
        ...restBody
      } = data;

      body = {
        ...restBody,
        estatus: isActive === "true",
        tipoVendedorId: tipoVendedorId?.trim(),
        colaboradorId: colaboradorId?.trim(),
        supervisorId: supervisorId?.trim(),
        zonaId: zonaId?.trim(),
        subzonaId: subzonaId?.trim(),
        tipoComision: tipoComision?.trim(),
        porcentajeComisionGlobal: Number(porcentajeComisionGlobal),
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

const watchedFields = generalDataForm.watch();

const isClaveRequired =
  mode === "new" &&
  (keyConfig?.tipoClave === "Numérico" || keyConfig?.tipoClave === "Alfanumérico");

const isPrefijoRequired =
  mode === "new" && keyConfig?.tienePrefijo && keyConfig?.tipoPrefijo === "Variable";

const isFormComplete =
  (!isClaveRequired || !!watchedFields.userProvidedId) &&
  (!isPrefijoRequired || !!watchedFields.userProvidedPrefix) &&
  !!watchedFields.colaboradorId &&
  !!watchedFields.supervisorId &&
  !!watchedFields.tipoVendedorId &&
  !!watchedFields.zonaId &&
  (!!watchedFields.tipoComision || mode === "edit") &&
  !!watchedFields.isActive;


  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <SellersContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentSellers,
        isLoadingSellers,
        isFormComplete,
        keyConfig,
      }}
    >
      {children}
    </SellersContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useSellersForm = () => {
  const context = useContext(SellersContext);
  if (!context) {
    throw new Error(
      "useSellersTypesContext must be used within a SellersProvider"
    );
  }
  return context;
};
