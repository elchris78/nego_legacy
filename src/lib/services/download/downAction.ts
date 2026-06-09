import Cookies from "js-cookie";
import { UserActivityPayload } from "./downTypes";

const urlbase = process.env.NEXT_PUBLIC_AUTH_URL;
export const registerUserActivity = async (payload: UserActivityPayload): Promise<void> => {
    try {
      const token = Cookies.get('auth-token');
      const response = await fetch(`${urlbase}api/UserActivity/register-action`, {
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

export const reactivateUser = async () => {
  try{
    const token = Cookies.get('auth-token');
    const response = await fetch(`${urlbase}api/UserActivity/reactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al registrar la actividad');
    }
    console.log('activado correctamente');
  } catch (error) {
    console.error('Error:', error);
  }
} 
  