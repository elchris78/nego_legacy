import type {
    CreateCancelConceptsResponse,
    DeleteCancelConceptsResponse,
    UpdateCancelConceptsResponse,
    GetCancelConceptsResponse,
    GetCancelConceptResponse,
    CancelConceptsParams,
} from "./cancelConceptsTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create CancelConcepts
export const createCancelConcepts = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<CreateCancelConceptsResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoCancelacion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el Puesto");
  }
  return await response.json();
};

// Edit CancelConcepts
export const updateCancelConcepts = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<UpdateCancelConceptsResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoCancelacion/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ PuestoId: id, ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar el área");
  }
  return await response.json();
};

// Get CancelConcepts
export const getCancelConcepts = async ({
  token,
  params = {},
}: {
  token: string | undefined;
  params?: CancelConceptsParams;
}): Promise<GetCancelConceptsResponse> => {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key as keyof CancelConceptsParams];
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const response = await fetch(
    `${BASE_URL}api/ConceptoCancelacion?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las áreas");
  }

  return await response.json();
};

// Get CancelConcepts by ID
export const getCancelConceptsById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetCancelConceptResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoCancelacion/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener el área");
  }
  return await response.json();
};

// Delete CancelConcepts
export const deleteCancelConcepts = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<DeleteCancelConceptsResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoCancelacion/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar el Puesto");
  }
  return await response.json();
};

// Toggle CancelConcepts Status
export const toggleCancelConceptsStatus = async ({
    token,
    id,
    isActive,
  }: {
    token: string;
    id: string | null;
    isActive: boolean;
  }): Promise<DeleteCancelConceptsResponse> => {
    const response = await fetch(`${BASE_URL}api/ConceptoCancelacion/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(isActive),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al cambiar el estado del área");
    }
  
    return await response.json();
  };

// Import CancelConcepts from Excel (form data)
export const importConceptCancel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/ConceptoCancelacion/import`, {
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

export const getMotivosSat = async ({
  token,
}: {
  token: string | undefined;
}): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/motivos-cancelacion`, {
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

