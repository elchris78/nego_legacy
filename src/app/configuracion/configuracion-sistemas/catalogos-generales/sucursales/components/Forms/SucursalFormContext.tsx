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
import MenuIcon from '@mui/icons-material/Menu'; 
import { getBranchById } from "@/lib/services/branches/branchesSlice";
import { AppDispatch } from "@/lib/store/store";
import { useDispatch } from "react-redux";
import { GetBranchByIdResponse } from "@/lib/services/branches/branchesTypes";

interface GeneralDataFormValues {
  id: string;
  isActive: string;
  nombreSucursal: string;
  isEstatus: string;
  nombre: string;
  // imagen: FileList;
  codigoPostal: string;
  colonia: string;
  calle: string;
  noExterior: string;
  noInterior: string;
  localidad: string;
  municipio: string;
  estado: string;
  pais: string;
  telefono: string;
  responsable: string;
  nombreResponsable: string;
  horarioAtencion: string;
  correoContacto: string;
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
}

// Context creation
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider
export const PlantillaFormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener mode e id de los parámetros de consulta
  const mode = searchParams.get("mode");
  const id = searchParams.get("id");

  const generalDataForm = useForm<GeneralDataFormValues>();
  const [claims, setClaims] = useState<claim[]>([]);

  const [currentPlantilla, setCurrentPlantilla] =
      useState<GetBranchByIdResponse | null>(null);
  const [isLoadingPlantilla, setIsLoadingPlantilla] = useState(false);
  const [permissionsError, setPermissionsError] = useState<string | null>(null);
  const [isLoadingDepartamento, setIsLoadingDepartamento] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (!mode || !id) return;

    if (mode === "edit" || mode === "view") {
      // Convertimos id a número
      const departmentId = Number(id);
      if (!isNaN(departmentId)) {
        fetchDepartmentByIdData(departmentId);
      } else {
        console.error("ID no válido");
      }
    }
  }, [mode, id]);

  const fetchDepartmentByIdData = async (branchId: number) => {
      setIsLoadingDepartamento(true);
    
      try {
        const response: any = await dispatch(
          getBranchById({
            token,
            request: { branchId },
          })
        ).unwrap(); // Utilizamos `.unwrap()` para manejar directamente el resultado o error del thunk
    
        // Verificamos si la respuesta es exitosa
        if (response && response.success && response) {
          setCurrentPlantilla(response);
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

  // Handle form function
  const handleSubmitForms = async () => {
    let GDhasErrors = false;
    let CLhasErrores = false;
    let generalData: any;

    await generalDataForm.handleSubmit(
      (data) => {
        const { nombreSucursal, isActive, isEstatus, codigoPostal, colonia, calle, noExterior, noInterior, localidad, municipio, 
                estado, pais, telefono, responsable, nombreResponsable, horarioAtencion
        } = data;

        generalData = {
          sucursalName: nombreSucursal.trim(),
          active: isActive === "true" ? true : false,
          estatus:  isEstatus === "true" ? true : false,
          codigoPostal: codigoPostal.trim(),
          colonia: colonia.trim(),
          calle: calle.trim(),  
          noExterior: noExterior.trim(),  
          noInterior: noInterior.trim(),  
          localidad: localidad.trim(),  
          municipio: municipio.trim(),  
          estado: estado.trim(),  
          pais: pais.trim(),  
          telefono: telefono.trim(),  
          responsable: responsable.trim(),  
          nombreResponsable: nombreResponsable.trim(),  
          horarioAtencion: horarioAtencion.trim(),  
        };
      },
      (errors) => {
        GDhasErrors = true;
        console.error("General Data Form Errors:", errors);
      }
    )();

  };

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
