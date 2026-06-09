"use client";
import { useEffect, useState } from "react";
import { useUserForm } from "./UserFormContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { PermissionsTabContent } from "./PermissionsTabContent";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  assignClaims,
  setCurrentCompanyTab
} from "../../services/usersSlice";
import { setClaimsByTabId, setTabCompanyId, setSelectedTabClaims, setSelectedTabTemplate, setSelectedTabTemplateName } from "@/lib/services/claims/claimsSlices";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import Loading from "@/components/ui/Modals/loading"
import Cookies from "js-cookie";
export const Permissions = () => {

  const { claims, permissionsError, currentUser, isLoadingUser, setCompaniesWithClaims,selectedTemplates, companiesWithClaims,handleAssignClaims, getCurrentUser } = useUserForm();
  const [permissionType, setPermissionType] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loader, setLoader] = useState(false)
  const companies = currentUser?.user.companies || [];
  const [tabselected,settabselected] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTabCompanyId, claimsByTabId, selectedTabClaims, selectedTabTemplate } = useSelector((state: RootState) => state.claims);  
  const token = Cookies.get("auth-token") || ""
  const updateCompanyClaims = (companyId : any, newClaims : any, newTemplates : any) => {
    setCompaniesWithClaims((prevCompanies) => {
      const updatedCompanies = prevCompanies.map((company) =>
        company.id === companyId
          ? {
              ...company,
              roleTemplateIds: newTemplates !== undefined ? newTemplates : company.roleTemplateIds,
              individualClaims: newClaims !== undefined ? newClaims : company.individualClaims,
            }
          : company
      );

      return [...updatedCompanies];
    });
  };


  useEffect(() => {
      if (isLoadingUser || !currentUser?.claims) return;
    
      const claimsLength = currentUser.claims.length;
    
      if (claimsLength >= 1734) {
        setPermissionType("rol");
        setSelectedRole("administrador");
      } else if (claimsLength > 0 && claimsLength < 1733) {
        setPermissionType("custom-profile");
        setSelectedRole("");
      } else {
        setPermissionType("");
        setSelectedRole("");
      }
    }, [currentUser, isLoadingUser]);

    useEffect(() => {
        if (companies && companies.length > 0) {
          setCompaniesWithClaims((prevCompaniesWithClaims) => {
            const updatedCompaniesWithClaims = companies.map((company : any) => {
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

  const HandleChangeTab = async (e: any) => {
    console.log("🚀 ~ HandleChangeTab ~ e", e);
    
    //Recuperacion de compañia
    const prevCompany = companies.find((c: { name: any; }) => c.name === tabselected);
    const company =  companies.find((c: { name: any; }) => c.name === e);

    settabselected(e);
    dispatch(
      setTabCompanyId (company?.companyId || "")
    );

    dispatch(
      setSelectedTabClaims(company?.individualClaims || [])
    );

    dispatch(
      setSelectedTabTemplate(company?.roleTemplateId || "")
    );

    dispatch(
      setSelectedTabTemplateName(company?.roleTemplateNames || "")
    )
    

    //Recuperacion de IDs de compañias
    const companyIndex = prevCompany?.companyId || "";

    //Recuperacion de claims
    const claimsFind = claimsByTabId.find((c) => c.companyId === companyIndex);

    //Si no existen claimsFind o es indefinido se agrega un nuevo claim
    if (companyIndex) {
      if (!claimsFind && claimsFind == undefined) {
        dispatch(
          setClaimsByTabId([...claimsByTabId, {companyId: companyIndex || "", claims: [claims]}])
        )
      } else {
  
  
        const newClaims = claimsByTabId.map((c) => {
          if (c.companyId === companyIndex) {
            return {companyId: companyIndex, claims: [claims]}
          } else {
            return c;
          }
        })
        dispatch(
          setClaimsByTabId(newClaims)
        )
      }
    }
    updateCompanyClaims(companyIndex, claimsFind?.claims || [], company?.roleTemplateIds || []);
  };

  const companyName = tabselected;
  // useEffect(()=>{
  //   console.log("Que cuchas es esto",companies)
  // },[companies])

   const onAssignClaims = async () => {
    if(selectedTemplates.length === 0 ) return
    try {
      setLoader(true);  
      const body = await handleAssignClaims();
      if (body === undefined) return;  
      const resp = await dispatch(
        assignClaims({ token, body })
      ).unwrap();  
      console.log("🚀 ~ onAssignClaims ~ body en administracion con boton aplicar para la plantilla:", body);  
      const companyName = tabselected;
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: `Se han aplicado las plantillas de forma exitosa a la empresa ${companyName}`,
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
        text: "No se pudieron asignar las plantillas de forma exitosa",
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

  return (
    <>
    {loader && <Loading />}
      {permissionsError && <span className="text-[#CF5459] text-xs">{permissionsError}</span>}
      <div className="w-full">
        <div className="mb-8">
          <span className="font-semibold text-md text-slate-600">
            Asignando perfil a <span className="text-[#3C98CB] text-xl font-bold">{currentUser?.user.fullName}</span>
          </span>
        </div>
        
        <div >
        
            <div className="flex gap-2">
              
              <Tabs onValueChange={HandleChangeTab} className=" w-full"> 
              <span className="font-semibold text-md text-slate-600 pr-5">
                *Empresa(s) asignadas{" "}:
              </span>
                <TabsList className="" >
                  {companies.map((company : any) => (
                    <Tooltip title={'Guarda los permisos antes de cambiar'} placement="top">
                      <TabsTrigger
                        key={company.companyId}
                        value={company.name}
                        className="data-[state=active]:bg-[#3C98CB] data-[state=active]:text-white "
                        >
                        {company.name}
                      </TabsTrigger>
                    </Tooltip>
                  ))}
                </TabsList>
                {companies.map((company : any) => (
                <TabsContent

                  key={company.companyId}
                  value={company.name}
                  className="mt-0"
                >
                  <PermissionsTabContent company={company} onAssignClaims={onAssignClaims} companyName={companyName} />
                </TabsContent>
                ))}
              </Tabs>
            
            </div>
        </div>
      </div>
    </>
  );
};
