"use client"

import type React from "react"
import { CardContent, Typography } from "@mui/material"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/store/store"
import Cookies from "js-cookie"
import { fetchAllClaims } from "@/lib/services/claims/claimsSlices"
import type { AppDispatch } from "@/lib/store/store"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Checkbox from "@mui/material/Checkbox"
import { useUserForm } from "./UserFormContext"
import { useSearchParams } from "next/navigation"
import { Option } from "@/components/ui/multiselect"
import { assignClaims, setCurrentPermissionsStore } from "../../services/usersSlice"
import Swal from "sweetalert2"
import Loading from "@/components/ui/Modals/loading"

interface Props {
  company: Option;
  companyName: string;
  permissionType: string
  handleDelete: () => void
}

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

/**
 * Nueva lógica para agrupar los claims usando representación por niveles.
 */
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
  subSections: Record<string, Set<string>>
  selectedClaims: SelectedClaims
  setSelectedClaims: React.Dispatch<React.SetStateAction<SelectedClaims>>
  permissionType: string
}

const ModuleSection = ({ module, subSections, selectedClaims, setSelectedClaims, permissionType }: ModuleSectionProps) => {
  const [isOpen, setIsOpen] = useState(true)
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

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
              <TableHead className="border-r border-[#BDC3C7]">Todos</TableHead>
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
                    <TableCell className="border-r border-[#BDC3C7] text-center">
                      {hasAllValidActions ? (
                        <Checkbox
                          checked={isAllSelected(sectionKey)}
                          onChange={(event) =>
                            handleSelectAll(sectionKey, event.target.checked)
                          }
                          disabled={permissionType === "plantilla"}
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
                            disabled={permissionType === "plantilla"}
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
  company: Option
  permissionType: string
  handleDelete: () => void
}

export const ClaimsManager = ({ claims, permissionType, handleDelete }: dataClaims) => {
  const groupedClaims = groupClaimsByModule(claims)
  const [selectedClaims, setSelectedClaims] = useState<SelectedClaims>({})
  const { setClaims, claims: userClaims } = useUserForm() // Obtener claims del contexto
  const { selectedTabCompanyId, claimsByTabId, selectedTabClaims } = useSelector((state: RootState) => state.claims)

  useEffect(() => {
    if (selectedTabCompanyId) {
      const selectedClaims = claimsByTabId.find((claim) => claim.companyId === selectedTabCompanyId)?.claims

      if (selectedClaims) {
        const convertedClaims: SelectedClaims = {}

        selectedClaims.forEach(({ permissionType, individualClaims }) => {
          individualClaims?.forEach(({ claimValue }) => {
            const parts = claimValue.split(".")
            const module = parts[0]
            const action = parts[parts.length - 1]
            const sectionKey = parts.slice(1, parts.length - 1).join(".") || (parts[1] ?? "")

            if (!convertedClaims[module]) convertedClaims[module] = {}
            if (!convertedClaims[module][sectionKey]) convertedClaims[module][sectionKey] = {}
            convertedClaims[module][sectionKey][action] = true
          })
        })

        setSelectedClaims(convertedClaims)
      }
    }
  }, [selectedTabCompanyId]) // Se ejecuta solo si el companyId cambia
  
  useEffect(() => {
    if ((selectedTabClaims?.length ?? 0) > 0) {
      const newSelectedClaims: SelectedClaims = {}
    
      selectedTabClaims.forEach(({ claimValue }) => {
        const parts = claimValue.split(".")
        const module = parts[0]
        const action = parts[parts.length - 1]
        const sectionKey = parts.slice(1, parts.length - 1).join(".") || (parts[1] ?? "")

        if (!newSelectedClaims[module]) newSelectedClaims[module] = {}
        if (!newSelectedClaims[module][sectionKey]) newSelectedClaims[module][sectionKey] = {}
        newSelectedClaims[module][sectionKey][action] = true
      })
    
      if (JSON.stringify(selectedClaims) !== JSON.stringify(newSelectedClaims)) {
        setSelectedClaims(newSelectedClaims)
      }
    }
    
  }, [selectedTabClaims]) // Se ejecuta solo si los claims cambian

  useEffect(() => {
    const assignClaims: individualClaims[] = []

    Object.entries(selectedClaims).forEach(([module, sections]) => {
      Object.entries(sections).forEach(([sectionKey, actions]) => {
        Object.entries(actions).forEach(([action, isChecked]) => {
          if (isChecked) {
            assignClaims.push({
              claimType: "Action",
              claimValue: `${module}.${sectionKey}.${action}`,
            })
          }
        })
      })
    })

    console.log("Claims seleccionados:", assignClaims); // Verificar si están vacíos
    console.log("SETTING CLAIMS Permiss Form"); // Verificar si están vacíos
    setClaims((prev) => ({
      ...prev,
      individualClaims: assignClaims,
    }))
    
  }, [selectedClaims])
  
 
  return (
    <>
      {permissionType !== 'plantilla' &&(
        <Button onClick={handleDelete}>
          Limpiar
        </Button>
      )}
    


      <div className="flex flex-col  gap-8 fle md:flex-row">
        <div className="w-[45%]">
          <div >
            {Object.entries(groupedClaims)
              .slice(0, Math.ceil(Object.entries(groupedClaims).length / 2))
              .map(([module, { sections, subSections }]) => (
                <ModuleSection
                  key={module}
                  module={module}
                  subSections={subSections}
                  selectedClaims={selectedClaims}
                  setSelectedClaims={setSelectedClaims}
                  permissionType={permissionType}
                />
              ))}
          </div>
        </div>
        <div className="w-[55%] flex justify-center">
          <div className="w-[80%]">
            {Object.entries(groupedClaims)
              .slice(Math.ceil(Object.entries(groupedClaims).length / 2))
              .map(([module, { sections, subSections }]) => (
                <ModuleSection
                  key={module}
                  module={module}
                  subSections={subSections}
                  selectedClaims={selectedClaims}
                  setSelectedClaims={setSelectedClaims}
                  permissionType={permissionType}
                />
              ))}
          </div>
        </div>      
      </div>
    </>
  )
}

export const PermissionsForm: React.FC<Props> = ({ company, companyName, permissionType, handleDelete }) => {
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector((state: RootState) => state.claims.loading)
  const claimsData = useSelector((state: RootState) => state.claims.data)
  const token = Cookies.get("auth-token") || ""
  const { handleAssignClaims, getCurrentUser, isPermissionsFormIncomplete } = useUserForm()
  const [loader, setLoader] = useState(false)

  const onAssignClaims = async () => {
    if(isPermissionsFormIncomplete) return;
    try {
      setLoader(true)
      const body = await handleAssignClaims()
      if (body === undefined) return
      const resp = await dispatch(
        assignClaims({ token, body })
      ).unwrap()
      console.log("🚀 ~ onAssignClaims ~ body:", body)
      if (resp !== undefined && resp.success) {
        Swal.fire({
          title: "¡ÉXITO!",
          text: `Se han asignado los permisos de forma exitosa a la empresa ${companyName}`,
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            container: 'swal2-container',
            popup: 'swal-popup-succes', 
            confirmButton: 'swal-confirm-button', 
            title: 'swal-title', 
          }
        })
        getCurrentUser()
      }
    } catch (error: any) {
      const errorMsg = error?.message
      Swal.fire({
        title: "¡ERROR!",
        text: `No se pudieron asignar los permisos de forma exitosa a la empresa ${companyName}`,
        icon: "error",
        confirmButtonText: "Volver a intentar",
        customClass: {
          container: 'swal2-container',
          popup: 'swal-popup-error', 
          confirmButton: 'swal-confirm-button', 
          title: 'swal-title', 
        }
      })
      console.log("🚀 ~ onAssignClaims ~ error:", error)
    } finally {
      setLoader(false)
    }
  }



  if (isLoading) {
    return <div className="p-8">Cargando . . .</div>
  }

  return (
    <>
      {loader && <Loading />}
      <CardContent sx={{ p: 0 }}>
        {permissionType !== 'plantilla' &&(
          <Button
            onClick={onAssignClaims}
            disabled={isLoading || isPermissionsFormIncomplete}
            className={`bg-[#3C98CB] hover:bg-[#3788b4] min-w-36 mt-2 mb-2 mr-5 $${isPermissionsFormIncomplete || isLoading ? "bg-[#E3E1E6] text-[#949DA4] cursor-not-allowed" : ""}`}
          >
            Guardar
          </Button>
        )}
        <ClaimsManager claims={claimsData} company={{ value: company.value, label: company.label }} permissionType={permissionType} handleDelete={handleDelete} />
      </CardContent>
    </>
  )
}
