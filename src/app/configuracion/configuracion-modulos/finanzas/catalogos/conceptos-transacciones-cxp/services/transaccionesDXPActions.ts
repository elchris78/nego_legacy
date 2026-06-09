import type {
  CreateTransaccionesDXPResponse,
  DeleteTransaccionesDXPResponse,
  GetTransaccionesDXPResponse,
  GetTransaccionDXPByIdResponse,
  UpdateTransaccionesDXPResponse,
  TransaccionesDXPParams,
} from "./transaccionesDXPTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create TransaccionesDXP
export const createTransaccionesDXP = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateTransaccionesDXPResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentaPorPagar`, {
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

// Edit TransaccionesDXP
export const updateTransaccionesDXP = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateTransaccionesDXPResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentaPorPagar/${id}`, {
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

// Delete TransaccionesDXP
export const deleteTransaccionesDXP = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteTransaccionesDXPResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentaPorPagar/${id}`, {
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

// Get TransaccionesDXP 
export const getTransaccionesDXP = async ({
  token,
  params,
}: {
  token: string | undefined;
  params?: TransaccionesDXPParams;
}): Promise<GetTransaccionesDXPResponse> => {
  const queryParams = new URLSearchParams();

  if (params) {
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
      } else if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(
    `${BASE_URL}api/ConceptoTransaccionesCuentaPorPagar?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
};


// Get TransaccionesDXP by ID
export const getTransaccionesDXPById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetTransaccionDXPByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentaPorPagar/${id}`, {
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

// Toggle TransaccionesDXP Status
export const toggleTransaccionesDXPStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateTransaccionesDXPResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentaPorPagar/${id}/status`, {
    method: "PATCH",
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

// Import TransaccionesDXP from Excel (form data)
export const importTransaccionesDXPFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateTransaccionesDXPResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentaPorPagar/import`, {
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


// GET Formas de Pago
export const getFormasPago = async (token: string) => {
  const response = await fetch(
    `${BASE_URL}api/Catalogs/formas-pago`,
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
    value: item.c_FormaPago,
    label: item.descripcion,
  }));
};
