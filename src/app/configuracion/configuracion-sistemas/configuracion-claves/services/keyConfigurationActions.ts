import type {
  CreateKeyConfigurationResponse,
  DeleteKeyConfigurationResponse,
  GetKeyConfigurationResponse,
  GetKeyConfiguratiByIdResponse,
  UpdateKeyConfigurationResponse,
  KeyConfigurationParams,
  GetCatsType,
  GetCatalogoClave,
  GetCatalogoClaveParams,
} from "./keyConfigurationTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create KeyConfiguration 
export const createKeyConfiguration = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateKeyConfigurationResponse> => {
  const response = await fetch(`${BASE_URL}api/CatalogConfiguration`, {
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

// Edit KeyConfiguration
export const updateKeyConfiguration = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateKeyConfigurationResponse> => {
  const response = await fetch(`${BASE_URL}api/CatalogConfiguration/`, {
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

// Delete KeyConfiguration
export const deleteKeyConfiguration = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: GetCatalogoClaveParams;
}): Promise<DeleteKeyConfigurationResponse> => {
  const response = await fetch(`${BASE_URL}api/CatalogConfiguration?catalogo=${params.catalogo}`, {
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

// Get KeyConfiguration
export const getKeyConfiguration = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: KeyConfigurationParams;
}): Promise<GetKeyConfigurationResponse> => {
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

  const response = await fetch(`${BASE_URL}api/CatalogConfiguration?${queryParams}`, {
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

// Get KeyConfiguration by ID
export const getKeyConfigurationById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetKeyConfiguratiByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/CatalogConfiguration/${id}`, {
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


export const getCatsType = async ({
  token,
}: {
  token: string | undefined;
}): Promise<GetCatsType> => {
  const response = await fetch(`${BASE_URL}api/CatalogConfiguration/options`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los catálogos y tipos de clave');
  }

  const data = await response.json();

  return data as GetCatsType;
};

export const GetCatalogoClaves = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: GetCatalogoClaveParams;
}): Promise<GetCatalogoClave> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Convertimos a string y eliminamos duplicados
      const uniqueValues = Array.from(new Set(value.map(String)));

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}api/CatalogConfiguration/catalogo?${queryParams}`, {
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
