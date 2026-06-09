import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import MultipleSelector, { Option } from "@/ui/multiselect";
import { fetchGetRolesByCompanyId } from "../../services/usersActions";
import { fetchGetRoleTemplateId } from "../../services/usersActions";
import Cookies from "js-cookie";
import { ToastErrorMsg } from "@/components/ui/Toast/ToastErrorMsg";
import { toast } from "react-toastify";
import { useDispatch, useSelector} from "react-redux";
import { setCurrentPermissionsStore } from "../../services/usersSlice";
import { RootState } from "@/lib/store/store";

interface Claim {
  claimType: string;
  claimValue: string;
}

interface Form {
  company: Option;
  plantillas: Option[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectClaims: (claims: Claim[]) => void;
  companyId: string;
}

export const SelectPlantillaModal = ({ onClose, isOpen, onSelectClaims, companyId }: Props) => {
  const [plantillaValue, setPlantillaValue] = useState<Option[]>([]);
  const [plantillaOptions, setPlantillaOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialPlantillaValue, setInitialPlantillaValue] = useState<Option[]>([]);
  const token = Cookies.get("auth-token");
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [rolesByCompany, setRolesByCompany] = useState<Option[] | null>(null);
  const { currentPermissions, currentCompanies, currentTemplate } = useSelector((state: RootState) => state.users);

  const form = useForm<Form>();
  const {
    register,
    formState: { errors },
  } = form;

  const { ref: plantillaRef, ...plantillaInputProps } = register("plantillas", {
    required: "La plantilla de usuario es requerida.",
  });

  useEffect(() => {
    if (!companyId && !token) return;
    getRolesByCompany();
  }, [companyId]);

  const getRolesByCompany = async () => {
    try {
      setIsLoadingRoles(true);
      const data = await fetchGetRolesByCompanyId({
        token,
        id: companyId?.valueOf(),
      });
      const rolsMap = data.roles.map((value: any) => ({
        label: value.roleTemplateName,
        value: value.roleTemplateId,
      }));
      setRolesByCompany(rolsMap);
    } catch (error) {
      console.log("🚀 ~ getRolesByCompany ~ error:", error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Guardar el valor inicial al abrir el modal
      setInitialPlantillaValue([...plantillaValue]);
    }
  }, [isOpen]);

  const handleCancel = () => {
    // Restaurar las selecciones iniciales al cancelar
    setPlantillaValue([...initialPlantillaValue]);
    onClose();
  };

  // const handleApply = () => {
  //   // Aplicar las selecciones actuales
  //   handlePlantillaChange(plantillaValue);
  //   onClose();
  // };

  // Obtener roles de la empresa específica cuando se abre el modal
  useEffect(() => {
    if (isOpen && companyId) {
      const fetchPlantillas = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetchGetRolesByCompanyId({ token, id: companyId });
          const templates = response.roles || [];
          // Mapear las plantillas a formato compatible con MultipleSelector
          const options = templates.map((template: any) => ({
            label: template.roleTemplateName,
            value: template.roleTemplateId,
          }));
          setPlantillaOptions(options);
          setTemplates(templates);
        } catch (err: any) {
          setError(err.message || "Error al cargar las plantillas.");
        } finally {
          setLoading(false);
        }
      };

      fetchPlantillas();
    }
  }, [isOpen, companyId]);

  if (!isOpen) return null;

  // Manejar el cambio de selección
  // const handlePlantillaChange = (selected: Option[]) => {
  //   setPlantillaValue(selected);
  
  //   // Iterar sobre las plantillas seleccionadas
  //   Promise.all(
  //     selected.map((option) =>
  //       fetchGetRoleTemplateId({ token, roleTemplateId: option.value })
  //         .then((response) => {
  //           return response.claims.map((claim: any) => ({
  //             claimType: claim.claimType,
  //             claimValue: claim.claimValue,
  //           }));
  //         })
  //         .catch((error) => {
  //           toast.error(error.message || "Error al obtener los permisos de la plantilla.");
  //           return []; // En caso de error, devolver un arreglo vacío
  //         })
  //     )
  //   )
  //     .then((claimsArray) => {
  //       // Combinar todos los claims obtenidos
  //       const allClaims = claimsArray.flat();
  //       onSelectClaims(allClaims); // Enviar todos los claims al callback
  //       console.log("🚀 ~ handlePlantillaChange ~ allClaims", allClaims);
  //     })
  //     .catch((error) => {
  //       console.error("Error al procesar las plantillas seleccionadas:", error);
  //     });
  // };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl relative">
        <div className="bg-[#3c98cb] text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-semibold">Seleccionar plantilla de perfil</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition duration-150"
            aria-label="Cerrar modal"
          >
            <XCircle size={30} />
          </button>
        </div>
        <div className="p-6 pb-4">
          {loading ? (
            <p className="text-center text-lg">Cargando plantillas...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="mb-4">
              <label>Plantilla(s) de perfil</label>
              <MultipleSelector
                value={plantillaValue}
                onChange={setPlantillaValue}
                defaultOptions={plantillaOptions}
                ref={plantillaRef}
                inputProps={plantillaInputProps}
                error={!!errors.plantillas}
                placeholder="Selecciona una opción"
                badgeClassName="text-white bg-[#3C98CB] hover:bg-[#69aacc] rounded-full"
                hidePlaceholderWhenSelected
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    No hay resultados
                  </p>
                }
              />
              {errors.plantillas && (
                <span className="text-[#CF5459] text-xs">
                  {errors.plantillas?.message}
                </span>
              )}
            </div>
          )}
          <div className="flex justify-start space-x-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-[#3c98cb] text-[#3c98cb] rounded-md hover:bg-[#3c98b8] hover:text-white transition duration-150"
            >
              Cancelar
            </button>
            <button
              // onClick={handleApply}
              className="px-4 py-2 bg-[#3c98cb] text-white rounded-md hover:bg-[#3188b8] transition duration-150"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
