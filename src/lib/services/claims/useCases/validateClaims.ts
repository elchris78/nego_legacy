import store, { RootState } from "@/store"; // Asegúrate de que la ruta sea correcta

/**
 * Valida si un claim existe en los datos obtenidos.
 *
 * @param claimType - El tipo de claim a validar.
 * @param claimValue - El valor del claim a validar.
 * @returns {boolean} - Retorna true si el claim existe, de lo contrario false.
 */

export const validateClaims = (claimType: string, claimValue: string): boolean => {
  const state: RootState = store.getState();
  const claims = state.claims.data;

  return claims?.some(
    (claim) => claim.claimType === claimType && claim.claimValue === claimValue
  );
};