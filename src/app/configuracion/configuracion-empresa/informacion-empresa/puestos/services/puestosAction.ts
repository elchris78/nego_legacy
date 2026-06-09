import type {
  CreatePuestosResponse,
  DeletePuestosResponse,
  UpdatePuestosResponse,
  GetPuestosResponse,
  GetPuestoResponse,
} from "./puestosTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Puesto
export const createPuestos = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreatePuestosResponse> => {
  const response = await fetch(`${BASE_URL}api/Puesto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el Puesto");
  }
  return await response.json();
};

// Edit Puesto
export const updatePuestos = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdatePuestosResponse> => {
  const response = await fetch(`${BASE_URL}api/Puesto/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ PuestoId: id, ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el área");
  }
  return await response.json();
};

// Get Puestos
export const getPuestos = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetPuestosResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Puesto?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las áreas");
  }

  return await response.json();
};

// Get Puesto by ID
export const getPuestosById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetPuestoResponse> => {
  const response = await fetch(`${BASE_URL}api/Puesto/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el área");
  }
  return await response.json();
};

// Delete Puesto
export const deletePuestos = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<DeletePuestosResponse> => {
  const response = await fetch(`${BASE_URL}api/Puesto/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar el Puesto");
  }
  return await response.json();
};

// Toggle Puesto Status
export const togglePuestosStatus = async ({
  token,
  id,
  isActive,
}: {
  token: string;
  id: string | null;
  isActive: boolean;
}): Promise<DeletePuestosResponse> => {
  const response = await fetch(`${BASE_URL}api/Puesto/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(isActive),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al cambiar el estado del área");
  }

  return await response.json();
};

// Import Puestos from Excel (form data)
export const importPuestos = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Puesto/import`, {
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
