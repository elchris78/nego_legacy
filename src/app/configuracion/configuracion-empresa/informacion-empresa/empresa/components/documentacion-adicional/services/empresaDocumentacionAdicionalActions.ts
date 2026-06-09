import {
  CreateEmpresaDocumentacionAdicionalResponse,
  DeleteEmpresaDocumentacionAdicionalResponse,
  EmpresaDocumentacionAdicionalParams,
  GetEmpresaDocumentacionAdicionalByIDResponse,
  GetEmpresaDocumentacionAdicionalResponse,
  UpdateEmpresaDocumentacionAdicionalResponse,
} from "./empresaDocumentacionAdicionalTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Empresa Documentacion Adicional
export const createEmpresaDocumentacionAdicional = async ({
  token,
  body,
  empresaId,
}: {
  token: string | undefined;
  body: any;
  empresaId: string;
}): Promise<CreateEmpresaDocumentacionAdicionalResponse> => {
  console.log("🚀 ~ createEmpresaDocumentacionAdicional ~ body:", body)
  // create form data
  const formData = new FormData();
  formData.append("nombre", body.nombre);
  formData.append("archivo", body.archivo);

  const response = await fetch(
    `${BASE_URL}api/Company/${empresaId}/documentacion`,
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

// Update Empresa Documentacion Adicional
export const updateEmpresaDocumentacionAdicional = async ({
  token,
  id,
  body,
  empresaId,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
  empresaId: string;
}): Promise<UpdateEmpresaDocumentacionAdicionalResponse> => {
  // create form data
  const formData = new FormData();
  formData.append("nombre", body.nombre);
  if (body.archivo) formData.append("archivo", body.archivo);

  const response = await fetch(
    `${BASE_URL}api/Company/${empresaId}/documentacion/${id}`,
    {
      method: "PUT",
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

// Get Empresa Documentacion Adicional
export const getEmpresaDocumentacionAdicional = async ({
  token,
  empresaId,
  params,
}: {
  token: string | undefined;
  empresaId: string;
  params: EmpresaDocumentacionAdicionalParams;
}): Promise<GetEmpresaDocumentacionAdicionalResponse> => {
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

  const response = await fetch(
    `${BASE_URL}api/Company/${empresaId}/documentacion?${queryParams}`,
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

// Get Empresa Documentacion Adicional by ID
export const getEmpresaDocumentacionAdicionalByID = async ({
  token,
  id,
  empresaId,
}: {
  token: string | undefined;
  id: string | null;
  empresaId: string;
}): Promise<GetEmpresaDocumentacionAdicionalByIDResponse> => {
  const response = await fetch(
    `${BASE_URL}api/Company/${empresaId}/documentacion/${id}`,
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

// Delete Empresa Documentacion Adicional
export const deleteEmpresaDocumentacionAdicional = async ({
  token,
  id,
  empresaId,
}: {
  token: string | undefined;
  id: string | null;
  empresaId: string;
}): Promise<DeleteEmpresaDocumentacionAdicionalResponse> => {
  const response = await fetch(
    `${BASE_URL}/api/Company/${empresaId}/documentacion/${id}`,
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
