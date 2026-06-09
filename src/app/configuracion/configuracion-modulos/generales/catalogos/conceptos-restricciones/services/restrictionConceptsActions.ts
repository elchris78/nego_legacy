import type {
  CreateRestrictionConceptResponse,
  DeleteRestrictionConceptResponse,
  GetRestrictionConceptsResponse,
  GetRestrictionConceptByIdResponse,
  UpdateRestrictionConceptResponse,
  RestrictionConceptTypeParams,
} from "./restrictionConceptsTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Restrictions Concept
export const createRestrictionConcept = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateRestrictionConceptResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoRestriccion`, {
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

// Edit Restrictions Concept
export const updateRestrictionConcept = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateRestrictionConceptResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoRestriccion/${id}`, {
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

// Delete Restrictions Concept
export const deleteRestrictionConcept = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteRestrictionConceptResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoRestriccion/${id}`, {
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

// Get Restrictions Concepts
export const getRestrictionConcepts = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: RestrictionConceptTypeParams;
}): Promise<GetRestrictionConceptsResponse> => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Convertimos a string y eliminamos duplicados convirtiendo a array
      const uniqueValues = Array.from(new Set(value.map(String)));

      if (
        (key === "isActive" ||
          key === "requiereAutorizacion" ||
          key === "requiereNotificacion") &&
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
    `${BASE_URL}api/ConceptoRestriccion?${queryParams}`,
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

// Get Restrictions Concept by ID
export const getRestrictionConceptById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetRestrictionConceptByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoRestriccion/${id}`, {
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

// Toggle Restrictions Concept Status
export const toggleRestrictionConceptStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateRestrictionConceptResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptoRestriccion/${id}/status`,
    {
      method: "PUT",
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

// Import Restrictions Concepts from Excel (form data)
export const importRestrictionConcepts = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateRestrictionConceptResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(
    `${BASE_URL}api/ConceptoRestriccion/import`,
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
