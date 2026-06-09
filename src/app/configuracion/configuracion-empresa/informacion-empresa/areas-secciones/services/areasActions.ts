import type {
  CreateAreaResponse,
  DeleteAreaResponse,
  UpdateAreaResponse,
  GetAreaResponse,
  GetAreasResponse,
} from "./areaTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Area
export const createArea = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateAreaResponse> => {
  const response = await fetch(`${BASE_URL}api/Area`, {
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

// Edit Area
export const updateArea = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any | string;
}): Promise<UpdateAreaResponse> => {
  const response = await fetch(`${BASE_URL}api/Area/${id}`, {
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

// Get Areas
export const getAreas = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: any;
}): Promise<GetAreasResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Area?${queryParams}`, {
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

// Get Area by ID
export const getAreaById = async ({
  token,
  id,
}: {
  token: string;
  id: string | null;
}): Promise<GetAreaResponse> => {
  const response = await fetch(`${BASE_URL}api/Area/${id}`, {
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

// Delete Area
export const deleteArea = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteAreaResponse> => {
  const response = await fetch(`${BASE_URL}api/Area/${id}`, {
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

// Toggle Area Status
export const toggleAreaStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateAreaResponse> => {
  const response = await fetch(`${BASE_URL}api/Area/${id}/status`, {
    method: "PUT",
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

// Import Areas from Excel (form data)
export const importAreas = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Area/import`, {
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
