"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { useDispatch } from "react-redux";
import { CreateDepartmentRequest } from "@/lib/services/departments/departmentsTypes";
import { getDepartmentById } from "@/lib/services/departments/departmentsSlice";
import { AppDispatch } from "@/lib/store/store";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Loading from "@/components/ui/Modals/loading";

// General data form types
interface GetDepartmentByIdResponse {
  isActive: string;
  name: string;
  responsible: string;
  area: string;
  areaId: string;
  description: string;
  departmentId: string;
  creationDate: string;
  responsibleId: string;
  status: boolean;
}

// Definir el tipo de valor del contexto
interface FormContextType {
  generalDataForm: UseFormReturn<CreateDepartmentRequest>;
  handleOnSubmit: () => Promise<any>;
  currentDepartamento: GetDepartmentByIdResponse | null;
  isLoadingDepartamento: boolean;
  isFormComplete: boolean;
  keyConfig: GetCatalogoClave | null;
}

// Context creation
const FormContext = createContext<FormContextType | undefined>(undefined);

export const DepartamentosFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch: AppDispatch = useDispatch();

  const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("Departamentos");

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<CreateDepartmentRequest>({
    mode: "all",
  });

  const [currentDepartamento, setCurrentDepartamento] =
    useState<GetDepartmentByIdResponse | null>(null);
  const [isLoadingDepartamento, setIsLoadingDepartamento] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      fetchDepartmentByIdData(id);
    }
  }, [mode, id]);

  const fetchDepartmentByIdData = async (departmentId: string) => {
    setIsLoadingDepartamento(true);

    try {
      const response: any = await dispatch(
        getDepartmentById({
          token,
          request: { departmentId },
        })
      ).unwrap(); // Utilizamos `.unwrap()` para manejar directamente el resultado o error del thunk

      // Verificamos si la respuesta es exitosa
      if (response && response.success && response) {
        setCurrentDepartamento(response);
        console.log("Departamento obtenido:", response);
      } else {
        console.error("Error: Departamento no encontrado o éxito false.");
      }
    } catch (error) {
      console.error("Error al obtener el departamento:", error);
    } finally {
      setIsLoadingDepartamento(false);
    }
  };

  const handleOnSubmit = async () => {
    let hasErrors = false;
    let generalData: any;

    await generalDataForm.handleSubmit(
      (data) => {
        const {
          claveDepartamento,
          prefix,
          isActive,
          name,
          description,
          area,
          ...rest
        } = data;

        generalData = {
          status: isActive === "true" ? true : false,
          name: name.trim(),
          area: area?.toString(),
          description: description,
          ...rest,
        };

        // Si el tipo de clave es numérico o alfanumérico, asignar la clave del campo
        if (
          mode === "new" &&
          (keyConfig?.tipoClave === "Numérico" ||
            keyConfig?.tipoClave === "Alfanumérico")
        ) {
          generalData.userProvidedId = claveDepartamento?.trim();
        }

        // Si el modo es nuevo y el prefijo es Fijo, asignar el prefijo fijo de la configuración
        // Si el modo es nuevo y el prefijo es Variable, asignar el prefijo del campo
        if (mode === "new" && keyConfig?.tienePrefijo) {
          if (keyConfig.tipoPrefijo === "Fijo") {
            generalData.userProvidedPrefix = keyConfig.prefijo;
          } else if (keyConfig.tipoPrefijo === "Variable") {
            generalData.userProvidedPrefix = data.prefix?.trim();
          }
        }
      },
      (errors) => {
        hasErrors = true;
        console.log("🚀 ~ handleOnSubmit ~ errors:", errors);
      }
    )();

    if (!hasErrors) {
      const body = {
        ...generalData,
      };
      return body;
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <FormContext.Provider
      value={{
        generalDataForm,
        handleOnSubmit,
        currentDepartamento,
        isLoadingDepartamento,
        isFormComplete: generalDataForm.formState.isValid,
        keyConfig,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Hook to access the context
export const useDepartamentoForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useDepartamentoForm must be used inside FormProvider");
  }
  return context;
};
