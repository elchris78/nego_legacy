"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
  use,
} from "react";
import { Option } from "@/ui/multiselect";
import { AppDispatch, RootState } from "@/store";
import { useForm, UseFormReturn } from "react-hook-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getUser, getRoles } from "../../services/usersActions";

import Cookies from "js-cookie";
import { setCurrentCompanies, setCurrentPermissionsStore, setUpdatedPermissions } from "../../services/usersSlice";
import { setCurrentTemplate } from "../../services/usersSlice";
import { setUser } from "../../services/usersSlice";
import { toast } from "react-toastify";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";

// General data form types
interface GeneralDataFormValues {
  userID?: string;
  creationDate?: string;
  isActive: string;
  fullName: string;
  userName: string;
  email: string;
  userType: string;
  companies: Option[];
  password: string;
  confirmPassword: string;
}

interface UserClaims {
  permissionType?: string;
  roleTemplateId?: string;
  individualClaims?: IndividualClaims[];
}

// Permissions form types
interface PermissionsFormValues {
  permissionsField: string;
}
type IndividualClaims = {
  claimType: string;
  claimValue: string;
};
// Tipo de los claims
type Claim = {
  claimType: string;
  claimValue: string[];
};

// Definir el tipo de valor del contexto
interface FormContextType {
  generalDataForm: UseFormReturn<GeneralDataFormValues>;
  permissionsForm: UseFormReturn<PermissionsFormValues>;
  handleSubmitForms: () => Promise<any>;
  handleAssignClaims: () => Promise<any>;
  removeSelectedTemplate: (templateId: string) => void;
  currentUser: any | null;
  isLoadingUser: boolean;
  companiesWithClaims: any[];
  setCompaniesWithClaims: Dispatch<SetStateAction<any[]>>;
  permissionsError: string | null;
  claims: UserClaims;
  setClaims: Dispatch<SetStateAction<UserClaims>>;
  selectedCompanies: number[];
  setSelectedCompanies: Dispatch<SetStateAction<number[]>>;
  selectedCompany: number | null;
  setSelectedCompany: Dispatch<SetStateAction<number | null>>;
  isFormIncomplete: boolean;
  selectedTemplates: string[];
  setSelectedTemplates: Dispatch<SetStateAction<string[]>>;
  getCurrentUser: () => void;
  isPermissionsFormIncomplete: boolean | undefined
}

// Context creation
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider
export const UserFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // const token = useSelector((state: RootState) => state.auth.token)!;
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [claims, setClaims] = useState<UserClaims>({});
  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");
  const generalDataForm = useForm<GeneralDataFormValues>();
  const permissionsForm = useForm<PermissionsFormValues>();

  const [companiesWithClaims, setCompaniesWithClaims] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const { selectedTabCompanyId, selectedTabClaims } = useSelector((state: RootState) => state.claims);
  useEffect(() => {
    if (!mode && !id) return;
    if (mode === "edit" || mode === "view" || mode === "editw") getCurrentUser();
  }, [mode, id]);


  const getCurrentUser = async () => {
      try {
        setIsLoadingUser(true);
        const user = await getUser({ token, id });
        setCurrentUser(user);
        // claims
        setClaims(() => {
          if (user?.roleTemplateId) {
            return {
              permissionType: "rol",
              roleTemplateId: user?.companies?.roleTemplateId,
            };
          } else {
            dispatch(setCurrentPermissionsStore(user?.user?.companies));
            console.log("🚀 ~ getCurrentUser ~ user:", user?.user?.companies
            );
            return { permissionType: "custom-profile", individualClaims: user?.companies?.claims };
          }
        });
        
      } catch (error: any) {
        console.log("🚀 ~ getCurrentUser ~ error:", error);
        router.push(
          "/configuracion/configuracion-sistemas/control-usuarios/usuarios"
        );
        // toast(
        //   <ToastErrorMsg
        //     description={
        //       error?.message ?? "Ocurrió un error al obtener el usuario"
        //     }
        //   />
        // );
      } finally {
        setIsLoadingUser(false);
      }
    };
  
  // Handle form function
  const handleSubmitForms = async () => {
    let GDhasErrors = false;
    let CLhasErrores = false;
    let generalData: any;
  
    // Validar y manejar el generalDataForm
    await generalDataForm.handleSubmit(
      (data) => {
        const {
          fullName,
          userName,
          password,
          confirmPassword,
          email,
          companies, // Extraer companies
          ...dataRest
        } = data;
        generalData = {
          ...dataRest,
          fullName: fullName.trim(),
          userName: userName.trim(),
          password: password.trim(),
          confirmPassword: confirmPassword.trim(),
          email: email.trim(),
          companies: companies.map((company: any) => ({ id: Number(company.value) })) // Transformar companies
        };
      },
      (errors) => {
        GDhasErrors = true;
        console.error("General Data Form Errors:", errors);
      }
    )();
  
    // Si no hay errores, proceder con la lógica adicional
    if (!GDhasErrors && !CLhasErrores) {
      const { companies, isActive, userType, ...generalDataRest } = generalData!;
      const body = {
        ...generalDataRest,
        isActive: isActive === "true" ? true : false,
        typeOfUser: userType,
        companies: companies, // Ya transformado con solo `id`
      };
      return body;
    } else {
      console.log("There were validation errors.");
    }
  };

  // ✅ Nueva función para asignar permisos

  const handleAssignClaims = async () => {
    const companyData: Record<string, any> = {
      id: selectedTabCompanyId,
      roleTemplateIds: selectedTemplates
    };
  
    if (!selectedTemplates?.length && claims?.individualClaims?.length) {
      companyData.individualClaims = claims.individualClaims;
    }
  
    const body: Record<string, any> = {
      userId: currentUser.user.userId,
      companies: [companyData]
    };
  
    console.log("🚀 Body enviado para asignar permisos:", JSON.stringify(body, null, 2));
    return body;
  };
  


  
  const removeSelectedTemplate = (templateId: string) => {
    setSelectedTemplates((prevTemplates) => prevTemplates.filter((template) => template !== templateId));
    console.log("🚀 Templates seleccionadas después de eliminar:", selectedTemplates);
  };
  
 
  
  const isPermissionsFormIncomplete = 
  claims?.individualClaims?.length === 0;

  
  const watchedFields = generalDataForm.watch();
  const isFormIncomplete =
    !watchedFields.fullName ||
    !watchedFields.userName ||
    !watchedFields.email ||
    (mode !== 'edit' && (!watchedFields.password || !watchedFields.confirmPassword)) ||  
    !watchedFields.companies?.length;
  
  return (
    <FormContext.Provider
      value={{
        generalDataForm,
        permissionsForm,
        handleSubmitForms,
        handleAssignClaims,
        currentUser,
        isLoadingUser,
        companiesWithClaims,
        setCompaniesWithClaims,
        permissionsError,
        claims,
        setClaims,
        selectedCompany,
        setSelectedCompany,
        selectedCompanies,
        setSelectedCompanies,
        isFormIncomplete,
        selectedTemplates,
        isPermissionsFormIncomplete,
        setSelectedTemplates, // ✅ Agregamos la función para modificarlo
        removeSelectedTemplate,
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
    throw new Error("useForms must be used inside FormProvider");
  }
  return context;
};
