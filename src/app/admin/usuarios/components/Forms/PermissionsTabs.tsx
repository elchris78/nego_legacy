import { PermissionsTabContent } from "./PermissionsTabContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { useEffect, useState } from "react";
import { useUserForm } from "./UserFormContext";
import {
  assignClaims,
  setCurrentCompanyTab,
  setCurrentTemplate,
} from "../../services/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading"
import Cookies from "js-cookie";

export const PermissionsTabs = () => {
  const {
    currentUser,
    generalDataForm,
    companiesWithClaims,
    setCompaniesWithClaims,
    permissionsError,
    handleAssignClaims, getCurrentUser
  } = useUserForm();
  const { getValues } = generalDataForm;
  const dispatch = useDispatch<AppDispatch>();
  const { currentPermissions, currentTemplate, companyTab } =
    useSelector((state: RootState) => state.users);

  const companies = getValues("companies");
 const token = Cookies.get("auth-token") || ""
  const [tabselected,settabselected] = useState<string>("");
  const [loader, setLoader] = useState(false)
  const HandleChangeTab = async (e: any) => {
    const company = companies.find((c) => c.label === e);
    settabselected(e);
    dispatch(
      setCurrentCompanyTab({
        id: company?.value || "",
        name: company?.label || "",
      })
    );
  };

  //#region useEffects
  useEffect(() => {
    if (companies && companies.length > 0) {
      setCompaniesWithClaims((prevCompaniesWithClaims) => {
        const updatedCompaniesWithClaims = companies.map((company) => {
          const existingCompany = prevCompaniesWithClaims.find(
            (c) => c.id === company.value
          );

          const currentUserCompany = currentUser?.companies?.find(
            (userCompany: any) =>
              userCompany.companyId === parseInt(company.value)
          );

          return existingCompany
            ? {
                ...existingCompany,
                roleTemplateId:
                  currentUserCompany?.roleTemplateId ||
                  existingCompany.roleTemplateId,
              }
            : {
                id: company.value,
                label: company.label,
                permissionType: "custom-profile",
                roleTemplateId: currentUserCompany?.roleTemplateId || null,
                individualClaims: currentUserCompany?.individualClaims || [],
              };
        });

        return updatedCompaniesWithClaims;
      });
    } else {
      setCompaniesWithClaims([]);
    }
  }, [companies, currentUser]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      settabselected(companies[0].label);
      dispatch(
        setCurrentCompanyTab({
          id: companies[0].value,
          name: companies[0].label,
        })
      );
    }
  }, [companies]);

  // useEffect(() => {
  //   console.log(" 🚀 --  currentTemplate:", currentTemplate);
  // }, [currentTemplate]);

  //#endregion useEffects
  const companyName = tabselected;
  const onAssignClaims = async () => {
      try {
        setLoader(true);  
        const body = await handleAssignClaims();
        if (body === undefined) return;  
        const resp = await dispatch(
          assignClaims({ token, body })
        ).unwrap();  
        console.log("🚀 ~ onAssignClaims ~ body:", body);  
        if (resp !== undefined && resp.success) {
          Swal.fire({
            title: "¡ÉXITO!",
            text: resp.message || "Se han asignado los permisos de forma exitosa",
            icon: "success",
            confirmButtonText: "Cerrar",
            customClass: {
              container: 'swal2-container',
              popup: 'swal-popup-succes', 
              confirmButton: 'swal-confirm-button', 
              title: 'swal-title', 
            }
          });
          getCurrentUser();
        }
      } catch (error: any) {
        const errorMsg = error?.message;
        Swal.fire({
          title: "¡ERROR!",
          text: "No se pudieron asignar los permisos de forma exitosa",
          icon: "error",
          confirmButtonText: "Volver a intentar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-error', 
            confirmButton: 'swal-confirm-button', 
            title: 'swal-title', 
          }
        });
        console.log("🚀 ~ onAssignClaims ~ error:", error);
      } finally {
        setLoader(false);
      }
    }
  if (companies === undefined || companies?.length === 0)
    return (
      <div>
        <span>Seleccione una empresa para configurar los permisos</span>
      </div>
    );

  if (companies?.length > 0)
    
    return (
      <>
        {permissionsError && (
          <span className="text-[#CF5459] text-xs">{permissionsError}</span>
        )}
      
        <Tabs defaultValue={companies[0].label} onValueChange={HandleChangeTab}> 
          <TabsList className="flex flex-row w-min rounded-b-none p-0" >
            {companies.map((company) => (
              <TabsTrigger
                key={company.value}
                value={company.label}
                className="data-[state=active]:bg-[#3C98CB] data-[state=active]:text-white"
              >
                {company.label}
              </TabsTrigger>
            ))}
          </TabsList>          
          {companies.map((company) => (
            <TabsContent
              key={company.value}
              value={company.label}
              className="mt-0"
            >
              <PermissionsTabContent company={company}  onAssignClaims={onAssignClaims} companyName={companyName}/>
            </TabsContent>
          ))}
        </Tabs>
      </>
    );
};
