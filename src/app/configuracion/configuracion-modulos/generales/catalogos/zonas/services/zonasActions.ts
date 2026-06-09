import type {
  CreateZonaResponse,
  DeleteZonaResponse,
  GetZonaByIdResponse,
  GetZonasResponse,
  UpdateZonaResponse,
  ZonaTypeParams,
} from "./zonasTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Zona
export const createZona = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/zonas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Edit Zona
export const updateZona = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/zonas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Delete Zona
export const deleteZona = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/zonas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Get Zonas
export const getZonas = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: ZonaTypeParams;
}): Promise<GetZonasResponse> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Convertimos a string y eliminamos duplicados convirtiendo a array
      const uniqueValues = Array.from(new Set(value.map(String)));

      if (
        key === "isActive" &&
        uniqueValues.includes("true") &&
        uniqueValues.includes("false")
      ) {
        return; // No agregamos nada a queryParams
      }

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}api/catalogs/zonas?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Get Zona by ID
export const getZonaById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetZonaByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/zonas/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Toggle Zona Status
export const toggleZonaStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/zonas/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Import zonas from file
export const importZonas = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateZonaResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}api/catalogs/zonas/import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};
