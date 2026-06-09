"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";

import { getTypesWarehousesById } from "../../services/typesWarehousesAction";
import { TypesWarehouses } from "../../services/typesWarehousesTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Swal from "sweetalert2";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveTypesWarehouses: string;
  prefix?: string;
  estatus?: string;
  nombre: string;
  origen: string;
  requiereCliente?: string;
}

interface TypesWarehousesFormContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentTypesWarehouses: TypesWarehouses | null;
  isLoadingTypesWarehouses: boolean;
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
const TypesWarehousesFormContext = createContext<
  TypesWarehousesFormContext | undefined
>(undefined);

// Proveedor del contexto
export const EstatusProdFormProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading} = useKeyConfigValidation("TiposAlmacen"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentTypesWarehouses, setCurrentTypesWarehouses] = useState<TypesWarehouses | null>(
    null
  );
  const [isLoadingTypesWarehouses, setIsLoadingTypesWarehouses] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      
        getCurrentTypesWarehouses();
    }
  }, [mode, id]);

  const getCurrentTypesWarehouses = async () => {
    setIsLoadingTypesWarehouses(true);
    try {
      const response = await getTypesWarehousesById({
        token,
        id,
      });

      if (response && response.success) {
        setCurrentTypesWarehouses(response.tipoAlmacen);
        console.log("Departamento obtenido:", response.tipoAlmacen);
      } else {
        console.error("Error: Departamento no encontrado o éxito false.");
      }
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar el estatus de producto.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/tipos-almacenes"
        );
      });
    } finally {
      setIsLoadingTypesWarehouses(false);
    }
  };

  const handleSubmitForms = async () => {
  let hasErrors = false;
  let body: any = {};

  await generalDataForm.handleSubmit(
    (data) => {
      const {
        claveTypesWarehouses,
        prefix,
        requiereCliente,
        origen,
        nombre,
        estatus,
      } = data;

      // Si es modo "edit", solo enviar nombre y estatus
      if (mode === "edit") {
        body = {
          nombre: nombre.trim(),
          estatus: estatus === "true",
        };
        return;
      }

      // Para modo "new"
      body = {
        nombre: nombre.trim(),
        origen: "No reservado",
        estatus: estatus === "true",
        requiereCliente: requiereCliente === "true",
      };

      if (
        keyConfig?.tipoClave === "Numérico" ||
        keyConfig?.tipoClave === "Alfanumérico"
      ) {
        body.userProvidedId = claveTypesWarehouses?.trim();
      }

      if (keyConfig?.tienePrefijo) {
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
    console.error("Form has errors, not submitting:", generalDataForm.formState.errors);
    return undefined;
  }
};

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <TypesWarehousesFormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        currentTypesWarehouses,
        isLoadingTypesWarehouses,
        keyConfig,
      }}
    >
      {children}
    </TypesWarehousesFormContext.Provider>
  );
};

// Hook para usar el contexto
export const useTypesWarehousesForm = () => {
  const context = useContext(TypesWarehousesFormContext);
  if (!context) {
    throw new Error(
      "useTypesWarehousesForm must be used within a TypesWarehousesProvider"
    );
  }
  return context;
};
