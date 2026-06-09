import Cookies from "js-cookie";
interface DisconnectPayload {
    userId: string;
}
const urlbase = process.env.NEXT_PUBLIC_AUTH_URL;
export const disconnectUsers = async (payload: DisconnectPayload): Promise<void> => {
    try {
      const token = Cookies.get('auth-token');
      const response = await fetch(`${urlbase}api/UserActivity/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Error al registrar la actividad');
      }
  
      console.log('Actividad registrada correctamente');
    } catch (error) {
      console.error('Error:', error);
    }
  };