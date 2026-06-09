import { GetSatCatalogResponse } from "./CatalogsTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// GET /api/Catalogs/catalogos
export const getCatalogsSat = async (
  token: string
): Promise<GetSatCatalogResponse[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/catalogos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los catálogos");
  }

  const data = await response.json();
  return data;
};

// GET /api/Catalogs/export
export const getCatalogsSatExport = async (
  token: string | undefined,
  params?: { catalog: string; format: string }
): Promise<Blob> => {
  const queryString = params
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
    : "";

  const response = await fetch(`${BASE_URL}api/Catalogs/export${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el catálogo");
  }

  const data = await response.blob();
  return data;
};
