import type {
  CreateFabricanteDocumentoResponse,
  DeleteFabricanteDocumentoResponse,
  GetFabricanteDocumentosResponse,
  FabricanteDocumentoByIdResponse,
  UpdateFabricanteDocumentoResponse,
  FabricanteDocumentoTypeParams,
} from "./fabricantesDocumentosTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Fabricante Documento
export const createFabricanteDocumento = async ({
  token,
  body,
  fabricanteId,
}: {
  token: string | undefined;
  body: any;
  fabricanteId: string;
}): Promise<CreateFabricanteDocumentoResponse> => {
  // create form data
  const formData = new FormData();
  formData.append("archivo", body.archivo);
  formData.append("nombre", body.nombre);

  const response = await fetch(
    `${BASE_URL}api/fabricantes/${fabricanteId}/documentos`,
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

// Update Fabricante Documento
export const updateFabricanteDocumento = async ({
  token,
  id,
  body,
  fabricanteId,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
  fabricanteId: string;
}): Promise<UpdateFabricanteDocumentoResponse> => {
  // create form data
  const formData = new FormData();
  if (body.archivo) formData.append("archivo", body.archivo);
  formData.append("nombre", body.nombre);

  const response = await fetch(
    `${BASE_URL}api/fabricantes/${fabricanteId}/documentos/${id}`,
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

// Delete Fabricante Documento
export const deleteFabricanteDocumento = async ({
  token,
  id,
  fabricanteId,
}: {
  token: string | undefined;
  id: string | null;
  fabricanteId: string;
}): Promise<DeleteFabricanteDocumentoResponse> => {
  const response = await fetch(
    `${BASE_URL}/api/fabricantes/${fabricanteId}/documentos/${id}`,
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

// Get Fabricante Documentos
export const getFabricanteDocumentos = async ({
  token,
  params,
  fabricanteId,
}: {
  token: string | undefined;
  params: FabricanteDocumentoTypeParams;
  fabricanteId: string;
}): Promise<GetFabricanteDocumentosResponse> => {
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
    `${BASE_URL}api/fabricantes/${fabricanteId}/documentos?${queryParams}`,
    {
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

// Get Fabricante Documento by ID
export const getFabricanteDocumentoById = async ({
  token,
  id,
  fabricanteId,
}: {
  token: string | undefined;
  id: string | null;
  fabricanteId: string;
}): Promise<FabricanteDocumentoByIdResponse> => {
  const response = await fetch(
    `${BASE_URL}/api/fabricantes/${fabricanteId}/documentos/${id}`,
    {
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
