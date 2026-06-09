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
import { fetchGetPlantillas } from "../../../plantillas/services/plantillasActions";
import { getUser } from "../../services/usersActions";
import { Option } from "@/components/ui/multiselect";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { CreateCompanyUserRequest } from "../../services/companyUsersTypes";
import { setCurrentPermissionsStore } from "@/app/admin/usuarios/services/usersSlice";

interface GeneralDataFormValues {
  userID?: string;
  creationDate?: string;
  isActive: string;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Tipo de los claims

interface UserClaims {
  permissionType?: string;
  roleTemplateId?: string;
  individualClaims?: IndividualClaims[];
}

type IndividualClaims = {
  claimType: string;
  claimValue: string;
};

// Definir el tipo de valor del contexto
interface FormContextType {
  generalDataForm: UseFormReturn<CreateCompanyUserRequest>;
  handleSubmitForms: () => Promise<any>;
  handleAssignClaims: () => Promise<any>;
  currentUser: any | null;
  isLoadingUser: boolean;
  rols: Option[];
  claims: UserClaims;
  setClaims: Dispatch<SetStateAction<UserClaims>>;
  permissionsError: string | null;
  isFormIncomplete: boolean;
  isPermissionsFormIncomplete: boolean | undefined;
  selectedTemplates: string[];
  getCurrentUser: () => void
  setSelectedTemplates: Dispatch<SetStateAction<string[]>>;
}

// Context creation
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider
export const UserFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Global
  const dispatch = useDispatch<AppDispatch>();
  const selectedGUIDs = useSelector((state: RootState) => state.usersCompany.selectedTemplatesGUID);
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const searchParams = useSearchParams();
  const router = useRouter();

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<CreateCompanyUserRequest>();  

  const [claims, setClaims] = useState<UserClaims>({});
  const [rols, setRols] = useState<Option[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  

  useEffect(() => {
    if (!mode && !id) return;
    if (mode === "edit" || mode === "view" || mode === "editw")
    console.log("📡 Llamando a getCurrentUser()");
    getCurrentUser();
    getRol();
  }, [mode, id]);

  const getRol = async () => {
    try {
      const { roleTemplates } = await fetchGetPlantillas({ token });
      const templatesFiltered = roleTemplates?.filter(
        (template: any) => template.active
      ); // Filtrar solo las plantillas activas
      const rolsMap = templatesFiltered?.map((value: any) => ({
        label: value.roleTemplateName,
        value: value.roleTemplateId,
      }));
      setRols(rolsMap);
      console.log("🚀 ~ getRol ~ rolsMap:", rolsMap);
      console.log ("🚀 ~ getRol ~ roleTemplates:", roleTemplates);
    } catch (error) {
      console.log("🚀 ~ getRol ~ error:", error);
    }
  };

  const getCurrentUser = async () => {
    try {
      setIsLoadingUser(true);
      const user = await getUser({ token, id });
      setCurrentUser(user);
      // claims
    console.log("Setting CLaims USERFORMCONTEXt"); // Verificar si están vacíos
      
      setClaims(() => {
        if (user?.roleTemplateId) {
          return {
            permissionType: "rol",
            roleTemplateId: user?.roleTemplateId,
          };
        } else {
          dispatch(setCurrentPermissionsStore(user?.claims));
          return { permissionType: "custom-profile", individualClaims: user?.claims };
        }
      });
      console.log("🚀 ~ getCurrentUser ~ user:", user);
    } catch (error: any) {
      console.log("🚀 ~ getCurrentUser ~ error:", error);
      router.push(
        "/configuracion/configuracion-sistemas/control-usuarios/usuarios"
      );
    } finally {
      setIsLoadingUser(false);
    }
  };

  // Handle form function
  const handleSubmitForms = async () => {
    let GDhasErrors = false;
    let CLhasErrores = false;
    let generalData: any;

    // Validate and handle the generalDataForm
    await generalDataForm.handleSubmit(
      (data) => {
        const {
          fullName,
          userName,
          password,
          confirmPassword,
          email,
          ...dataRest
        } = data;

        generalData = {
          ...dataRest,
          fullName: fullName.trim(),
          userName: userName.trim(),
          password: password,
          confirmPassword: confirmPassword,
          email: email.trim(),
        };
        console.log("General Data Form:", generalData);
      },
      (errors) => {
        GDhasErrors = true;
        console.error("General Data Form Errors:", errors);
      }
    )();
    
    // If no errors, you can proceed with further logic
    if (!GDhasErrors && !CLhasErrores) {
      const { isActive, ...generalDataRest } = generalData!;

      const body = {
        ...generalDataRest,
        isActive: isActive === "true" ? true : false,
        ...claims,
        userType: "Compartido",
      };
      return body;
    } else {
      console.log("There were validation errors.");
    }
  };

  // ✅ Nueva función para asignar permisos
  // const handleAssignClaims = async () => {
  //   if (!id) {
  //     console.error("❌ Error: No se encontró información del usuario.");
  //     return;
  //   }
  
  //   const body = {
  //     userId: currentUser.user.userId,
  //     companies: [
  //       {
  //         id: currentUser?.userId, // Usamos el ID de la empresa del usuario
  //         roleTemplateId: selectedTemplates[0], // Asigna el primer rol seleccionado
  //         individualClaims: claims.individualClaims ?? [],
  //       },
  //     ],
  //   };
  
  //   console.log("🚀 Body enviado para asignar permisos:", JSON.stringify(body, null, 2));
  //   return body;
  // };
  

  const handleAssignClaims = async () => {
    if (!id) {
      console.error("❌ Error: No se encontró el ID del usuario.");
      return;
    }
  
    const body: Record<string, any> = {
      userId: currentUser?.userId,
      roleTemplateIds: selectedTemplates
    };
    
    if (!selectedTemplates?.length && claims?.individualClaims?.length) {
      body.individualClaims = claims.individualClaims;
    }
  
    console.log("🚀 Body enviado para asignar permisos:", body);
    console.log("🚀 currentUser:", currentUser);
    return body;
  };
  

  const isPermissionsFormIncomplete = claims && claims.individualClaims && claims.individualClaims.length === 0;

  
  const watchedFields = generalDataForm.watch();
  const isFormIncomplete =
  !watchedFields.fullName ||
  !watchedFields.userName ||
  !watchedFields.email;

  return (
    <FormContext.Provider
      value={{
        generalDataForm,
        handleSubmitForms,
        handleAssignClaims,
        currentUser,
        isLoadingUser,
        rols,
        claims,
        setClaims,
        permissionsError,
        isFormIncomplete,
        selectedTemplates,
        setSelectedTemplates,
        isPermissionsFormIncomplete,
        getCurrentUser
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

// Hook to access the context
export const useUserForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useUserForm must be used inside FormProvider");
  }
  return context;
};
