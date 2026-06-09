// CAMBIAR POR LAS RUTAS CORRECTAS

import type {
  CreateTypesWarehousesResponse,
  DeleteTypesWarehousesResponse,
  UpdateTypesWarehousesResponse,
  GetTypesWarehousesResponse,
  GetTypesWarehouseResponse,
} from "./typesWarehousesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create TypesWarehouses
export const createTypesWarehouses = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreateTypesWarehousesResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el TypesWarehouses");
  }
  return await response.json();
};

// Edit TypesWarehouses
export const updateTypesWarehouses = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdateTypesWarehousesResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacen/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({  ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el TypesWarehouses");
  }
  return await response.json();
};

// Get TypesWarehouses
export const getTypesWarehouses = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetTypesWarehousesResponse> => {
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
    `${BASE_URL}api/TipoAlmacen?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al obtener las TypesWarehouses"
    );
  }

  return await response.json();
};

// Get TypesWarehouses by ID
export const getTypesWarehousesById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetTypesWarehouseResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacen/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el TipoAlmacen");
  }
  return await response.json();
};

// Delete TypesWarehouses
export const deleteTypesWarehouses = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<DeleteTypesWarehousesResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacen/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al eliminar el TipoAlmacen"
    );
  }
  return await response.json();
};

// Toggle TypesWarehouses Status
export const toggleTypesWarehousesStatus = async ({
  token,
  id,
  isActive,
}: {
  token: string;
  id: string | null;
  isActive: boolean;
}): Promise<DeleteTypesWarehousesResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoAlmacen/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(isActive),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al cambiar el estado del TypesWarehouses"
    );
  }

  return await response.json();
};

// Import TypesWarehouses from Excel (form data)
export const importTypesWarehouses = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/TipoAlmacen/import`, {
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
