export const selectedSecondLevel = (pathname: string, itemTitle: string): boolean => {
    return (
      (pathname.includes("control-usuarios") && !pathname.includes("bitacora-empresa") && itemTitle === "Control de usuarios") ||
      (pathname.includes("catalogos-generales") && itemTitle === "Catálogos generales") ||
      (pathname.includes("bitacora-empresa") && itemTitle === "Bitácora de la empresa")
    );
  };

  export const selectedThirdLevel = (pathname: string, itemTitle: string): boolean => {
    const rutaSeccionada = pathname.split("/").filter(Boolean);

    const normalizeString = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return (
      ((normalizeString(rutaSeccionada[rutaSeccionada.length - 1]) === normalizeString("plantillas"))  && itemTitle === "Plantillas de perfiles"  ) ||
      ((normalizeString(rutaSeccionada[rutaSeccionada.length - 1]) === normalizeString("usuarios")) && itemTitle === "Usuarios") || 
      ((normalizeString(rutaSeccionada[rutaSeccionada.length - 1]) === normalizeString("usuarios-sistema")) && itemTitle === "Usuarios dentro del sistema")  ||
      ((normalizeString(rutaSeccionada[rutaSeccionada.length - 1]) === normalizeString("sucursales")) && itemTitle === "Sucursales")  ||
      ((normalizeString(rutaSeccionada[rutaSeccionada.length - 1]) === normalizeString("departamentos-empresa")) && itemTitle === "Departamentos de la empresa" ) 
      
    );
  };
  