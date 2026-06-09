"use client";

import { Switch } from "@/ui/switch";
import { usePlantillaForm } from "./SucursalFormContext";
import { useSearchParams } from "next/navigation";

interface Props {
  section: string;
  subSection: string;
}

const subSectionsPermissions = [
  { label: "Agregar", value: "Crear" },
  { label: "Editar", value: "Editar" },
  { label: "Eliminar", value: "Eliminar" },
  { label: "Cambiar estatus", value: "ToggleStatus" },
];

export const SubSectionToggle = ({ section, subSection }: Props) => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const { claims, setClaims } = usePlantillaForm();

  // Función para manejar el cambio de los permisos
  const handleChangeClaim = (permisoValue: string, checked: boolean) => {
    const newClaimValue = `${section}.${subSection}.${permisoValue}`;

    if (checked) {
      // Asegurarse de que no haya duplicados antes de agregar
      const existingClaim = claims.find(
        (claim) => claim.claimValue === newClaimValue
      );
      if (!existingClaim) {
        setClaims((prevClaims) => [
          ...prevClaims,
          { claimType: "SubSection", claimValue: newClaimValue },
        ]);
      }
    } else {
      // Si se desmarca, eliminamos el claim del estado
      setClaims((prevClaims) =>
        prevClaims.filter((claim) => claim.claimValue !== newClaimValue)
      );
    }
  };

  return (
    <div className="bg-[#F4F3F4] border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap md:justify-between gap-4">
        {subSectionsPermissions.map((permiso) => {
          const newClaimValue = `${section}.${subSection}.${permiso.value}`;
          // Verifica si el permiso ya está en el array de claims
          const isChecked = claims?.some(
            (claim) =>
              claim.claimType === "SubSection" &&
              claim.claimValue === newClaimValue
          );

          return (
            <div
              key={permiso.value}
              className="flex items-center justify-between sm:space-x-8 border rounded-full py-[2px] px-2 bg-white w-full sm:w-auto"
            >
              <span className="text-sm text-gray-600">{permiso.label}</span>
              <Switch
                // Revisar si el valor está en el array de permisos seleccionados
                checked={isChecked}
                onCheckedChange={(checked) => {
                  handleChangeClaim(permiso.value, checked);
                }}
                className="data-[state=checked]:bg-[#3C98CB]"
                aria-label={`Permiso de ${permiso.label.toLowerCase()}`}
                disabled={mode === "view"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
