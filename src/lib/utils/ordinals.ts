import ordinales from "ordinales-js";

/**
 * Devuelve el número ordinal en español con ajuste para sustantivos.
 * @param n - El número a convertir a ordinal.
 * @param noun - El sustantivo al que se le adjunta el ordinal.
 * @param genero - El género del sustantivo ('m' para masculino, 'f' para femenino).
 * @returns El número ordinal ajustado con el sustantivo.
 */
export function ordinalConAjuste(
  n: number,
  noun: string,
  genero: "m" | "f" = "m"
): string {
  let ord = ordinales.toOrdinal(n, genero);

  // Si va antes de un sustantivo masculino singular
  if (genero === "m" && n === 1) {
    ord = "primer";
  } else if (genero === "m" && n === 3) {
    ord = "tercer";
  }
  return `${capitalize(ord)} ${noun}`;
}

/**
 * Capitaliza la primera letra de una cadena.
 * @param s - La cadena a capitalizar.
 * @returns La cadena con la primera letra en mayúscula.
 */
export function capitalize(s: string) {
  return s && String(s[0]).toUpperCase() + String(s).slice(1);
}
