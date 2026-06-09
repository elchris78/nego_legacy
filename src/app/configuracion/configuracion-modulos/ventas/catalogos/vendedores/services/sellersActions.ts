import type {
  CreateSellersResponse,
  DeleteSellersResponse,
  GetSellersResponse,
  GetSellerByIdResponse,
  UpdateSellersResponse,
  SellersParams,
} from "./sellersTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Sellers
export const createSellers = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateSellersResponse> => {
  const response = await fetch(`${BASE_URL}api/Vendedor`, {
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

// Edit Sellers
export const updateSellers = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateSellersResponse> => {
  const response = await fetch(`${BASE_URL}api/Vendedor/${id}`, {
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

// Delete Sellers 
export const deleteSellers = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteSellersResponse> => {
  const response = await fetch(`${BASE_URL}api/Vendedor/${id}`, {
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

// Get Sellers 
export const getSeller = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: SellersParams;
}): Promise<GetSellersResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Vendedor/detailed?${queryParams}`, {
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

// Get Sellers by ID
export const getSellersById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetSellerByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/Vendedor/${id}`, {
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

// Toggle Sellers Status
export const toggleSellersStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateSellersResponse> => {
  const response = await fetch(`${BASE_URL}api/Vendedor/${id}/status`, {
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

// Import Sellers from Excel (form data)
export const importSellersFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateSellersResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Vendedor/import`, {
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
