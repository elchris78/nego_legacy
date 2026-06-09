"use client";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/ui/label";
import { PermissionsForm } from "./PermissionsForm";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { useUserForm } from "./UsersFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import botonLimpiar from "@/assets/botonLimpiar.png";
import XUsuario from "@/assets/XUsuarios.png";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { assignClaims, setSelectedTemplatesGUID } from "../../services/usersCompanySlice";
import { AppDispatch, RootState } from "@/lib/store/store";
import { getClaimsFromPlantillas } from "../../services/claimService";
import { PermissionsFormAdmin } from "./PermissionFormAdmin";
import MultipleSelector from "@/components/ui/multiselect";
import Loading from "@/components/ui/Modals/loading"
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { deleteUserClaimsAuth } from "@/lib/services/claims/deleteClaims";
import alerta from '@/Asset/alerta 1.png';
import { ModalPlantilla } from "@/components/ui/Modals/modalClaims";
type Option = {
  value: string;
  label: string;
};
export const Permissions = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const token = Cookies.get("auth-token") ?? "AUTH_TOKEN";
  const { claims, setClaims, permissionsError, currentUser, isLoadingUser, rols, handleAssignClaims, selectedTemplates, setSelectedTemplates, getCurrentUser } = useUserForm();
  const [permissionType, setPermissionType] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showPermissionsText, setShowPermissionsText] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [showPermissionsForm, setShowPermissionsForm] = useState(true);
  const [loader, setLoader] = useState(false)
  const [isTemplateDisabled, setIsTemplateDisabled] = useState(false);
  
  const id = searchParams.get("id");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [claimsPreview, setClaimsPreview] = useState<any[]>([]);
  const [pendingTemplates, setPendingTemplates] = useState<{ label: string; value: string }[]>([]);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);


  useEffect(() => {
    dispatch(setSelectedTemplatesGUID(selectedTemplates));
  }, [selectedTemplates]);

  useEffect(() => {
    if (isLoadingUser) return;
    if (currentUser && currentUser?.roleTemplateId) {
      setPermissionType("rol");
    } else if (currentUser && !currentUser?.roleTemplateId) {
      setPermissionType("custom-profile");
    }
  }, [currentUser, isLoadingUser]);

  useEffect(() => {
    if (permissionType === "") return;
  
    setShowPermissionsText(permissionType === "custom-profile");
  }, [permissionType]);

  useEffect(() => {
    if (isLoadingUser || permissionType === "") return;
  
    setClaims((prevState: any) => {
      if (permissionType === "custom-profile") {
        const { roleTemplateId, ...rest } = prevState;
        return { ...rest, permissionType, individualClaims: currentUser?.claims };
      } else {
        const { individualClaims, ...rest } = prevState;
        return { ...rest, permissionType };
      }
    });
  }, [permissionType, isLoadingUser, setClaims, currentUser]);

    const handleTemplateSelection = async (options: { label: string; value: string }[], showModal = true) => {
      setPendingTemplates(options);
      const claims = await getClaimsFromPlantillas(options);
      // setClaims((prevState: any) => {
      //   const { individualClaims, ...rest } = prevState;
      //   return { ...rest, individualClaims: claims };
      // });
      setClaimsPreview(claims);
      if (showModal) {
        setShowTemplateModal(true);
      }
    };

    
    
  
  const handlePermissionChange = (value: string) => {
    setPermissionType(value);
  
    if (value !== "rol") {
      setSelectedRole("");
    }
  
    if (value === "plantilla") {
      // Mantener las plantillas si ya existían antes
      if (currentUser?.roleTemplateNames?.length > 0) {
        const selectedOptions = currentUser.roleTemplateNames
          .map((templateName: any) => rols.find((rol) => rol.label === templateName))
          .filter(Boolean); // Elimina valores undefined
  
        setSelectedTemplates(selectedOptions.map((template: any) => template.value));
        handleTemplateSelection(selectedOptions, false);
      }
    } else {
      setSelectedTemplates([]);
    }
  };

  useEffect(() => {
    const hasClaims = currentUser?.claims.length > 0;  // O la lógica que utilices para verificar los claims
    const hasNoTemplates = currentUser?.roleTemplateId === null; // Verifica si no hay plantillas
  
    if (hasClaims && hasNoTemplates) {
      setIsTemplateDisabled(true);
    } else {
      setIsTemplateDisabled(false);
    }
  }, [currentUser]);
  
  useEffect(() => {
    if (isLoadingUser || !currentUser?.claims) return;
  
    const claimsLength = currentUser.claims.length;
    const plantillas = currentUser?.roleTemplateId?.length || 0;
  
    // Verifica si el usuario tiene el claim "noClaims"
    const hasNoClaims = currentUser.claims.some(
      (claim: any) => claim.claimType === "" && claim.claimValue === ""
    );
  
    if (plantillas >= 1) {
      setPermissionType("plantilla");
      setSelectedRole("");
    } else if (claimsLength >= 1763) {
      setPermissionType("rol");
      setSelectedRole("administrador");
    } else if (claimsLength >= 1 && claimsLength <=  1762 && !hasNoClaims) {
      setPermissionType("custom-profile");
      setSelectedRole("");
    } else {
      setPermissionType("");
      setSelectedRole("");
    }
  }, [currentUser, isLoadingUser]);
  
  useEffect(() => {
    const ready =
      !isLoadingUser &&
      currentUser?.claims &&
      currentUser?.roleTemplateNames?.length > 0 &&
      Array.isArray(rols) &&
      rols.length > 0;
  
    if (!ready) {
      return;
    }
  
    const plantillas = currentUser.roleTemplateNames;
    const permisos = currentUser.claims;
  
    const selectedOptions = plantillas
      .map((templateName: any) => {
        const match = rols.find((rol) => rol.label === templateName);
        // console.log(`🔍 Buscando plantilla "${templateName}":`, match);
        return match;
      })
      .filter(Boolean);
  
    // Primera asignación
    setClaims((prevState: any) => ({
      ...prevState,
      individualClaims: permisos,
    }));
  
    // Segunda asignación con delay de 2 segundos
    const timeoutId = setTimeout(() => {
      setClaims((prevState: any) => ({
        ...prevState,
        individualClaims: permisos,
      }));
    }, 2000);
  
    setSelectedTemplates(selectedOptions.map((template: any) => template.value));
  
    if (selectedOptions.length > 0) {
      setPermissionType("plantilla");
      handleTemplateSelection(selectedOptions, false);
      setShowPermissionsForm(true);
    }
  
    return () => clearTimeout(timeoutId);
  }, [currentUser, isLoadingUser, rols]);
  
  
  
  

  const handleDelete = async () => {
    if (!id) {
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
          const response = await deleteUserClaimsAuth(id);
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
  
  

  const Apli = async () => {
    try {
      setLoader(true)
      const body = await handleAssignClaims();
      if (body === undefined) return;
  
      const resp = await dispatch(assignClaims({ token, body })).unwrap();
      // console.log("plantillas con claims,", body)
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: "Se han agregado las plantillas de forma exitosa", 
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: "swal2-container",
            popup: "swal-popup-succes",
            confirmButton: "swal-confirm-button",
            title: "swal-title",
          },
        });
      }
      router.push("/configuracion/configuracion-sistemas/control-usuarios/usuarios");
      
    } catch (error: any) {
      Swal.fire({
        title: "¡ERROR!",
        text: "No se pudieron agregar las plantillas de forma exitosa",
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: {
          container: "swal2-container",
          popup: "swal-popup-error",
          confirmButton: "swal-confirm-button",
          title: "swal-title",
        },
      });
      // console.log("🚀 ~ onAssignClaims ~ error:", error);
      setLoader(false)
    }
  };

  const handleConfirmTemplate = () => {

    setSelectedTemplates(pendingTemplates.map(p => p.value));
    setShowTemplateModal(false);
  };

  useEffect(() => {
    setHasMounted(true);
    const type = Cookies.get("user-type") || null;
    setUserType(type);
  }, []);

  if (!hasMounted) return null;

  return (
    <>{loader && <Loading />}
      {permissionsError && <span className="text-[#CF5459] text-xs">{permissionsError}</span>}
      <div className="w-full">
        <div className="mb-8">
          <span className="font-semibold text-md text-slate-600">
            Asignando perfil a <span className="text-[#3C98CB] text-xl font-bold">{currentUser?.fullName}</span>
          </span>
        </div>

        <div className="w-full mb-4">
          <div className="flex flex-col lg:flex-row w-full mb-4 items-start lg:items-center">
            <div className="w-[240px] flex items-center mb-2">
              <span className="font-semibold text-md text-slate-600">*Selecciona una opción:</span>
            </div>
            <div className="w-full md:mr-10">
              <RadioGroup
                className="flex flex-row w-full justify-between"
                onValueChange={handlePermissionChange}
                disabled={mode === "view"}
                value={permissionType}
              >
                {(userType === 'Admin') && (
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
                )}
                

                <div className="flex items-center">
                  <RadioGroupItem value="custom-profile" id="custom-profile" className="h-[30px] w-[30px] border-[#5B6670] bg-white data-[state=checked]:bg-[#5B6670] data-[state=checked]:border-[#5B6670] data-[state=checked]:ring-0 data-[state=checked]:after:content-none" />
                  <Label htmlFor="custom-profile" className="mx-2 text-xl text-[#575757]">Perfil personalizado</Label>
                </div>

                <div className="flex items-center">
                  <RadioGroupItem
                    value="plantilla"
                    id="plantilla"
                    className="h-[30px] w-[30px] border-[#5B6670] bg-white data-[state=checked]:bg-[#5B6670] data-[state=checked]:border-[#5B6670] data-[state=checked]:ring-0 data-[state=checked]:after:content-none"
                    disabled={isTemplateDisabled}
                  />
                    <Label htmlFor="plantilla" className="mx-2 text-xl text-[#575757]">
                      Plantilla
                    </Label>
                    <MultipleSelector
                      value={selectedTemplates.map(templateId => {
                        const template = rols.find(rol => rol.value === templateId); 
                        return template ? { label: template.label, value: template.value } : undefined; 
                      }).filter((template): template is { label: string; value: string } => template !== undefined)} 
                      onChange={handleTemplateSelection}
                      options={rols}
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
                      onClick={Apli}
                      disabled={selectedTemplates.length === 0}
                    >
                      Aplicar
                    </Button>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      <span className="font-semibold text-md text-slate-600">* Campos obligatorios</span>

      
        {(permissionType === "custom-profile" || (permissionType === "plantilla" && showPermissionsForm)) && <PermissionsForm permissionType={permissionType} handleDelete={handleDelete}/>}
        
        {selectedRole === "administrador" && <PermissionsFormAdmin />}
      <ModalPlantilla
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onConfirm={handleConfirmTemplate}
        claims={claimsPreview}
      />  
    </>
  );
};
