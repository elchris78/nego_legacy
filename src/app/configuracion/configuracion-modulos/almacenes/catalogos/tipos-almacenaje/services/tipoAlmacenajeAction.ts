// CAMBIAR POR LAS RUTAS CORRECTAS

import type {
  CreateTiposAlmacenajeResponse,
  DeleteTiposAlmacenajeResponse,
  UpdateTiposAlmacenajeResponse,
  GetTiposAlmacenajeResponse,
  GetTipoAlmacenajeResponse,
} from "./tipoAlmacenaje";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create TiposAlmacenaje
export const createTiposAlmacenaje = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreateTiposAlmacenajeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacenaje`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el TipoAlmacenaje");
  }
  return await response.json();
};

// Edit TiposAlmacenaje
export const updateTiposAlmacenaje = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdateTiposAlmacenajeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacenaje/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({  ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el TipoAlmacenaje");
  }
  return await response.json();
};

// Get TiposAlmacenaje
export const getTiposAlmacenaje = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetTiposAlmacenajeResponse> => {
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
    `${BASE_URL}api/TipoAlmacenaje?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al obtener las TiposAlmacenaje"
    );
  }

  return await response.json();
};

// Get TiposAlmacenaje by ID
export const getTipoAlmacenajeById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetTipoAlmacenajeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacenaje/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el TipoAlmacenaje");
  }
  return await response.json();
};

// Delete TiposAlmacenaje
export const deleteTiposAlmacenaje = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<DeleteTiposAlmacenajeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacenaje/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al eliminar el TipoAlmacenaje"
    );
  }
  return await response.json();
};

// Toggle TiposAlmacenaje Status
export const toggleTiposAlmacenajeStatus = async ({
  token,
  id,
  isActive,
}: {
  token: string;
  id: string | null;
  isActive: boolean;
}): Promise<DeleteTiposAlmacenajeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacenaje/${id}/status`, {
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
      errorData.message || "Error al cambiar el estado del TiposAlmacenaje"
    );
  }

  return await response.json();
};

// Import TiposAlmacenaje from Excel (form data)
export const importTiposAlmacenaje = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/TipoAlmacenaje/import`, {
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
