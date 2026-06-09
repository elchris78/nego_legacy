export const isValidFileType = (file: File | null): boolean => {
  if (!file) return false;

  const validExtensions = [".pdf"];
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

  return validExtensions.includes(`.${fileExtension}`);
}