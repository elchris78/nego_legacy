"use client"

import type React from "react"
import { CardContent, Typography } from "@mui/material"
import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store/store"
import Cookies from "js-cookie"
import { fetchAllClaims } from "@/lib/services/claims/claimsSlices"
import type { AppDispatch } from "@/lib/store/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronUp } from "lucide-react"
import Checkbox from "@mui/material/Checkbox"
import { useUserForm } from "./UsersFormContext";
import { useRouter, useSearchParams } from "next/navigation";
import { assignClaims } from "../../services/usersCompanySlice"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"

interface individualClaims {
  claimType: string
  claimValue: string
}

interface ModuleData {
  sections: Set<string>
  subSections: Record<string, Set<string>>
}

interface SelectedClaims {
  [module: string]: {
    [section: string]: {
      [action: string]: boolean
    }
  }
}

const groupClaimsByModule = (claims: individualClaims[]): Record<string, ModuleData> => {
  const modules: Record<string, ModuleData> = {}

  claims.forEach(({ claimType, claimValue }) => {
    const parts = claimValue.split(".")
    const module = parts[0] ?? ""
    
    if (!modules[module]) {
      modules[module] = { sections: new Set(), subSections: {} }
    }

    if (claimType === "Section") {
      const sectionName = parts[1] ?? ""
      modules[module].sections.add(sectionName)
      if (!modules[module].subSections[sectionName]) {
        modules[module].subSections[sectionName] = new Set()
      }
    } else {
      // La última parte es la acción; el resto conforma la ruta completa de la sección
      const action = parts[parts.length - 1] ?? ""
      const sectionPathParts = parts.slice(1, parts.length - 1)
      const sectionKey = sectionPathParts.join(".") || (parts[1] ?? "")
      
      if (!modules[module].subSections[sectionKey]) {
        modules[module].subSections[sectionKey] = new Set()
      }
      modules[module].subSections[sectionKey].add(action)
    }
  })

  return modules
}

/**
 * Función para definir la indentación y color según el nivel de la sección.
 */
const getIndentAndColor = (sectionKey: string) => {
  const level = sectionKey.split(".").length
  if (level === 1) return ""
  if (level === 2) return "pl-5 text-[#0C4C90]"
  if (level === 3) return "pl-9 text-[#4197CB]"
  return "pl-14 text-[#8E8E8E]"
}

interface ModuleSectionProps {
  module: string
  sections: Set<string>
  subSections: Record<string, Set<string>>
  selectedClaims: SelectedClaims
  setSelectedClaims: React.Dispatch<React.SetStateAction<SelectedClaims>>
}




const ModuleSection = ({ module, sections, subSections, selectedClaims, setSelectedClaims }: ModuleSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const claimsData = useSelector((state: RootState) => state.claims.dataAll);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const handleClaimChange = (sectionKey: string, action: string, checked: boolean) => {
    setSelectedClaims((prev: any) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [sectionKey]: {
          ...prev[module]?.[sectionKey],
          [action]: checked,
        },
      },
    }))
  }

  const handleSelectAll = (sectionKey: string, checked: boolean) => {
    const actions = subSections[sectionKey]
    const newSectionClaims: Record<string, boolean> = {}

    actions.forEach((action) => {
      newSectionClaims[action] = checked
    })

    setSelectedClaims((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [sectionKey]: newSectionClaims,
      },
    }))
  }

  const isAllSelected = (sectionKey: string) => {
    const sectionClaims = selectedClaims[module]?.[sectionKey] || {}
    const actionsInSection = Array.from(subSections[sectionKey] || new Set())
  
    return actionsInSection.length > 0 && actionsInSection.every(action => sectionClaims[action])
  }
  

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Typography color="#5B6670" variant="h6" fontWeight={600} textTransform={'uppercase'}>
          {module}
        </Typography>
        <button className="bg-[#5B6670] p-1 rounded-sm cursor-pointer ml-3" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-[#FFFFFF]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#FFFFFF]" />
          )}
        </button>
      </div>
      {isOpen && (
        <Table>
          <TableHeader className="bg-[#EDEDED]">
            <TableRow>
              <TableHead>Sección</TableHead>
              <TableHead className="border-r border-[#BDC3C7]">Consultar</TableHead>
              <TableHead className="border-r border-[#BDC3C7]">Agregar</TableHead>
              <TableHead className="border-r border-[#BDC3C7]">Eliminar</TableHead>
              <TableHead className="border-r border-[#BDC3C7]">Editar</TableHead>
              <TableHead className="border-r border-[#BDC3C7]">Estatus</TableHead>
              <TableHead className="border-r border-[#BDC3C7]">Imprimir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(subSections)
              .filter(([sectionKey]) => sectionKey.trim() !== "")
              .map(([sectionKey, actions]) => {
                const validActions = ["Leer", "Crear", "Eliminar", "Actualizar", "ToggleStatus", "Imprimir"];
                const hasAllValidActions = validActions.every(action => actions.has(action));

                return (
                  <TableRow key={sectionKey}>
                    <TableCell className={getIndentAndColor(sectionKey)}>
                      {sectionKey.split(".").pop() ?? ""}
                    </TableCell>
                    {["Leer", "Crear", "Eliminar", "Actualizar", "ToggleStatus", "Imprimir"].map((action) => (
                      <TableCell key={action} className="border-r border-[#BDC3C7] text-center">
                        {actions.has(action) ? (
                          <Checkbox
                            checked={
                              selectedClaims[module]?.[sectionKey]?.[action] || false
                            }
                            onChange={(event) =>
                              handleClaimChange(sectionKey, action, event.target.checked)
                            }
                            disabled={!actions.has(action) || mode === "editw"}
                            sx={{
                              padding: 0,
                              "& .MuiSvgIcon-root": {
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                border: "1.5px solid #5B6670",
                                backgroundColor: "transparent",
                                path: {
                                  display: "none"
                                }
                              },
                              "&.Mui-checked": {
                                "& .MuiSvgIcon-root": {
                                  backgroundColor: "#5B6670",
                                  border: "none"
                                }
                              }
                            }}
                          />
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
      )}
    </div>
  );
};


interface dataClaims {
  claims: individualClaims[]
}



export const ClaimsManager = ({ claims }: dataClaims) => {
  const groupedClaims = groupClaimsByModule(claims);
  const [selectedClaims, setSelectedClaims] = useState<SelectedClaims>({});
  const { setClaims, claims: userClaims } = useUserForm(); // Obtener claims del contexto
  
  useEffect(() => {
    const newSelectedClaims: SelectedClaims = {};
  
    Object.entries(groupedClaims).forEach(([module, { sections, subSections }]) => {
      if (!newSelectedClaims[module]) newSelectedClaims[module] = {};
  
      Object.keys(subSections).forEach((section) => {
        if (!newSelectedClaims[module][section]) newSelectedClaims[module][section] = {};
  
        subSections[section].forEach((action) => {
          newSelectedClaims[module][section][action] = true; // Activar todos los permisos
        });
      });
    });
  
    setSelectedClaims(newSelectedClaims);
  }, [claims]) // Se ejecuta solo si los claims cambian

  useEffect(() => {
    const assignClaims: individualClaims[] = [];

    Object.entries(selectedClaims).forEach(([module, sections]) => {
      Object.entries(sections).forEach(([section, actions]) => {
        Object.entries(actions).forEach(([action, isChecked]) => {
          if (isChecked) {
            assignClaims.push({
              claimType: "Action",
              claimValue: `${module}.${section}.${action}`,
            });
          }
        });
      });
    });

    console.log("Claims seleccionados:", assignClaims); // Verificar si están vacíos
    console.log("Setting claims PERMFORMADM"); // Verificar si están vacíos
    setClaims((prev) => ({
      ...prev,
      individualClaims: assignClaims,
    }));
    
  }, [selectedClaims]);
  

  return (
    <div className="flex flex-col  gap-8 fle md:flex-row">
      <div className="w-[45%]">
        <div >
          {Object.entries(groupedClaims)
            .slice(0, Math.ceil(Object.entries(groupedClaims).length / 2))
            .map(([module, { sections, subSections }]) => (
              <ModuleSection
                key={module}
                module={module}
                sections={sections}
                subSections={subSections}
                selectedClaims={selectedClaims}
                setSelectedClaims={setSelectedClaims}
              />
            ))}
        </div>
      </div>
      <div className="w-[55%] flex justify-center">
        <div className="w-[70%]">
          {Object.entries(groupedClaims)
            .slice(Math.ceil(Object.entries(groupedClaims).length / 2))
            .map(([module, { sections, subSections }]) => (
              <ModuleSection
                key={module}
                module={module}
                sections={sections}
                subSections={subSections}
                selectedClaims={selectedClaims}
                setSelectedClaims={setSelectedClaims}
              />
            ))}
        </div>
      </div>      
    </div>
  );
};

export const PermissionsFormAdmin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector((state: RootState) => state.claims.loading)
  const claimsData = useSelector((state: RootState) => state.claims.dataAll)
  const token = Cookies.get("auth-token") || ""
  const { handleAssignClaims, getCurrentUser } = useUserForm()
  const [loader, setLoader] = useState(false)
  const router = useRouter();

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
        text: `Se han asignado los permisos de forma exitosa`,
        icon: "success",
        confirmButtonText: "Cerrar",
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-succes', 
          confirmButton: 'swal-confirm-button', 
          title: 'swal-title', 
        }
      });
      router.push(
        "/configuracion/configuracion-sistemas/control-usuarios/usuarios"
      );
    }
  } catch (error: any) {
    const errorMsg = error?.message;
    Swal.fire({
      title: "¡ERROR!",
      text: `No se pudieron asignar los permisos de forma exitosa`,
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
  useEffect(() => {
    if (token && claimsData.length === 0) {
      dispatch(fetchAllClaims(token));
    }
  }, [token, claimsData.length, dispatch]);

  if (isLoading) {
    return <div className="p-8">Cargando . . .</div>
  }

  return (
    <>
      <CardContent sx={{ p: 0 }}>
        <Button
          onClick={onAssignClaims}
          className="bg-[#3C98CB] hover:bg-[#3788b4] min-w-36 mt-2 mb-2"
        >
          Guardar
        </Button>
        <ClaimsManager claims={claimsData} />
      </CardContent>
    </>
  )
}

