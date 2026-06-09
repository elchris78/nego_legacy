import Cookies from "js-cookie";

const urlbase = process.env.NEXT_PUBLIC_AUTH_URL;

interface DepartmentsNamesResponse {
  success: boolean;
  message: string;
  departments?: { id: number; name: string }[];
  error?: string;
}

export const departmentsNames = async (): Promise<DepartmentsNamesResponse> => {
  try {
    const token = Cookies.get("auth-token");

    if (!token) {
      return {
        success: false,
        message: "No se encontró el token de autenticación",
      };
    }

    const response = await fetch(`${urlbase}NegoAdmin/Departments/departments-names`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return {
        success: false,
        message: errorMessage || "Error en la petición",
      };
    }

    const data = await response.json(); // Se espera que la API devuelva un JSON con los nombres de los departamentos

    return {
      success: true,
      departments: data.departments || undefined,
      message: data.message || undefined,
    };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Error en la petición" };
  }
};
