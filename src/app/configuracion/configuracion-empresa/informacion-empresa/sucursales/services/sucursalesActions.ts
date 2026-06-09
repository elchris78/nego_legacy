import type {
  CreateSucursalResponse,
  DeleteSucursalResponse,
  GetSucursalResponse,
  GetSucursalByIdResponse,
  UpdateSucursalResponse,
  SucursalesParams,
  AddDocumentSucursalResponse,
  GetDocumentByIdResponse,
  GetDocumentByIdsResponse,
} from "./sucursalesTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Sucursal
export const createSucursal = async ({
  token,
  formData,
}: {
  token: string | undefined;
  formData: FormData;
}): Promise<CreateSucursalResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal`, {
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

// Edit Sucursal
export const updateSucursal = async ({
  token,
  id,
  formData,
}: {
  token: string | undefined;
  id: string | null;
  formData: FormData;
}): Promise<UpdateSucursalResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal`, {
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

// Delete Sucursal 
export const deleteSucursal = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteSucursalResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal/${id}`, {
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

// Get Sucursal 
export const getSucursal = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: SucursalesParams;
}): Promise<GetSucursalResponse> => {
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

  const response = await fetch(`${BASE_URL}api/Sucursal?${queryParams}`, {
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

// Get Sucursal by ID
export const getSucursalById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetSucursalByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal/${id}`, {
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

// Toggle Sucursal Status
export const toggleSucursalStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateSucursalResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal/${id}/status`, {
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

// Import Sucursal from Excel (form data)
export const importSucursalFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateSucursalResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Sucursal/import`, {
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

// Get Postal Code Data
export const getPostalCodeData = async ({
  token,
  codigoPostal,
}: {
  token: string | undefined;
  codigoPostal: string;
}): Promise<any> => {
  const response = await fetch(
    `${BASE_URL}api/utils/postalcode/${codigoPostal}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "text/plain",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
};

// Add Document Sucursal
export const addDocumentSucursal = async ({
  token,
  formData,
}: {
  token: string | undefined;
  formData: FormData;
}): Promise<AddDocumentSucursalResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal/add-documento`, {
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

// Get Documents by ID
export const getDocumentById = async ({
  token,
  id,
}: {
  token: string | undefined; 
  id: string | null;
}): Promise<GetDocumentByIdResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal/documentos/${id}`, {
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

export const getDocumentSucursalById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | number;
}): Promise<GetDocumentByIdsResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal/documento/${id}`, {
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

export const updateDocumentSucursal = async ({
  token,
  id,
  sucursalId,
  nombreDocumento,
  isDeleted,
  archivo,
}: {
  token: string | undefined;
  id: number;
  sucursalId: string;
  nombreDocumento: string;
  isDeleted: boolean;
  archivo?: File | null;
}): Promise<AddDocumentSucursalResponse> => {
  const formData = new FormData();
  if (archivo) {
    formData.append("Archivo", archivo);
  }

  const url = new URL(`${BASE_URL}api/Sucursal/modificar-documento`);
  url.searchParams.append("Id", id.toString());
  url.searchParams.append("SucursalId", sucursalId);
  url.searchParams.append("NombreDocumento", nombreDocumento);
  url.searchParams.append("IsDeleted", isDeleted.toString());

  const response = await fetch(url.toString(), {
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
// Delete Sucursal Doc 
export const deleteSucursalDoc = async ({
  token,
  id,
  sucursalId,
}: {
  token: string | undefined;
  id: number;
  sucursalId: string;
}): Promise<DeleteSucursalResponse> => {
  const response = await fetch(`${BASE_URL}api/Sucursal/eliminar-documento`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id,
      sucursalId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return await response.json();
};
