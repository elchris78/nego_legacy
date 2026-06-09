import type {
  CreateSubZonaResponse,
  DeleteSubZonaResponse,
  GetSubZonaByIdResponse,
  GetSubZonasResponse,
  UpdateSubZonaResponse,
  SubZonaTypeParams,
} from "./subZonasTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create SubZona
export const createSubZona = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateSubZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/subzonas`, {
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

// Edit SubZona
export const updateSubZona = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateSubZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/subzonas/${id}`, {
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

// Delete SubZona
export const deleteSubZona = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteSubZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/subzonas/${id}`, {
    method: "DELETE",
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

// Get SubZonas
export const getSubZonas = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: SubZonaTypeParams;
}): Promise<GetSubZonasResponse> => {
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

  const response = await fetch(`${BASE_URL}api/catalogs/subzonas?${queryParams}`, {
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

// Get SubZona by ID
export const getSubZonaById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetSubZonaByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/subzonas/${id}`, {
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

// Toggle SubZona Status
export const toggleSubZonaStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateSubZonaResponse> => {
  const response = await fetch(`${BASE_URL}api/catalogs/subzonas/${id}/status`, {
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

// Import SubZonas from excel file
export const importSubZonas = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateSubZonaResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}api/catalogs/subzonas/import`, {
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
