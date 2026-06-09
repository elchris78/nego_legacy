import Cookies from "js-cookie";
import { modulesSubmodules } from "./departmentsTypes";

const urlbase = process.env.NEXT_PUBLIC_AUTH_URL;

interface ModulesSubmodulesResponse {
  success: boolean;
  modules?: string[];
  submodules?: string[];
  error?: string;
}

export const modulesParams = async (
  payload: modulesSubmodules
): Promise<ModulesSubmodulesResponse> => {
  try {
    const token = Cookies.get("auth-token");

    if (!token) {
      return { success: false, error: "No se encontró el token de autenticación" };
    }

    // Construcción de los parámetros de la URL
    const params = new URLSearchParams();

    if (payload.modules && !payload.submodules) {
      params.append("param", payload.modules.join(","));
    } else if (payload.submodules && !payload.modules) {
      params.append("param", payload.submodules.join(","));
    } else {
      return { success: false, error: "Solo se puede enviar 'modules' o 'submodules', pero no ambos." };
    }

    const response = await fetch(
      `${urlbase}api/UserActivity/modules-submodules?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      return { success: false, error: errorMessage || "Error en la petición" };
    }

    const data = await response.json(); // Se espera que la API devuelva un JSON con módulos o submódulos

    return {
      success: true,
      modules: data.modules || undefined,
      submodules: data.submodules || undefined,
    };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Error en la petición" };
  }
};
