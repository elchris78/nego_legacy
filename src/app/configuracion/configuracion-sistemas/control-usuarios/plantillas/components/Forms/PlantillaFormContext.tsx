"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchGetPlantilla } from "../../services/plantillasActions";
import { Option } from "@/ui/multiselect";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { setCurrentPermissionsStore } from "../../services/plantillasCompanySlice";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";

// General data form types
interface GeneralDataFormValues {
  isActive: string;
  name: string;
  description: string;
  companies: Option[];
}

type claim = {
  claimType: string;
  claimValue: string;
};

// Definir el tipo de valor del contexto
interface FormContextType {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  handleSubmitForms: () => Promise<any>;
  currentPlantilla: any | null;
  isLoadingPlantilla: boolean;
  claims: claim[];
  setClaims: Dispatch<SetStateAction<claim[]>>;
  permissionsError: string | null;
  isFormIncomplete: boolean;
}

// Context creation
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider
export const PlantillaFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<GeneralDataFormValues>();
  const [claims, setClaims] = useState<claim[]>([]);

  const [currentPlantilla, setCurrentPlantilla] = useState([]);
  const [isLoadingPlantilla, setIsLoadingPlantilla] = useState(false);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);

  useEffect(() => {
    if (!mode && !id) return;
    if (mode === "edit" || mode === "view") getCurrentPlantilla();
  }, [mode, id]);

  // const getCurrentPlantilla = async () => {
  //   try {
  //     setIsLoadingPlantilla(true);
  //     const plantilla = await fetchGetPlantilla({ token, id });
  //     setCurrentPlantilla(plantilla);
  //     setClaims(plantilla?.claims);
  //     dispatch(setCurrentPermissionsStore(plantilla?.claims));
  //   } catch (error: any) {
  //     console.log("🚀 ~ getCurrentPlantilla ~ error:", error);
  //     router.push(
  //       "/configuracion/configuracion-sistemas/control-usuarios/plantillas"
  //     );
  //     toast(
  //       <ToastErrorMsg
  //         description={
  //           error?.message ?? "Ocurrió un error al obtener la plantilla"
  //         }
  //       />
  //     );
  //   } finally {
  //     setIsLoadingPlantilla(false);
  //   }
  // };

    const getCurrentPlantilla = async () => {
      try {
        setIsLoadingPlantilla(true);
        const plantilla = await fetchGetPlantilla({ token, id });
    
        if (Array.isArray(plantilla.claims)) {
          setCurrentPlantilla(plantilla);
          setClaims(plantilla.claims); // Aseguramos que se almacenen los claims en el contexto
          dispatch(setCurrentPermissionsStore(plantilla.claims));
        } else {
          console.error("Error: claims no es un array:", plantilla.claims);
          setClaims([]); // Si hay error, aseguramos que claims no sea undefined
        }
      } catch (error: any) {
        console.error("🚀 ~ getCurrentPlantilla ~ error:", error);
        router.push("/admin/plantillas");
        toast(
          <ToastErrorMsg
            description={error?.message ?? "Ocurrió un error al obtener la plantilla"}
          />
        );
      } finally {
        setIsLoadingPlantilla(false);
      }
    };

  // Handle form function
  // const handleSubmitForms = async () => {
  //   let GDhasErrors = false;
  //   let CLhasErrores = false;
  //   let generalData: any;

  //   // Validate and handle the generalDataForm
  //   await generalDataForm.handleSubmit(
  //     (data) => {
  //       const { name, description, isActive, companies } = data;
  //       const companyIds = companies?.map((company) => company.value);

  //       generalData = {
  //         roleTemplateName: name.trim(),
  //         description: description.trim(),
  //         active: isActive === "true" ? true : false,
  //         companyIds,
  //       };
  //     },
  //     (errors) => {
  //       GDhasErrors = true;
  //       console.error("General Data Form Errors:", errors);
  //     }
  //   )();

  //   // Validate if any permission is selected
  //   if (claims?.length === 0) {
  //     setPermissionsError(
  //       "Por favor, seleccione las opciones de los permisos."
  //     );
  //     CLhasErrores = true;
  //   } else {
  //     setPermissionsError(null);
  //     CLhasErrores = false;
  //   }

  //   // If no errors, you can proceed with further logic
  //   if (!GDhasErrors && !CLhasErrores) {
  //     const body = {
  //       ...generalData,
  //       ...claims,
  //     };

  //     return body;
  //   } else {
  //     console.log("There were validation errors.");
  //   }
  // };

  const handleSubmitForms = async () => {
    let GDhasErrors = false;
    let CLhasErrores = false;
    let generalData: any;
  
    await generalDataForm.handleSubmit(
      (data) => {
        const { name, description, isActive, companies } = data;
        const companyIds = companies?.map((company) => company.value);
  
        generalData = {
          roleTemplateName: name.trim(),
          description: description.trim(),
          active: isActive === "true",
          companyIds,
        };
      },
      (errors) => {
        GDhasErrors = true;
        console.error("General Data Form Errors:", errors);
      }
    )();
  
    if (!claims || claims.length === 0) {
      setPermissionsError("Por favor, seleccione al menos un permiso.");
      CLhasErrores = true;
    } else {
      setPermissionsError(null);
    }
  
    if (!GDhasErrors && !CLhasErrores) {
      const body = {
        ...generalData,
        claims, // Ahora los claims seleccionados se envían correctamente
      };
  
      console.log("✅ Datos listos para enviar al backend:", JSON.stringify(body, null, 2));
  
      return body;
    } else {
      console.log("❌ Errores en el formulario.");
    }
  };
 
  const watchedFields = generalDataForm.watch();
  const isFormIncomplete =
  !watchedFields.name ||
  claims.length === 0;

  return (
    <FormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        currentPlantilla,
        isLoadingPlantilla,
        claims,
        setClaims,
        permissionsError,
        isFormIncomplete,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Hook to access the context
export const usePlantillaForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("usePlantillaForm must be used inside FormProvider");
  }
  return context;
};
