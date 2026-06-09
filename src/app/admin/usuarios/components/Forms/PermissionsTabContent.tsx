"use client";
import { Option } from "@/ui/multiselect";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/ui/label";
import { PermissionsForm } from "./PermissionsForm";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { useUserForm } from "./UserFormContext";
import { useSearchParams } from "next/navigation";
import  botonLimpiar  from "@/assets/botonLimpiar.png";
import Image from "next/image";
import { fetchGetRolesByCompanyId } from "../../services/usersActions";
import Cookies from "js-cookie";
import { getClaimsFromPlantillas } from "../../services/claimService";
import { PermissionsFormAdmin } from "./PermissionFormAdmin";
import MultipleSelector from "@/components/ui/multiselect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Swal from "sweetalert2";
import { assignClaims } from "../../services/usersSlice";
import Loading from "@/components/ui/Modals/loading"
import { setSelectedTabClaims } from "@/lib/services/claims/claimsSlices";
import { deleteUserClaims } from "@/lib/services/claims/deleteClaims";
import alerta from '@/Asset/alerta 1.png';
import { ModalPlantilla } from "@/components/ui/Modals/modalClaims";
interface Props {
  company: Option;
  onAssignClaims: () => void
  companyName: string
  
}

export const PermissionsTabContent = ({ company, onAssignClaims, companyName }: Props) => {
  
  const { setClaims, currentUser, isLoadingUser , selectedTemplates, setSelectedTemplates, getCurrentUser } = useUserForm();

  const [permissionType, setPermissionType] = useState<string>("");

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showPermissionsText, setShowPermissionsText] = useState<boolean>(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const { selectedTabCompanyId, selectedTabClaims, selectedTabTemplate, selectedTabTemplateName} = useSelector((state: RootState) => state.claims);
  const userToken = Cookies.get("auth-token") || "";
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const dispatch = useDispatch<AppDispatch>();
  const [loader, setLoader] = useState(false)
  const [isTemplateDisabled, setIsTemplateDisabled] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
const [claimsPreview, setClaimsPreview] = useState<any[]>([]);
const [pendingTemplates, setPendingTemplates] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (isLoadingUser || permissionType === "") return;
    setClaims((prevState: any) => {
      console.log("SETTING CLAIMS PermTabCont" );
      if (permissionType === "custom-profile") {
        setShowPermissionsText(true);
        const { roleTemplateId, ...rest } = prevState;
        return { ...rest, permissionType, individualClaims: [] };
      } else {
        setShowPermissionsText(false);
        const { individualClaims, ...rest } = prevState;
        return { ...rest, permissionType };
      }
    });
  }, [permissionType, setClaims, isLoadingUser]);

  useEffect(() => {
    if (!selectedTabCompanyId) return;
  
    const loadRoles = async () => {
      try {
        const data = await fetchGetRolesByCompanyId({
          token: userToken,
          id: selectedTabCompanyId,
        });
  
        if (data.success && data.roles) {
          setRoles(
            data.roles.map((role) => ({
              id: role.roleTemplateId,
              name: role.roleTemplateName,
            }))
          );
          console.log("Roles:", data.roles);
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error("Error al obtener roles:", error);
        setRoles([]);
      }
    };
  
    loadRoles();
  }, [selectedTabCompanyId, userToken]);

  useEffect(() => {
    setSelectedTemplates([]);
  }, [selectedTabCompanyId]);

  useEffect(() => {
    setClaims({});
  }, [selectedTabCompanyId]);  



  const handlePermissionChange = async (value: string) => {
    setPermissionType(value);
  
    if (value !== "rol") {
      setSelectedRole("");
    }
    
    if (value === "plantilla") {
      if (selectedTabTemplate && selectedTabTemplate.length > 0) {
        // Restaurar plantillas seleccionadas
        setSelectedTemplates([selectedTabTemplate]);
        // Convertir selectedTabTemplate en array si es un string con comas
        const templatesArray = 
          typeof selectedTabTemplate === "string"
            ? selectedTabTemplate.split(",")
            : selectedTabTemplate;

        console.log("🚀 ~ handlePermissionChange ~ templatesArray:", templatesArray);
        const currentOptions = templatesArray
          .map((templateId: string) => {
            const template = roles.find(role => role.id === templateId);
            return template ? { label: template.name, value: template.id } : undefined;
          })
          .filter((template): template is { label: string; value: string } => template !== undefined);
        console.log("🚀 ~ handlePermissionChange ~ currentOptions:", currentOptions);
        const shouldShowModal = !(selectedTabTemplate && selectedTabTemplate.length > 0)
        handleTemplateSelection(currentOptions, false);
      }
    } else {
      setSelectedTemplates([]);
    }
  };
  
  
  useEffect(() => {
    handlePermissionChange(permissionType);
  }, [selectedTabTemplate, permissionType, roles]);

  const handleTemplateSelection = async (options: { label: string; value: string }[], showModal = true) => {
    setPendingTemplates(options);
    const claims = await getClaimsFromPlantillas(options, selectedTabCompanyId);
    setClaimsPreview(claims);
    if (showModal) {
      setShowTemplateModal(true);
    }
  };
  

useEffect(() => {
  const hasClaims = selectedTabClaims?.length > 0;  // O la lógica que utilices para verificar los claims
  const hasNoTemplates = selectedTabTemplate === ''; // Verifica si no hay plantillas
  if (hasClaims && hasNoTemplates) {
    setIsTemplateDisabled(true);
  } else {
    setIsTemplateDisabled(false);
  }
}, [selectedTabClaims, selectedTabTemplate]);

 useEffect(() => {

     if (isLoadingUser || !currentUser) return;

     const claimsLength = selectedTabClaims?.length || 0;
     const plantillas = selectedTabTemplate?.length || 0;
     const hasNoClaims = selectedTabClaims.some(
      (claim: any) => claim.claimType === "Action" && claim.claimValue === "noClaims"
    );
  
    if (plantillas >= 1) {
      setPermissionType("plantilla");
      setSelectedRole("");
    } else if (claimsLength >= 1763) {
      setPermissionType("rol");
      setSelectedRole("administrador");
    } else if (claimsLength >= 1 && claimsLength <= 1762  && !hasNoClaims) {
      setPermissionType("custom-profile");
      setSelectedRole("");
    } else {
      setPermissionType("");
      setSelectedRole("");
    }

   }, [currentUser, isLoadingUser]);

   useEffect(() => {
    //console.log("🚀 ~ useEffect ~ currentUser:", currentUser);
    //console.log("🚀 ~ useEffect ~ isLoadingUser:", isLoadingUser);
  
    if (!currentUser || isLoadingUser) return;
  
    //console.log("🚀 ~ useEffect ~ selectedTabTemplate:", selectedTabTemplate);
    
    if (selectedTabTemplate && selectedTabTemplate.length > 0) {
  
      // Filtrar roles que coincidan con los nombres en roleTemplateNames
      const matchingTemplates = roles
        .filter(role => selectedTabTemplate.includes(role.id))
        .map(role => role.id); // Obtener solo los IDs
      
      //console.log("🚀 ~ useEffect ~ matchingTemplates:", matchingTemplates);
  
      setSelectedTemplates(matchingTemplates);
      
    }
  }, [currentUser, isLoadingUser, roles]);


  const handleDelete = async () => {
    if (!id || !company?.companyId || isNaN(Number(company.companyId))) {
      console.error("ID de usuario o ID de empresa no válidos");
      return;
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn-success",
        cancelButton: "btn-danger",
        container: 'swal2-container',
        popup: 'swal-popup-error',
        title: 'swal-title',
        actions: 'swal-actions',
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons.fire({
      title: "¿Está seguro?",
      text: "Al aceptar, el usuario se quedará sin permisos.",
      imageUrl: alerta.src,
      imageWidth: 120,
      imageHeight: 100,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteUserClaims(id, Number(company.companyId));
          if (response.success) {
            Swal.fire({
              title: "¡Permisos eliminados!",
              text: response.message,
              icon: "success",
              confirmButtonText: "Cerrar",
              customClass: {
                container: 'swal2-container',
                popup: 'swal-popup-succes',
                confirmButton: 'swal-confirm-button',
                title: 'swal-title',
              },
            });
            getCurrentUser()
          } else {
            Swal.fire({
              title: "Error",
              text: response.message,
              icon: "error",
              confirmButtonText: "Cerrar",
              customClass: {
                container: 'swal2-container',
                popup: 'swal-popup-error',
                confirmButton: 'swal-confirm-button',
                title: 'swal-title',
              },
            });
          }
        } catch (error) {
          console.error("Error al eliminar permisos:", error);
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error inesperado al eliminar los permisos.",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        }
      }
    });
  };
  const handleConfirmTemplate = () => {
 
    setSelectedTemplates(pendingTemplates.map(p => p.value));
    setShowTemplateModal(false);
  };
  
  
  return (
   
    <>{loader && <Loading />}
      {company.companyId !== null && (
        <div className="w-full mb-4 ">
          <div className="flex flex-col lg:flex-row w-full mb-4 items-start lg:items-center">
            <div className="w-[240px] flex mt-4 mb-2 flex-col">
              <span className="font-semibold text-md text-slate-600">*Selecciona una opción:</span>
              <span className="font-semibold text-md text-slate-600">* Campos obligatorios</span>

            </div>
            <div className="w-full md:mr-10">
              <RadioGroup
                className="flex flex-row w-full justify-between"
                onValueChange={handlePermissionChange}
                value={permissionType}
              >
                <div className="flex items-center">
                  <RadioGroupItem value="rol" id="rol" className="h-[30px] w-[30px] border-[#5B6670] bg-white data-[state=checked]:bg-[#5B6670] data-[state=checked]:border-[#5B6670] data-[state=checked]:ring-0 data-[state=checked]:after:content-none" />
                  <Label htmlFor="rol" className="mx-2 text-xl text-[#575757]">Rol</Label>
                  <Select
                    disabled={permissionType !== "rol"}
                    onValueChange={(e) => {
                      setSelectedRole(e);
                      setShowPermissionsText(true);
                    }}
                    value={selectedRole}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Seleccionar Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrador">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center">
                  <RadioGroupItem value="custom-profile" id="custom-profile" className="h-[30px] w-[30px] border-[#5B6670] bg-white data-[state=checked]:bg-[#5B6670] data-[state=checked]:border-[#5B6670] data-[state=checked]:ring-0 data-[state=checked]:after:content-none" />
                  <Label htmlFor="custom-profile" className="mx-2 text-xl text-[#575757]">Perfil personalizado</Label>
                </div>

                <div className="flex items-center">
                  <RadioGroupItem value="plantilla" id="plantilla" className="h-[30px] w-[30px] border-[#5B6670] bg-white data-[state=checked]:bg-[#5B6670] data-[state=checked]:border-[#5B6670] data-[state=checked]:ring-0 data-[state=checked]:after:content-none"  disabled={isTemplateDisabled}/>
                  <Label htmlFor="plantilla" className="mx-2 text-xl text-[#575757]">Plantilla</Label>

                  <MultipleSelector
                    value={selectedTemplates.map(templateId => {
                      const template = roles.find(role => role.id === templateId); 
                      return template ? { label: template.name, value: template.id } : undefined; 
                    }).filter((template): template is { label: string; value: string } => template !== undefined)} 
                    onChange={(options) => handleTemplateSelection(options)}
                    options={roles.map(role => ({ label: role.name, value: role.id }))}
                    disabled={permissionType !== "plantilla"}
                    placeholder="Selecciona la(s) plantilla(s)"
                    className="w-[250px] h-5 overflow-auto disabled:bg-[#E3E1E6]"
                    badgeClassName="text-white p-2 bg-[#3C98CB] hover:bg-[#69aacc] h-8 text-sm"
                    hidePlaceholderWhenSelected
                    allowSingleSelect
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        No hay plantillas disponibles
                      </p>
                    }
                  />
                  <Button
                      className={`ml-2 text-white bg-[#4197CB] ${
                        selectedTemplates.length === 0 ? "bg-opacity-50" : "hover:bg-blue-600"
                      }`}
                    onClick={onAssignClaims}
                    disabled={selectedTemplates.length === 0}
                  >
                    Aplicar
                  </Button>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      )}



      {selectedTabCompanyId && (permissionType === "custom-profile" || permissionType === "plantilla") && (
        <PermissionsForm company={company} companyName={companyName} permissionType={permissionType} handleDelete={handleDelete}/>
      )}

      {permissionType === "rol" && selectedRole === "administrador" && (
        <PermissionsFormAdmin company={company} companyName={companyName} />
      )}
      
      <ModalPlantilla
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onConfirm={handleConfirmTemplate}
        claims={claimsPreview}
      />

    </>
  );
};
