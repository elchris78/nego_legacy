import type {
  CreateReturnConceptResponse,
  DeleteReturnConceptResponse,
  GetReturnConceptByIdResponse,
  GetReturnConceptsResponse,
  UpdateReturnConceptResponse,
} from "./ReturnConceptTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Return Concept
export const createReturnConcept = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateReturnConceptResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoDevolucion`, {
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

// Edit Return Concept
export const updateReturnConcept = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateReturnConceptResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoDevolucion/${id}`, {
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

// Delete Return Concept
export const deleteReturnConcept = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteReturnConceptResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoDevolucion/${id}`, {
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

// Get Return Concepts
export const getReturnConcepts = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetReturnConceptsResponse> => {
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
    `${BASE_URL}api/ConceptoDevolucion?${queryParams}`,
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

// Get Return Concept by ID
export const getReturnConceptById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetReturnConceptByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoDevolucion/${id}`, {
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

// Toggle Return Concept Status
export const toggleReturnConceptStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateReturnConceptResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptoDevolucion/${id}/status`,
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

// Import Return Concepts from Excel (form data)
export const importReturnConcepts = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateReturnConceptResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/ConceptoDevolucion/import`, {
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
