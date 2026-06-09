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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Checkbox from "@mui/material/Checkbox"
import { usePlantillaForm } from "./PlantillaFormContext"
import { useSearchParams } from "next/navigation"

interface Claim {
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
 * Función para agrupar los claims usando representación por niveles.
 */
const groupClaimsByModule = (claims: Claim[]): Record<string, ModuleData> => {
  const modules: Record<string, ModuleData> = {};

  claims.forEach(({ claimType, claimValue }) => {
    const parts = claimValue.split(".");
    const module = parts[0] ?? "";
    if (!modules[module]) {
      modules[module] = { sections: new Set(), subSections: {} };
    }

    if (claimType === "Section") {
      const sectionName = parts[1] ?? "";
      modules[module].sections.add(sectionName);
      if (!modules[module].subSections[sectionName]) {
        modules[module].subSections[sectionName] = new Set();
      }
    } else {
      // La última parte es la acción; el resto conforma la ruta completa de la sección
      const action = parts[parts.length - 1] ?? "";
      const sectionPathParts = parts.slice(1, parts.length - 1);
      const sectionKey = sectionPathParts.join(".") || (parts[1] ?? "");
      if (!modules[module].subSections[sectionKey]) {
        modules[module].subSections[sectionKey] = new Set();
      }
      modules[module].subSections[sectionKey].add(action);
    }
  });

  return modules;
};

/**
 * Función para definir la indentación y color según el nivel de la sección.
 */
const getIndentAndColor = (sectionKey: string) => {
  const level = sectionKey.split(".").length;
  if (level === 1) return "";
  if (level === 2) return "pl-5 text-[#0C4C90]";
  if (level === 3) return "pl-9 text-[#4197CB]";
  return "pl-14 text-[#8E8E8E]";
};

interface ModuleSectionProps {
  module: string;
  subSections: Record<string, Set<string>>;
  selectedClaims: SelectedClaims;
  setSelectedClaims: React.Dispatch<React.SetStateAction<SelectedClaims>>;
}




const ModuleSection = ({
  module,
  subSections,
  selectedClaims,
  setSelectedClaims
}: ModuleSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const handleClaimChange = (sectionKey: string, action: string, checked: boolean) => {
    setSelectedClaims((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [sectionKey]: {
          ...prev[module]?.[sectionKey],
          [action]: checked
        }
      }
    }));
  };

  const handleSelectAll = (sectionKey: string, checked: boolean) => {
    const actions = subSections[sectionKey];
    const newSectionClaims: Record<string, boolean> = {};

    actions.forEach((action) => {
      newSectionClaims[action] = checked;
    });

    setSelectedClaims((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [sectionKey]: newSectionClaims
      }
    }));
  };

  const isAllSelected = (sectionKey: string) => {
    const sectionClaims = selectedClaims[module]?.[sectionKey] || {};
    const actionsInSection = Array.from(subSections[sectionKey] || new Set());
    return (
      actionsInSection.length > 0 &&
      actionsInSection.every((action) => sectionClaims[action])
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Typography color="#5B6670" variant="h6" fontWeight={600}>
          {module}
        </Typography>
        <button
          className="bg-[#5B6670] p-1 rounded-sm cursor-pointer ml-3"
          onClick={() => setIsOpen(!isOpen)}
        >
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
                          disabled={mode === "view"}
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
                            disabled={mode === "view"}
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
  claims: Claim[]
}



export const ClaimsManager = ({ claims }: dataClaims) => {
  const groupedClaims = groupClaimsByModule(claims);
  const [selectedClaims, setSelectedClaims] = useState<SelectedClaims>({});
  const { setClaims, claims: plantillaClaims } = usePlantillaForm(); // Obtener claims del contexto

  // Inicializar los selectedClaims con los claims de back
  useEffect(() => {
    if ((plantillaClaims?.length ?? 0) > 0) {
      const newSelectedClaims: SelectedClaims = {};

      (plantillaClaims ?? []).forEach(({ claimValue }) => {
        const parts = claimValue.split(".");
        const module = parts[0] ?? "";
        const action = parts[parts.length - 1] ?? "";
        const sectionKey =
          parts.slice(1, parts.length - 1).join(".") || (parts[1] ?? "");

        if (!newSelectedClaims[module]) newSelectedClaims[module] = {};
        if (!newSelectedClaims[module][sectionKey])
          newSelectedClaims[module][sectionKey] = {};
        newSelectedClaims[module][sectionKey][action] = true;
      });
  
      // 💡 Evitamos el bucle infinito comparando estados antes de actualizar
      if (JSON.stringify(selectedClaims) !== JSON.stringify(newSelectedClaims)) {
        setSelectedClaims(newSelectedClaims);
      }
    }
  }, [plantillaClaims]); // Se ejecuta solo si los claims cambian
  


  // Actualizar los claims en el conrext cada vez que selectedClaims cambie
  useEffect(() => {
    const updatedClaims: Claim[] = [];
  
    Object.entries(selectedClaims).forEach(([module, sections]) => {
      Object.entries(sections).forEach(([sectionKey, actions]) => {
        Object.entries(actions).forEach(([action, isChecked]) => {
          if (isChecked) {
            updatedClaims.push({
              claimType: "Action",
              claimValue: `${module}.${sectionKey}.${action}`
            });
          }
        });
      });
    });
  
    // 💡 Evitamos el bucle infinito comparando estados antes de actualizar
    if (JSON.stringify(claims) !== JSON.stringify(updatedClaims)) {
      setClaims(updatedClaims);
    }
  }, [selectedClaims]); // Se ejecuta solo si los claims cambian
  

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        {Object.entries(groupedClaims)
          .slice(0, Math.ceil(Object.entries(groupedClaims).length / 2))
          .map(([module, { subSections }]) => (
            <ModuleSection
              key={module}
              module={module}
              subSections={subSections}
              selectedClaims={selectedClaims}
              setSelectedClaims={setSelectedClaims}
            />
          ))}
      </div>
      <div className="flex-1">
        {Object.entries(groupedClaims)
          .slice(Math.ceil(Object.entries(groupedClaims).length / 2))
          .map(([module, { subSections }]) => (
            <ModuleSection
              key={module}
              module={module}
              subSections={subSections}
              selectedClaims={selectedClaims}
              setSelectedClaims={setSelectedClaims}
            />
          ))}
      </div>
    </div>
  );
};

export const PermissionsForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector((state: RootState) => state.claims.loading)
  const claimsData = useSelector((state: RootState) => state.claims.dataAll)
  const token = Cookies.get("auth-token") || ""

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
        <ClaimsManager claims={claimsData} />
      </CardContent>
    </>
  )
}

