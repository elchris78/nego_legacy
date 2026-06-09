// CAMBIAR POR LAS RUTAS CORRECTAS

import type {
  CreateCategoriesResponse,
  DeleteCategoriesResponse,
  UpdateCategoriesResponse,
  GetCategoriesResponse,
  GetCategorieResponse,
  CategoriesParams,
} from "./categoriesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create eCategories
export const createCategories = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreateCategoriesResponse> => {
  const response = await fetch(`${BASE_URL}api/CategoriaProducto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el Categories");
  }
  return await response.json();
};

export const createSubCategories = async ({
  token,
  body,
  parentId
}: {
  token: string;
  body: any;
  parentId: string | null;
}): Promise<CreateCategoriesResponse> => {
  const response = await fetch(`${BASE_URL}api/CategoriaProducto/${parentId}/subcategorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el Categories");
  }
  return await response.json();
};

// Edit Categories
export const updateCategories = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdateCategoriesResponse> => {
  const response = await fetch(`${BASE_URL}api/CategoriaProducto/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({  ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el Categories");
  }
  return await response.json();
};

// Get Categories
export const getCategories = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: CategoriesParams;
}): Promise<GetCategoriesResponse> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Eliminar duplicados y convertir a string
      const uniqueValues = Array.from(new Set(value.map(String)));
      if (
        key === "isActive" &&
        uniqueValues.includes("true") &&
        uniqueValues.includes("false")
      ) {
        return; // No agregamos nada a queryParams
      }

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}api/CategoriaProducto?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las CategoriaProducto");
  }

  return await response.json();
};


// Get Categories by ID
export const getCategoriesById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetCategorieResponse> => {
  const response = await fetch(`${BASE_URL}api/CategoriaProducto/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el Categories");
  }
  return await response.json();
};

// Delete Categories
export const deleteCategories = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteCategoriesResponse> => {
  const response = await fetch(`${BASE_URL}api/CategoriaProducto/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar el Categories");
  }
  return await response.json();
};

// Toggle Categories Status
export const toggleCategoriesStatus = async ({
  token,
  id,
  isActive,
  activateSubcategories,
}: {
  token: string;
  id: string | null;
  isActive: boolean;
  activateSubcategories: boolean;
}): Promise<DeleteCategoriesResponse> => {
  const response = await fetch(
    `${BASE_URL}api/CategoriaProducto/${id}/status?activateSubcategories=${activateSubcategories}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isActive),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al cambiar el estado del Categories");
  }

  return await response.json();
};


// Import Categories from Excel (form data)
export const importCategories = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/CategoriaProducto/import`, {
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