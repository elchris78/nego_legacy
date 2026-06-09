import type {
  CreateFabricanteResponse,
  DeleteFabricanteResponse,
  GetFabricantesResponse,
  GetFabricanteByIdResponse,
  UpdateFabricanteResponse,
  FabricanteTypeParams,
  Country,
} from "./fabricantesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Fabricante
export const createFabricante = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateFabricanteResponse> => {
  const response = await fetch(`${BASE_URL}api/Fabricantes`, {
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

// Edit Fabricante
export const updateFabricante = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateFabricanteResponse> => {
  const response = await fetch(`${BASE_URL}api/Fabricantes/${id}`, {
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

// Delete Fabricante
export const deleteFabricante = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteFabricanteResponse> => {
  const response = await fetch(`${BASE_URL}api/Fabricantes/${id}`, {
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

// Get Fabricantes
export const getFabricantes = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: FabricanteTypeParams;
}): Promise<GetFabricantesResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Fabricantes?${queryParams}`, {
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

// Get Fabricante by ID
export const getFabricanteById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetFabricanteByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/Fabricantes/${id}`, {
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

// Toggle Fabricante Status
export const toggleFabricanteStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<UpdateFabricanteResponse> => {
  const response = await fetch(`${BASE_URL}api/Fabricantes/${id}/status`, {
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

// Import Fabricantes from Excel (form data)
export const importFabricantesFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateFabricanteResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Fabricantes/import`, {
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

// Get Countries
export const getCountries = async ({
  token,
}: {
  token: string | undefined;
}): Promise<Country[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/paises`, {
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