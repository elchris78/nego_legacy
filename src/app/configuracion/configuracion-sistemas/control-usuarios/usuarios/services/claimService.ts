import { fetchGetRoleTemplateId } from "./usersActions";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface Claim {
  claimType: string;
  claimValue: string;
}

interface Option {
  label: string;
  value: string;
}

/**
 * Obtiene y combina los claims de múltiples plantillas de roles.
 * @param selectedPlantillas - Lista de plantillas seleccionadas.
 * @returns Promesa con el arreglo de claims combinados.
 */
export const getClaimsFromPlantillas = async (selectedPlantillas: Option[]): Promise<Claim[]> => {
  const token = Cookies.get("auth-token");

  if (!token) {
    toast.error("Error: No se encontró un token de autenticación.");
    return [];
  }

  try {
    // Llamadas a la API en paralelo para cada plantilla seleccionada
    const claimsArray = await Promise.all(
      selectedPlantillas.map(async (option) => {
        try {
          const response = await fetchGetRoleTemplateId({
            token,
            roleTemplateId: option.value,
          });

          return response.claims.map((claim: any) => ({
            claimType: claim.claimType,
            claimValue: claim.claimValue,
          }));
        } catch (error: any) {
          toast.error(error.message || "Error al obtener los permisos de la plantilla.");
          return []; // Si hay error, devuelve un array vacío
        }
      })
    );

    // Combinar todos los claims en un solo array
    return claimsArray.flat();
  } catch (error) {
    console.error("Error al procesar los claims:", error);
    return [];
  }
};
