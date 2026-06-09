 "use client";
 
 import { createContext, useContext, useEffect, useState } from "react";
 
 import { useDispatch } from "react-redux";
 import { useForm, UseFormReturn } from "react-hook-form";
 import { useRouter, useSearchParams } from "next/navigation";
 import Cookies from "js-cookie";
 
 import { AppDispatch } from "@/lib/store/store";
 
 import { getCategoriesById } from "../../services/categoriesAction";
import { Categories } from "../../services/categoriesTypes"; 
import { GetCatalogoClaves } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationActions";
import { GetCatalogoClave } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/services/keyConfigurationTypes";
import Swal from "sweetalert2";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import Loading from "@/components/ui/Modals/loading";

 interface GeneralDataFormValues {
  estatus: string;
  categoria: string;
  id: string;
  userProvidedId?: string;
  userProvidedPrefix?: string;
  parentCategoriaId?: string;
 }
 
 interface CategoriesFormContext {
   generalDataForm: UseFormReturn<GeneralDataFormValues>;
   handleSubmitForms: () => Promise<any>;
   currentCategories: Categories | null;
   isLoadingCategories: boolean;
   isFormComplete: boolean;
   keyConfig: GetCatalogoClave | null;
 }
 
 // Crear el contexto
 const CategoriesFormContext = createContext<CategoriesFormContext | undefined>(undefined);
 
 // Proveedor del contexto
 export const CategoriesFormProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
 }) => {
   const dispatch = useDispatch<AppDispatch>();
   const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
   const router = useRouter();
   const searchParams = useSearchParams();
   const { keyConfig, isLoading: isKeyConfigLoading } = useKeyConfigValidation("CategoriasProductos"); // Hook para validar la configuración de claves
   // Obtener mode e id de los parámetros de consulta
   const mode = searchParams.get("mode");
   const id = searchParams.get("id");
 
   const [currentCategories, setCurrentCategories] = useState<Categories | null>(null);
   const [isLoadingCategories, setIsLoadingCategories] = useState(false);
   const generalDataForm = useForm<GeneralDataFormValues>({
     mode: "all",
   });
 
  useEffect(() => {
    if ((mode === "edit" || mode === "view" || mode === "newsubcat" || mode === "viewsubcat" || mode === "editsubcat") && id) {
      getCurrentCategories();
    }
  }, [mode, id]);
 
   const getCurrentCategories = async () => {
     setIsLoadingCategories(true);
     try {
       const response = await getCategoriesById({
         token,
         id: id
       });
   
       if (response && response.success) {
         setCurrentCategories(response.categoria);
        // console.log("Departamento obtenido:", response.categoria);
       } else {
         console.error("Error: Departamento no encontrado o éxito false.");
       }
     } catch (error) {
       console.error("Error al obtener el departamento:", error);
     } finally {
       setIsLoadingCategories(false);
     }
   };
   

   const handleSubmitForms = async () => {
  let hasErrors = false;
  let body: any = {};

  await generalDataForm.handleSubmit(
    (data) => {
      const {
        categoria,
        userProvidedId,
        userProvidedPrefix,
        parentCategoriaId,
        ...restBody
      } = data;

      body = {
        ...restBody,
        nombre: categoria.trim(),
        estatus: restBody.estatus === 'true',
      };

      // Clave y prefijo
      if (
        (mode === "new" || mode === "newsubcat") &&
        (keyConfig?.tipoClave === "Numérico" || keyConfig?.tipoClave === "Alfanumérico")
      ) {
        body.userProvidedId = userProvidedId?.trim();
      }

      if ((mode === "new" || mode === "newsubcat") && keyConfig?.tienePrefijo) {
        if (keyConfig.tipoPrefijo === "Fijo") {
          body.userProvidedPrefix = keyConfig.prefijo;
        } else if (keyConfig.tipoPrefijo === "Variable") {
          body.userProvidedPrefix = userProvidedPrefix?.trim();
        }
      }

      // Categoría padre en modo newsubcat
      if (mode === "newsubcat") {
        body.parentCategoriaId = parentCategoriaId;
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
     <CategoriesFormContext.Provider
       value={{
         generalDataForm,
         handleSubmitForms,
         isFormComplete: generalDataForm.formState.isValid,
         currentCategories: currentCategories,
         isLoadingCategories: isLoadingCategories,
         keyConfig,
       }}
     >
       {children}
     </CategoriesFormContext.Provider>
   );
 };
 
 // Hook para usar el contexto
 export const useCategoriesForm = () => {
   const context = useContext(CategoriesFormContext);
   if (!context) {
     throw new Error("useCategoriesForm must be used within a CategoriesFormProvider");
   }
   return context;
 };
 