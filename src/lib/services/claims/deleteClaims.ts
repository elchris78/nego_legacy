import Cookies from "js-cookie";

interface DeleteClaimsResponse {
    success: boolean;
    message: string;
  }
  
  const BASE_URL_ADMIN = process.env.NEXT_PUBLIC_BACKEND_URL;
  const BASE_URL_AUTH = process.env.NEXT_PUBLIC_AUTH_URL;
  
  export const deleteUserClaims = async (userId: string, companyID: number): Promise<DeleteClaimsResponse> => {
    try {
    const token = Cookies.get("auth-token") || "";
  
      if (!token) {
        throw new Error("No se encontró el token.");
      }
  
      const response = await fetch(`${BASE_URL_ADMIN}api/AdminUsers/delete-claims/${userId}/${companyID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data: DeleteClaimsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar permisos:', error);
      return {
        success: false,
        message: 'Error al conectar con el servidor.',
      };
    }
  };

  export const deleteUserClaimsAuth = async (userId: string): Promise<DeleteClaimsResponse> => {
    try {
    const token = Cookies.get("auth-token") || "";
  
      if (!token) {
        throw new Error("No se encontró el token.");
      }
  
      const response = await fetch(`${BASE_URL_AUTH}api/Users/delete-claims/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data: DeleteClaimsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al eliminar permisos:', error);
      return {
        success: false,
        message: 'Error al conectar con el servidor.',
      };
    }
  };
  