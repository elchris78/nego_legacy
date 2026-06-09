import { NAVIGATION } from "./rutasConfiguracion";
import { NAVIGATIONCOMPRAS } from "./rutasCompras"; 

export const filterNavigation = (navigation: any, claims: any, isAdmin?: boolean) => {
  if (isAdmin) {
    // Lógica para admin (primera versión)
    return navigation.filter((item: any) => {
      if (!item.claimValue) return true; // Si no requiere claim, incluirlo siempre

      // Verifica si existe algún claim que comience con el prefijo del claimValue
      return claims.some((claim: any) =>
        claim.claimValue.startsWith(`${item.claimValue}.`)
      );
    });
  } else {
    // Lógica para otros usuarios (segunda versión)
    return navigation
      .filter((item: any) => {
        if (!claims) return false; // Evita el error si claims es nulo o indefinido
        return (
          !item.claimValue ||
          claims.some((claim: any) => claim.claimValue === item.claimValue)
        );
      })
      .map((item: any) => ({
        ...item,
        children: item.children ? filterNavigation(item.children, claims, false) : undefined,
      }));
  }
};


export const getNavigationByPath = (pathname: string) => {
  if (pathname.startsWith("/compras")) {
    return NAVIGATIONCOMPRAS;
  }

  // agregar más rutas cuando existan
  return NAVIGATION;
};