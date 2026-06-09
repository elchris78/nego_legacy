import type {
  CreateSellersTypeResponse,
  DeleteSellersTypeResponse,
  GetSellersTypesResponse,
  GetSellerTypeByIdResponse,
  UpdateSellersTypeResponse,
  SellersTypeParams,
} from "./sellersTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Sellers Type
export const createSellersType = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateSellersTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoVendedor`, {
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

// Edit Sellers Type
export const updateSellersType = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateSellersTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoVendedor/${id}`, {
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

// Delete Sellers Type
export const deleteSellersType = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteSellersTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoVendedor/${id}`, {
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

// Get Sellers Types
export const getSellerTypes = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: SellersTypeParams;
}): Promise<GetSellersTypesResponse> => {
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

  const response = await fetch(`${BASE_URL}api/TipoVendedor?${queryParams}`, {
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

// Get Sellers Type by ID
export const getSellersTypeById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetSellerTypeByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoVendedor/${id}`, {
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

// Toggle Sellers Type Status
export const toggleSellersTypeStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateSellersTypeResponse> => {
  const response = await fetch(`${BASE_URL}api/TipoVendedor/${id}/status`, {
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

// Import Sellers Types from Excel (form data)
export const importSellersTypesFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateSellersTypeResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/TipoVendedor/import`, {
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
