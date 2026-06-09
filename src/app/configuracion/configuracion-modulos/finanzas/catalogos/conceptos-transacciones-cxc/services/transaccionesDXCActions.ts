import type {
  CreateTransaccionesDXCResponse,
  DeleteTransaccionesDXCResponse,
  GetTransaccionesDXCResponse,
  GetTransaccionDXCByIdResponse,
  UpdateTransaccionesDXCResponse,
  TransaccionesDXCParams,
} from "./transaccionesDXCTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create TransaccionesDXC
export const createTransaccionesDXC = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateTransaccionesDXCResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentasPorCobrar`, {
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

// Edit TransaccionesDXC
export const updateTransaccionesDXC = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateTransaccionesDXCResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentasPorCobrar/${id}`, {
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

// Delete TransaccionesDXC 
export const deleteTransaccionesDXC = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteTransaccionesDXCResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentasPorCobrar/${id}`, {
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

// Get TransaccionesDXC 
export const getTransaccionesDXC = async ({
  token,
  params,
}: {
  token: string | undefined;
  params?: TransaccionesDXCParams;
}): Promise<GetTransaccionesDXCResponse> => {
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
    `${BASE_URL}api/ConceptoTransaccionesCuentasPorCobrar?${queryParams}`,
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


// Get TransaccionesDXC by ID
export const getTransaccionesDXCById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetTransaccionDXCByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentasPorCobrar/${id}`, {
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

// Toggle TransaccionesDXC Status
export const toggleTransaccionesDXCStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateTransaccionesDXCResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentasPorCobrar/${id}/status`, {
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

// Import TransaccionesDXC from Excel (form data)
export const importTransaccionesDXCFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateTransaccionesDXCResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/ConceptoTransaccionesCuentasPorCobrar/import`, {
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

// GET Tipos de Relación
export const getTiposRelacion = async (token: string) => {
  const response = await fetch(
    `${BASE_URL}api/Catalogs/tipos-relacion`,
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
    value: item.c_TipoRelacion,
    label: item.descripcion,
  }));
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
