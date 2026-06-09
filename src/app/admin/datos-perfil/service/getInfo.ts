import Cookies from 'js-cookie';

export const getInfo = async () => {
  const token = Cookies.get('auth-token');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/getme`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
    });

    const result = await response.json();
    Cookies.set('idAdmin', result.id, { secure: true });

    if (response.ok && result.success) {
      return { success: true, data: result };
    } else {
      return { success: false, message: result.message || 'Error al obtener los datos del usuario.' };
    }
  } catch (error) {
    return { success: false, message: 'Error de conexión. Intente nuevamente.' };
  }
};

export const getInfoUser = async () => {
  const token = Cookies.get('auth-token');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/getme`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    Cookies.set('idUser', result.id, { secure: true });

    if (response.ok && result.success) {
      return { success: true, data: result };
    } else {
      return { success: false, message: result.message || 'Error al obtener los datos del usuario.' };
    }
  } catch (error) {
    return { success: false, message: 'Error de conexión. Intente nuevamente.' };
  }
};
