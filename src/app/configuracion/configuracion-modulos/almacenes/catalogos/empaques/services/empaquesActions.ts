import type {
  CreateEmpaqueResponse,
  DeleteEmpaqueResponse,
  GetEmpaquesResponse,
  GetEmpaqueByIdResponse,
  UpdateEmpaqueResponse,
  EmpaqueTypeParams,
  UnidadPesoSat
} from "./empaquesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Empaque
export const createEmpaque = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateEmpaqueResponse> => {
  const response = await fetch(`${BASE_URL}api/Empaque`, {
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

// Edit Empaque
export const updateEmpaque = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateEmpaqueResponse> => {
  const response = await fetch(`${BASE_URL}api/Empaque/${id}`, {
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

// Delete Empaque
export const deleteEmpaque = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteEmpaqueResponse> => {
  const response = await fetch(`${BASE_URL}api/Empaque/${id}`, {
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

// Get Empaques
export const getEmpaques = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: EmpaqueTypeParams;
}): Promise<GetEmpaquesResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Empaque?${queryParams}`, {
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

// Get Empaque by ID
export const getEmpaqueById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetEmpaqueByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/Empaque/${id}`, {
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

// Toggle Empaque Status
export const toggleEmpaqueStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateEmpaqueResponse> => {
  const response = await fetch(`${BASE_URL}api/Empaque/${id}/status`, {
    method: "PUT",
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

// Import Empaques from Excel (form data)
export const importEmpaques = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateEmpaqueResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Empaque/import`, {
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

// Get Unidad Peso SAT
export const getUnidadPesoSat = async ({
  token,
}: {
  token: string | undefined;
}): Promise<UnidadPesoSat[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/unidades-peso`, {
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
