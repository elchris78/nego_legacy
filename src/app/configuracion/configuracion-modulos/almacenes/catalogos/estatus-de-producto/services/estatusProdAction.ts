// CAMBIAR POR LAS RUTAS CORRECTAS

import type {
  CreateEstatusResponse,
  DeleteEstatusResponse,
  UpdateEstatusResponse,
  GetEstatusResponse,
  GetEstatuResponse,
} from "./estatusProdTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create EstatusProducto
export const createEstatusProd = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreateEstatusResponse> => {
  const response = await fetch(`${BASE_URL}api/EstatusProducto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el EstatusProducto");
  }
  return await response.json();
};

// Edit EstatusProd
export const updateEstatusProd = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdateEstatusResponse> => {
  const response = await fetch(`${BASE_URL}api/EstatusProducto/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ EstatusProductoId: id, ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el EstatusProducto");
  }
  return await response.json();
};

// Get EstatusProd
export const getEstatusProd = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetEstatusResponse> => {
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
    `${BASE_URL}api/EstatusProducto?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al obtener las EstatusProducto"
    );
  }

  return await response.json();
};

// Get EstatusProd by ID
export const getEstatusProdById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetEstatuResponse> => {
  const response = await fetch(`${BASE_URL}api/EstatusProducto/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el EstatusProducto");
  }
  return await response.json();
};

// Delete EstatusProd
export const deleteEstatusProd = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<DeleteEstatusResponse> => {
  const response = await fetch(`${BASE_URL}api/EstatusProducto/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al eliminar el EstatusProducto"
    );
  }
  return await response.json();
};

// Toggle EstatusProd Status
export const toggleEstatusProdStatus = async ({
  token,
  id,
  isActive,
}: {
  token: string;
  id: string | null;
  isActive: boolean;
}): Promise<DeleteEstatusResponse> => {
  const response = await fetch(`${BASE_URL}api/EstatusProducto/${id}/status`, {
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
      errorData.message || "Error al cambiar el estado del EstatusProducto"
    );
  }

  return await response.json();
};

// Import EstatusProd from Excel (form data)
export const importEstatusProd = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/EstatusProducto/import`, {
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
