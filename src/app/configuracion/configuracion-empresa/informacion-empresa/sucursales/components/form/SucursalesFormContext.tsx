"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";
import { sucursalActions } from "../../services/sucursalesSlice";
import { Sucursal } from "../../services/sucursalesTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

// Formularios individuales
import {
  InformacionGeneralSucursalesForm,
  DomicilioFiscalSucursalesForm,
  DomicilioParticularSucursalesForm,
} from "../../services/sucursalesFormsTypes"; // Asegúrate de que existan

interface SucursalContext {
  infoGeneralForm: UseFormReturn<InformacionGeneralSucursalesForm>;
  domicilioFiscalForm: UseFormReturn<DomicilioFiscalSucursalesForm>;
  domicilioParticularForm: UseFormReturn<DomicilioParticularSucursalesForm>;
  handleSubmitForms: () => Promise<any>;
  currentSucursal: Sucursal | null;
  isLoadingSucursal: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

const SucursalesContext = createContext<SucursalContext | undefined>(undefined);

export const SucursalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();

  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Sucursales");

  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentSucursal, setCurrentSucursal] = useState<Sucursal | null>(null);
  const [isLoadingSucursal, setIsLoadingSucursal] = useState(false);

  const infoGeneralForm = useForm<InformacionGeneralSucursalesForm>({ mode: "all" });
  const domicilioFiscalForm = useForm<DomicilioFiscalSucursalesForm>({ mode: "all" });
  const domicilioParticularForm = useForm<DomicilioParticularSucursalesForm>({ mode: "all" });

  const getCurrentSucursal = async () => {
    try {
      setIsLoadingSucursal(true);
      const resultAction = await dispatch(
        sucursalActions.getSucursalById({ token, id: id! })
      );
      if (sucursalActions.getSucursalById.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      const sucursal =
        sucursalActions.getSucursalById.fulfilled.match(resultAction)
          ? resultAction.payload?.sucursal
          : null;
      setCurrentSucursal(sucursal || null);
    } catch (error) {
      console.error("Error al obtener la sucursal:", error);
    } finally {
      setIsLoadingSucursal(false);
    }
  };

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      getCurrentSucursal();
    }
    if (mode === "new") {
      infoGeneralForm.setValue("estatus", "Activo"); // ejemplo
    }
  }, [mode, id]);

  const handleSubmitForms = async () => {
    const [infoValid, fiscalValid, particularValid] = await Promise.all([
      infoGeneralForm.trigger(),
      domicilioFiscalForm.trigger(),
      domicilioParticularForm.trigger(),
    ]);

    const isValid = infoValid && fiscalValid && particularValid;

    if (!isValid) {
      const errors = {
        infoGeneral: infoGeneralForm.formState.errors,
        domicilioFiscal: domicilioFiscalForm.formState.errors,
        domicilioParticular: domicilioParticularForm.formState.errors,
      };
      return { isValid: false, errors };
    }

    const values = {
      infoGeneral: infoGeneralForm.getValues(),
      domicilioFiscal: domicilioFiscalForm.getValues(),
      domicilioParticular: domicilioParticularForm.getValues(),
    };

    return { isValid: true, values };
  };

  const isFormComplete =
    infoGeneralForm.formState.isValid &&
    domicilioFiscalForm.formState.isValid;

  if (isKeyConfigLoading) {
    return <Loading />;
  }

  return (
    <SucursalesContext.Provider
      value={{
        infoGeneralForm,
        domicilioFiscalForm,
        domicilioParticularForm,
        handleSubmitForms,
        currentSucursal,
        isLoadingSucursal,
        isFormComplete,
        keyConfig,
      }}
    >
      {children}
    </SucursalesContext.Provider>
  );
};

export const useSucursalForm = () => {
  const context = useContext(SucursalesContext);
  if (!context) {
    throw new Error("useSucursalForm must be used within a SucursalProvider");
  }
  return context;
};
