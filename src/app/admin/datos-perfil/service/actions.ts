import Cookies from 'js-cookie';
import { TypeUser } from './typeUser';

export const updateUserProfile = async ({ fullName, gender, dateOfBirth, phoneNumber, profilePicture }: TypeUser) => {
  const token = Cookies.get('auth-token');
  
  if (!token) {
    return { success: false, message: 'Token de autenticación no encontrado. Inicie sesión nuevamente.' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/UserRegistration/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
        gender,
        dateOfBirth,
        phoneNumber,
        profilePicture,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: result.message || 'Perfil actualizado con éxito.' };
    } else {
      return { success: false, message: result.message || 'Error al actualizar el perfil.' };
    }
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return { success: false, message: 'Error de conexión. Intente nuevamente.' };
  }
};

export const updateUserProfileUser = async ({ fullName, gender, dateOfBirth, phoneNumber, profilePicture }: TypeUser) => {
  const token = Cookies.get('auth-token');
  
  if (!token) {
    return { success: false, message: 'Token de autenticación no encontrado. Inicie sesión nuevamente.' };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
        gender,
        dateOfBirth,
        phoneNumber,
        profilePicture,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: result.message || 'Perfil actualizado con éxito.' };
    } else {
      return { success: false, message: result.message || 'Error al actualizar el perfil.' };
    }
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return { success: false, message: 'Error de conexión. Intente nuevamente.' };
  }
};