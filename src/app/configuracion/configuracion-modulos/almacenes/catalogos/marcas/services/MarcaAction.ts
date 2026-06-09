// CAMBIAR POR LAS RUTAS CORRECTAS

import type {
  CreateMarcasResponse,
  DeleteMarcasResponse,
  UpdateMarcasResponse,
  GetMarcasResponse,
  GetMarcaResponse,
} from "./MarcasTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Marcas
export const createMarcas = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreateMarcasResponse> => {
  const formData = new FormData();
  formData.append("Nombre", body.Nombre);
  formData.append("Fabricante", body.Fabricante);
  formData.append("FechaVigencia", body.FechaVigencia);
  formData.append("Estatus", body.Estatus);
  if (body.UserProvidedId)
    formData.append("UserProvidedId", body.UserProvidedId);
  if (body.userProvidedPrefix)
    formData.append("UserProvidedPrefix", body.userProvidedPrefix);
  if (body.LogoUrl && typeof body.LogoUrl !== "string") {
    formData.append("LogoUrl", body.LogoUrl); // File
  }

  const response = await fetch(`${BASE_URL}api/Marca`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el Marcas");
  }
  return await response.json();
};

// Edit Marcas
export const updateMarcas = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdateMarcasResponse> => {
  const formData = new FormData();
  formData.append("MarcasId", id ?? "");
  formData.append("Nombre", body.Nombre);
  formData.append("Fabricante", body.Fabricante);
  formData.append("FechaVigencia", body.FechaVigencia);
  formData.append("Estatus", body.Estatus);
  if (body.UserProvidedId)
    formData.append("UserProvidedId", body.UserProvidedId);
  if (body.UserProvidedPrefix)
    formData.append("UserProvidedPrefix", body.UserProvidedPrefix);
  if (body.LogoUrl && typeof body.LogoUrl !== "string") {
    formData.append("LogoUrl", body.LogoUrl); // File
  }

  const response = await fetch(`${BASE_URL}api/Marca/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el Marcas");
  }
  return await response.json();
};

// Get Marcas
export const getMarcas = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetMarcasResponse> => {
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
  const response = await fetch(`${BASE_URL}api/Marca?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las Marcas");
  }

  return await response.json();
};

// Get Marcas by ID
export const getMarcasById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetMarcaResponse> => {
  const response = await fetch(`${BASE_URL}api/Marca/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el Marcas");
  }
  return await response.json();
};

// Delete Marcas
export const deleteMarcas = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<DeleteMarcasResponse> => {
  const response = await fetch(`${BASE_URL}api/Marca/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar el Marcas");
  }
  return await response.json();
};

// Toggle Marcas Status
export const toggleMarcasStatus = async ({
  token,
  id,
  isActive,
}: {
  token: string;
  id: string | null;
  isActive: boolean;
}): Promise<DeleteMarcasResponse> => {
  const response = await fetch(`${BASE_URL}api/Marca/${id}/status`, {
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
      errorData.message || "Error al cambiar el estado del marca"
    );
  }

  return await response.json();
};

// Import Marcas from Excel (form data)
export const importMarcas = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Marca/import`, {
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
