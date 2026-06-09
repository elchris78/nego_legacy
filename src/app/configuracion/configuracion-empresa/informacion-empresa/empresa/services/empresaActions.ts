import { Moneda, RegimenFiscal } from "./companyFormTypes";
import { EmpresaResponse } from "./companyTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Get company information
export const getCompanyInfo = async ({
  token,
  companyId,
}: {
  token: string | undefined;
  companyId: string | undefined;
}): Promise<EmpresaResponse> => {
  if (!token || !companyId) throw new Error("Token or Company ID is missing");

  const response = await fetch(`${BASE_URL}api/Company/${companyId}`, {
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

// Update company information
export const updateCompanyInfo = async ({
  token,
  companyId,
  formData,
}: {
  token: string | undefined;
  companyId: string | undefined;
  formData: FormData;
}): Promise<EmpresaResponse> => {
  if (!token || !companyId) throw new Error("Token or Company ID is missing");

  const response = await fetch(`${BASE_URL}api/Company/${companyId}/extended`, {
    method: "PUT",
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

// Get regimenes fiscales
export const getRegimenesFiscales = async ({
  token,
}: {
  token: string | undefined;
}): Promise<RegimenFiscal[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/regimenes-fiscales`, {
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
