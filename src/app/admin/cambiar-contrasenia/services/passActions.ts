import Cookies from 'js-cookie';
import {PassUpdateTypes} from './passTypes';

export const changePassword = async ({ oldPassword, newPassword, confirmPassword }: PassUpdateTypes) => {
  const token = Cookies.get('auth-token');
  
  if (!token) {
    return { success: false, message: 'Token de autenticación no encontrado. Inicie sesión nuevamente.' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: result.message || 'Contraseña cambiada con éxito.' };
    } else {
      return { success: false, message: result.message || 'Error al cambiar la contraseña' };
    }
  } catch (error) {
    
    console.error('Error al cambiar la contraseña:', error);
    return { success: false, message: 'Error de conexión. Intente nuevamente.' };
  }
};
