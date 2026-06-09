import type {
  CreateMonedasResponse,
  DeleteMonedasResponse,
  GetMonedasResponse,
  GetMonedaByIdResponse,
  UpdateMonedasResponse,
  MonedasParams,
} from "./monedasTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Monedas
export const createMonedas = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateMonedasResponse> => {
  const response = await fetch(`${BASE_URL}api/Monedas`, {
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

// Edit Monedas
export const updateMonedas = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateMonedasResponse> => {
  const response = await fetch(`${BASE_URL}api/Monedas/${id}`, {
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

// Delete Monedas
export const deleteMonedas = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteMonedasResponse> => {
  const response = await fetch(`${BASE_URL}api/Monedas/${id}`, {
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

// Get Monedas
export const getMonedas = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: MonedasParams;
}): Promise<GetMonedasResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Monedas?${queryParams}`, {
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

// Get Monedas by ID
export const getMonedasById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetMonedaByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/Monedas/${id}`, {
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

// Toggle Monedas Status
export const toggleMonedasStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateMonedasResponse> => {
  const response = await fetch(`${BASE_URL}api/Monedas/${id}/status`, {
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

// Import Monedas from Excel (form data)
export const importMonedasFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateMonedasResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Monedas/import`, {
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

// GET Monedas sat
export const getMonedasCat = async (token: string) => {
  const response = await fetch(
    `${BASE_URL}api/Catalogs/monedas`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw await response.json();
  const data = await response.json();
  return data.map((item: any) => ({
    value: item.c_Moneda,
    label: item.descripcion,
  }));
};
