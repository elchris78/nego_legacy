export const generateTimestampedFileName = (
  baseName: string,
  extension: string = "pdf"
): string => {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const DD = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${baseName}_${YYYY}${MM}${DD}_${hh}${mm}${ss}.${extension}`;
};
