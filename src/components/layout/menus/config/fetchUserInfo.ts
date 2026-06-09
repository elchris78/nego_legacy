import { getInfo, getInfoUser } from "@/app/admin/datos-perfil/service/getInfo";

export const fetchUserInfo = async () => {
  try {
    const result = await getInfo();

    if (result && result.success) {
      return result;  
    } else {
      console.log("Error en getInfo: ", result.message);
      throw new Error(result.message || "Error al obtener información.");
    }
  } catch (error) {
    console.error("Error al obtener la información del usuario:", error);

    
    try {
      const userResult = await getInfoUser();
      
      if (userResult && userResult.success) {
        return userResult; 
      } else {
        console.error("Error al obtener la información del usuario compartido:", userResult.message);
        throw new Error(userResult.message || "Error al obtener información del usuario compartido.");
      }
    } catch (userError) {
      console.error("Error al obtener la información de usuario compartido:", userError);
      return { success: false, message: "Error al obtener la información del usuario." };
    }
  }
};
