import type {
  CreateClientTypeResponse,
  DeleteClientTypeResponse,
  GetClientTypesResponse,
  GetClientTypeByIdResponse,
  UpdateClientTypeResponse,
  ClientTypeParams,
} from "./clientTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Client Type
export const createClientType = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateClientTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoCliente`, {
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

// Edit Client Type
export const updateClientType = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateClientTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoCliente/${id}`, {
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

// Delete Client Type
export const deleteClientType = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteClientTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoCliente/${id}`, {
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

// Get Client Types
export const getClientTypes = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: ClientTypeParams;
}): Promise<GetClientTypesResponse> => {
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

  const response = await fetch(`${BASE_URL}api/TipoCliente?${queryParams}`, {
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

// Get Client Type by ID
export const getClientTypeById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetClientTypeByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoCliente/${id}`, {
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

// Toggle Client Type Status
export const toggleClientTypeStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateClientTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoCliente/${id}/status`, {
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

// Import Client Types from Excel (form data)
export const importClientTypesFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateClientTypeResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/TipoCliente/import`, {
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
