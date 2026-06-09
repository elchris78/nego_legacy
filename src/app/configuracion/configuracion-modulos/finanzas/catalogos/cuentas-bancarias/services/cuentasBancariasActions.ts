import { Bank } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresTypes";
import type {
  CreateCuentaBancariaResponse,
  DeleteCuentaBancariaResponse,
  GetCuentaBancariaByIdResponse,
  UpdateCuentaBancariaResponse,
  GetCuentasBancariasResponse,
  CuentaBancariaTypeParams,
  Moneda
} from "./cuentasBancariasTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Cuenta Bancaria
export const createCuentaBancaria = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateCuentaBancariaResponse> => {
  const response = await fetch(`${BASE_URL}api/CuentasBancarias`, {
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

// Edit Cuenta Bancaria
export const updateCuentaBancaria = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateCuentaBancariaResponse> => {
  const response = await fetch(`${BASE_URL}api/CuentasBancarias/${id}`, {
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

// Delete Cuenta Bancaria
export const deleteCuentaBancaria = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteCuentaBancariaResponse> => {
  const response = await fetch(`${BASE_URL}api/CuentasBancarias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Get Cuenta Bancaria by ID
export const getCuentaBancariaById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetCuentaBancariaByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/CuentasBancarias/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Get Cuentas Bancarias
export const getCuentasBancarias = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: CuentaBancariaTypeParams;
}): Promise<GetCuentasBancariasResponse> => {
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

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}api/CuentasBancarias?${queryParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Toggle Cuenta Bancaria Status
export const toggleCuentaBancariaStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<UpdateCuentaBancariaResponse> => {
  const response = await fetch(`${BASE_URL}api/CuentasBancarias/${id}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Import from Excel file
export const importCuentasBancariasFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateCuentaBancariaResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/CuentasBancarias/import`, {
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

/*********************************************** Peticiones para listados en los formularios ********************************************/
// Get banks
export const getBanks = async ({
  token,
}: {
  token: string | undefined;
}): Promise<Bank[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/bancos`, {
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

// Get monedas
export const getMonedas = async ({
  token,
}: {
  token: string | undefined;
}): Promise<Moneda[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/monedas`, {
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