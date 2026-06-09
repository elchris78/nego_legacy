import Cookies from "js-cookie";

const urlbase = process.env.NEXT_PUBLIC_AUTH_URL;

export interface SubmodulesResponse {
  success: boolean;
  message?: string;
  modules?: ModulesSubmodules;
  error?: string;
}

export interface ModulesSubmodules {
  [key: string]: string[];
}

export const submodulesParams = async (
  body: string[]
): Promise<SubmodulesResponse> => {
  try {
    const token = Cookies.get("auth-token");

    if (!token) {
      return {
        success: false,
        error: "No se encontró el token de autenticación",
      };
    }

    const response = await fetch(
      `${urlbase}api/UserActivity/submodules-for-modules`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      return { success: false, error: errorMessage || "Error en la petición" };
    }

    const data = await response.json(); // Se espera que la API devuelva un JSON con un array de submódulos

    return data;
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Error en la petición" };
  }
};
