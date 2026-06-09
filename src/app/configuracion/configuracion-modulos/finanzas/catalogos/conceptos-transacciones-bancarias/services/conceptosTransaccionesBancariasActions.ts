import type {
  CreateConceptoTransaccionBancariaResponse,
  UpdateConceptoTransaccionBancariaResponse,
  DeleteConceptoTransaccionBancariaResponse,
  GetConceptosTransaccionesBancariasResponse,
  GetConceptoTransaccionBancariaByIdResponse,
  ConceptoTransaccionBancariaTypeParams,
} from "./conceptosTransaccionesBancariasTypes";

export const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Concepto Transaccion Bancaria
export const createConceptoTransaccionBancaria = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateConceptoTransaccionBancariaResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptosTransaccionesBancarias`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Edit Concepto Transaccion Bancaria
export const updateConceptoTransaccionBancaria = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string;
  body: any;
}): Promise<UpdateConceptoTransaccionBancariaResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptosTransaccionesBancarias/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Delete Concepto Transaccion Bancaria
export const deleteConceptoTransaccionBancaria = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<DeleteConceptoTransaccionBancariaResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptosTransaccionesBancarias/${id}`,
    {
      method: "DELETE",
      headers: {
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

// Get all Conceptos Transacciones Bancarias
export const getConceptosTransaccionesBancarias = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: ConceptoTransaccionBancariaTypeParams;
}): Promise<GetConceptosTransaccionesBancariasResponse> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Convertimos a string y eliminamos duplicados convirtiendo a array
      const uniqueValues = Array.from(new Set(value.map(String)));

      if (
        key === "estatus" &&
        uniqueValues.includes("true") &&
        uniqueValues.includes("false")
      ) {
        return; // No agregamos nada a queryParams
      }

      if (
        key === "tipoTransaccion" &&
        uniqueValues.includes("Cargo") &&
        uniqueValues.includes("Abono")
      ) {
        return; // No agregamos nada a queryParams
      }

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });
  const response = await fetch(
    `${BASE_URL}api/ConceptosTransaccionesBancarias?${queryParams}`,
    {
      method: "GET",
      headers: {
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

// Get Concepto Transaccion Bancaria by ID
export const getConceptoTransaccionBancariaById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<GetConceptoTransaccionBancariaByIdResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptosTransaccionesBancarias/${id}`,
    {
      method: "GET",
      headers: {
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

// Toggle Estatus Concepto Transaccion Bancaria
export const toggleEstatusConceptoTransaccionBancaria = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<UpdateConceptoTransaccionBancariaResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptosTransaccionesBancarias/${id}/status`,
    {
      method: "PUT",
      headers: {
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

// Import from Excel file
export const importConceptosTransaccionesBancariasFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateConceptoTransaccionBancariaResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(
    `${BASE_URL}api/ConceptosTransaccionesBancarias/import`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};
