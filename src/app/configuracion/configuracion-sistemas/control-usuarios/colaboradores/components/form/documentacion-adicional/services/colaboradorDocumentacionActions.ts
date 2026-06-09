import {
  CreateColaboradorDocumentacionResponse,
  DeleteColaboradorDocumentacionResponse,
  GetColaboradorDocumentacionByIDResponse,
  GetColaboradorDocumentacionResponse,
  UpdateColaboradorDocumentacionResponse,
} from "./colaboradorDocumentacionTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Colaborador Documentacion
export const createColaboradorDocumentacion = async ({
  token,
  body,
  colaboradorId,
}: {
  token: string | undefined;
  body: any;
  colaboradorId: string;
}): Promise<CreateColaboradorDocumentacionResponse> => {
  // create form data
  const formData = new FormData();
  formData.append("nombre", body.nombre);
  formData.append("archivo", body.archivo);

  const response = await fetch(
    `${BASE_URL}api/colaboradores/${colaboradorId}/documentacion`,
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

// Update Colaborador Documentacion
export const updateColaboradorDocumentacion = async ({
  token,
  id,
  body,
  colaboradorId,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
  colaboradorId: string;
}): Promise<UpdateColaboradorDocumentacionResponse> => {
  // create form data
  const formData = new FormData();
  formData.append("nombre", body.nombre);
  if (body.archivo) formData.append("archivo", body.archivo);

  const response = await fetch(
    `${BASE_URL}api/colaboradores/${colaboradorId}/documentacion/${id}`,
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

// Get Colaborador Documentacion
export const getColaboradorDocumentacion = async ({
  token,
  params,
  colaboradorId,
}: {
  token: string | undefined;
  params: any;
  colaboradorId: string;
}): Promise<GetColaboradorDocumentacionResponse> => {
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
    `${BASE_URL}api/colaboradores/${colaboradorId}/documentacion?${queryParams}`,
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

// Get Colaborador Documentacion by ID
export const getColaboradorDocumentacionById = async ({
  token,
  id,
  colaboradorId,
}: {
  token: string | undefined;
  id: string | null;
  colaboradorId: string;
}): Promise<GetColaboradorDocumentacionByIDResponse> => {
  const response = await fetch(
    `${BASE_URL}api/colaboradores/${colaboradorId}/documentacion/${id}`,
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

// Delete Colaborador Documentacion
export const deleteColaboradorDocumentacion = async ({
  token,
  id,
  colaboradorId,
}: {
  token: string | undefined;
  id: string | null;
  colaboradorId: string;
}): Promise<DeleteColaboradorDocumentacionResponse> => {
  const response = await fetch(
    `${BASE_URL}/api/colaboradores/${colaboradorId}/documentacion/${id}`,
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
