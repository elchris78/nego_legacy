"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch, RootState } from "@/lib/store/store";

import type { AttributeValue } from "../../services/attributesValueTypes";
import { getAttributeById } from "../../services/AttributeValueSlice";
import showAlert from "@/lib/utils/alerts";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";


interface GeneralDataFormValues {
  claveValor: string; // Opcional, si se quiere asignar un ID específico
  prefix?: string; // Opcional, si se quiere asignar un prefijo específico
  estatus: string;
  nombre: string;
  valores?: string;
}

interface AttributeContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentAttribute: AttributeValue | null;
  isLoadingAttribute: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Crear el contexto
const AttributeContext = createContext<
  AttributeContext | undefined
>(undefined);

// Proveedor del contexto
export const AttributesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";

  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("ValoresAtributo"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = (searchParams.get("id"));

  // Redux
  const entity = useSelector((state: RootState) => state.values.attributeValue);
  const { atributoId } = useParams() as { atributoId: string };

  const loading = useSelector((state: RootState) => state.values.loading);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let body: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveValor,
          prefix,
          nombre,
          valores,
          ...restBody } = data;
        body = {
          ...restBody,
          nombre: nombre.trim(),
          // valores: (valores ?? "").trim(),
        };
        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          body.userProvidedId = claveValor?.trim();
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
      (error) => {
        hasErrors = true;
      }
    )();

    if (hasErrors) return;

    if (mode === "new") {
      // Crear nuevo cliente
    } else if (mode === "edit") {
      // Editar cliente existente
    }

    return body;
  };

  // UseEffects 
  useEffect(() => {
    const fetchAttribute = async () => {
      if (mode !== "new" && id) {
        try {
          await dispatch(getAttributeById({ token, atributoId, request: { id } }));
        } catch (error) {
          showAlert({success: false, message: `Ocurrió un error al recuperar la información. ${error}`})
        }
      }
    };

    fetchAttribute();
  }, [mode, id, token, dispatch]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <AttributeContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentAttribute: entity,
        isLoadingAttribute: loading,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </AttributeContext.Provider>
  );
};

// Hook para usar el contexto
export const useAttributes = () => {
  const context = useContext(AttributeContext);
  if (!context) {
    throw new Error(
      "useAttributes debe ser usado dentro de un AttributesProvider"
    );
  }
  return context;
};
