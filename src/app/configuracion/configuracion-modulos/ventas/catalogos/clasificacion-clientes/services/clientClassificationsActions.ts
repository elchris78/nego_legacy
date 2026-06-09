import type {
  CreateClientClassificationResponse,
  DeleteClientClassificationResponse,
  GetClientClassificationResponse,
  GetClientClassificationsResponse,
  UpdateClientClassificationResponse,
} from "./clientesClassificationTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Client Classification
export const createClientClassification = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateClientClassificationResponse> => {
  const response = await fetch(`${BASE_URL}api/ClasificacionCliente`, {
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

// Edit Client Classification
export const updateClientClassification = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateClientClassificationResponse> => {
  const response = await fetch(`${BASE_URL}api/ClasificacionCliente/${id}`, {
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

// Get Client Classifications
export const getClientClassifications = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetClientClassificationsResponse> => {
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

  const response = await fetch(
    `${BASE_URL}api/ClasificacionCliente?${queryParams}`,
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

// Get Client Classification
export const getClientClassification = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetClientClassificationResponse> => {
  const response = await fetch(`${BASE_URL}api/ClasificacionCliente/${id}`, {
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

// Delete Client Classification
export const deleteClientClassification = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteClientClassificationResponse> => {
  const response = await fetch(`${BASE_URL}api/ClasificacionCliente/${id}`, {
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

// Toggle Client Classification Status
export const toggleClientClassificationStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteClientClassificationResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ClasificacionCliente/${id}/status`,
    {
      method: "PUT",
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

// Import Client Classifications from Excel (form data)
export const importClientClassifications = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateClientClassificationResponse> => {
  const formData = new FormData();
  formData.append("File", file);
  
  const response = await fetch(`${BASE_URL}api/ClasificacionCliente/import`, {
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
