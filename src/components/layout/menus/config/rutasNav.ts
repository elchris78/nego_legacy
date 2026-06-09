export const getMenuItemsByUserType = (userType: string | null, handleLogout: () => void) => {

  if (!userType || userType.toLowerCase() === "compartido" || userType.toLowerCase() === "exclusivo" || userType === "Admin") {
    return [
      { label: "Datos del perfil", href: "/datos-perfil" },
      { label: "Cambiar contraseña", href: "/cambiar-contrasenia" },
      { label: "Cerrar sesión", action: handleLogout },
    ];
  }

  return [];
};

export const getMenuItemsByAdmin = (userType: string | null, handleLogout: () => void) => {
  if (userType === "Admin") {
    return [
      { label: "Datos del perfil", href: "/admin/datos-perfil" },
      { label: "Cambiar contraseña", href: "/admin/cambiar-contrasenia" },
      { label: "Cerrar sesión", action: handleLogout },
    ];
  } 
  
  if (!userType || userType.toLowerCase() === "compartido" || userType.toLowerCase() === "exclusivo") {
    return [
      { label: "Datos del perfil", href: "/datos-perfil" },
      { label: "Cambiar contraseña", href: "/cambiar-contrasenia" },
      { label: "Cerrar sesión", action: handleLogout },
    ];
  }

  return [];
};

export const getNavigationByUserType = (userType: string | null) => {
  if (!userType) return [];

  if (userType === "Admin") {
    return [
      {
        segment: "Datos de perfil",
        title: "Datos de perfil",
        icon: undefined,
        src: "/admin/datos-perfil",
      },
      {
        segment: "Cambiar contraseña",
        title: "Cambiar contraseña",
        icon: undefined,
        src: "/admin/cambiar-contrasenia",
      },
    ];
  } else if (userType.toLowerCase() === "compartido" || userType?.toLowerCase() === "exclusivo") {
    return [
      {
        segment: "Datos de perfil",
        title: "Datos de perfil",
        icon: undefined,
        src: "/datos-perfil",
      },
      {
        segment: "Cambiar contraseña",
        title: "Cambiar contraseña",
        icon: undefined,
        src: "/cambiar-contrasenia",
      },
    ];
  }

  return [];
};


