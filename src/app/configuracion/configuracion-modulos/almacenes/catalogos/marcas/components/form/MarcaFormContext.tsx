"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { AppDispatch } from "@/lib/store/store";

import { getMarcasById } from "../../services/MarcaAction";
import { Marcas } from "../../services/MarcasTypes";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading";

interface GeneralDataFormValues {
  claveMarca: string;
  prefix?: string;
  estatus: string;
  fabricante: string;
  nombre: string;
  marca: string;
  logo: File | string;
  fechaVigencia: string;
}

interface MarcaFormContext {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentMarca: Marcas | null;
  isLoadingMarca: boolean;
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
const MarcaFormContext = createContext<MarcaFormContext | undefined>(undefined);

// Proveedor del contexto
export const MarcaFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Marcas"); // Hook para validar la configuración de claves

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const [currentMarca, setCurrentMarca] = useState<Marcas | null>(null);
  const [isLoadingMarca, setIsLoadingMarca] = useState(false);

  const generalDataForm = useForm<GeneralDataFormValues>({
    mode: "all",
  });

  useEffect(() => {
    if (!mode || !id) return;

    if (mode === "edit" || mode === "view") {
      getCurrentMarca(id);
    }
  }, [mode, id]);

  const getCurrentMarca = async (MarcaId: string) => {
    setIsLoadingMarca(true);
    try {
      const response = await getMarcasById({
        token,
        id: MarcaId,
      });

      if (response && response.success) {
        setCurrentMarca(response.marca);
        console.log("Departamento obtenido:", response.marca);
      } else {
        console.error("Error: Departamento no encontrado o éxito false.");
      }
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Error al consultar la clasificación de clientes.",
        icon: "error",
        confirmButtonText: "Aceptar",
        customClass: customClassesError,
      }).then(() => {
        router.push(
          "/configuracion/configuracion-modulos/almacenes/catalogos/marcas"
        );
      });
    } finally {
      setIsLoadingMarca(false);
    }
  };

  const handleSubmitForms = async () => {
    let hasErrors = false;
    let formData: any = {};

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveMarca,
          marca,
          fechaVigencia,
          fabricante,
          logo,
          estatus,
          prefix,
        } = data;

        formData = {
          Nombre: marca?.trim() ?? "",
          Fabricante: fabricante,
          FechaVigencia: fechaVigencia ?? "",
          Estatus: estatus === "true" ? "true" : "false",
          LogoUrl: logo || "",
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          formData.UserProvidedId = claveMarca?.trim() ?? "";
        }

        // Si el modo es nuevo y el prefijo es Fijo, asignar el prefijo fijo de la configuración
        // Si el modo es nuevo y el prefijo es Variable, asignar el prefijo del campo
        if (mode === "new" && keyConfig?.tienePrefijo) {
          if (keyConfig.tipoPrefijo === "Fijo") {
            formData.userProvidedPrefix = keyConfig.prefijo;
          } else if (keyConfig.tipoPrefijo === "Variable") {
            formData.userProvidedPrefix = prefix?.trim();
          }
        }
      },
      (errors) => {
        hasErrors = true;
        console.error("Form errors:", errors);
      }
    )();

    if (!hasErrors) {
      return formData;
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
    <MarcaFormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        isFormComplete: generalDataForm.formState.isValid,
        currentMarca: currentMarca,
        isLoadingMarca: isLoadingMarca,
        keyConfig,
      }}
    >
      {children}
    </MarcaFormContext.Provider>
  );
};

// Hook para usar el contexto
export const useMarcaForm = () => {
  const context = useContext(MarcaFormContext);
  if (!context) {
    throw new Error(
      "useMarcaForm must be used within a PresentacionesFormProvider"
    );
  }
  return context;
};
