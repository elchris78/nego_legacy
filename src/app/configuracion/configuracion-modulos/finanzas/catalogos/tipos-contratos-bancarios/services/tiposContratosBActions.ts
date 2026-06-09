import type {
  CreateTiposContratosBResponse,
  DeleteTiposContratosBResponse,
  GetTiposContratosBResponse,
  GetTiposContratosBByIdResponse,
  UpdateTiposContratosBResponse,
  TiposContratosBParams,
} from "./tiposContratosBTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create TiposContratosB
export const createTiposContratosB = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateTiposContratosBResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoContratosBancarios`, {
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

// Edit TiposContratosB
export const updateTiposContratosB = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateTiposContratosBResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoContratosBancarios/${id}`, {
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

// Delete TiposContratosB
export const deleteTiposContratosB = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteTiposContratosBResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoContratosBancarios/${id}`, {
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

// Get TiposContratosB 
export const getTiposContratosB = async ({
  token,
  params,
}: {
  token: string | undefined;
  params?: TiposContratosBParams;
}): Promise<GetTiposContratosBResponse> => {
  const queryParams = new URLSearchParams();

  if (params) {
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
      } else if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(
    `${BASE_URL}api/TipoContratosBancarios?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
};


// Get TiposContratosB by ID
export const getTiposContratosBById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetTiposContratosBByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoContratosBancarios/${id}`, {
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

// Toggle TiposContratosB Status
export const toggleTiposContratosBStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateTiposContratosBResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoContratosBancarios/${id}/status`, {
    method: "PUT",
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


// Import TiposContratosB from Excel (form data)
export const importTiposContratosBFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateTiposContratosBResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/TipoContratosBancarios/import`, {
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
