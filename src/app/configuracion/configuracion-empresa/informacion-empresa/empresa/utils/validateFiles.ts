/**
 * Valida un archivo según extensiones permitidas y tamaño máximo.
 * @param file Archivo a validar
 * @param validExtensions Array de extensiones permitidas (ej: ['.png', '.jpg'])
 * @param maxSizeInBytes Tamaño máximo en bytes
 * @returns boolean
 */
export const isValidFile = (
  file: File | null,
  validExtensions: string[],
  maxSizeInBytes: number
): boolean => {
  if (!file) return false;

  const fileExtension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
  const isValidExtension = validExtensions.includes(fileExtension);
  const isValidSize = file.size <= maxSizeInBytes;

  return isValidExtension && isValidSize;
};
