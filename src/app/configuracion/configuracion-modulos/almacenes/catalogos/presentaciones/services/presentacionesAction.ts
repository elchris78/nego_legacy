// CAMBIAR POR LAS RUTAS CORRECTAS

import type {
  CreatePresentacionesResponse,
  DeletePresentacionesResponse,
  UpdatePresentacionesResponse,
  GetPresentacionesResponse,
  GetPresentacionResponse,
} from "./presentacionesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Presentaciones
export const createPresentaciones = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreatePresentacionesResponse> => {
  const response = await fetch(`${BASE_URL}api/Presentacion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el Presentacion");
  }
  return await response.json();
};

// Edit Presentaciones
export const updatePresentaciones = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdatePresentacionesResponse> => {
  const response = await fetch(`${BASE_URL}api/Presentacion/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ PresentacionId: id, ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el Presentacion");
  }
  return await response.json();
};

// Get Presentaciones
export const getPresentaciones = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetPresentacionesResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Presentacion?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las Presentacion");
  }

  return await response.json();
};

// Get Presentaciones by ID
export const getPresentacionesById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetPresentacionResponse> => {
  const response = await fetch(`${BASE_URL}api/Presentacion/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el Presentacion");
  }
  return await response.json();
};

// Delete Presentaciones
export const deletePresentaciones = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<DeletePresentacionesResponse> => {
  const response = await fetch(`${BASE_URL}api/Presentacion/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar el Presentacion");
  }
  return await response.json();
};

// Toggle Presentaciones Status
export const togglePresentacionesStatus = async ({
  token,
  id,
  isActive,
}: {
  token: string;
  id: string | null;
  isActive: boolean;
}): Promise<DeletePresentacionesResponse> => {
  const response = await fetch(`${BASE_URL}api/Presentacion/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(isActive),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al cambiar el estado del Presentacion"
    );
  }

  return await response.json();
};

// Import Presentaciones from Excel (form data)
export const importPresentaciones = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Presentacion/import`, {
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
