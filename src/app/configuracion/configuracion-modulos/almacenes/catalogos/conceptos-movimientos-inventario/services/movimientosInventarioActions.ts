import type {
  CreateMovimientoInventarioResponse,
  DeleteMovimientoInventarioResponse,
  GetMovimientoInventarioByIdResponse,
  UpdateMovimientoInventarioResponse,
  GetMovimientosInventarioResponse,
  MovimientoInventarioTypeParams,
} from "./movimientosInventarioTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Movimiento Inventario
export const createMovimientoInventario = async ({
  token,
  body,
}: {
  token: string | undefined;
  body: any;
}): Promise<CreateMovimientoInventarioResponse> => {
  const response = await fetch(`${BASE_URL}api/ConceptoMovimientoInventario`, {
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

// Edit Movimiento Inventario
export const updateMovimientoInventario = async ({
  token,
  id,
  body,
}: {
  token: string | undefined;
  id: string | null;
  body: any;
}): Promise<UpdateMovimientoInventarioResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptoMovimientoInventario/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return await response.json();
};

// Delete Movimiento Inventario
export const deleteMovimientoInventario = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<DeleteMovimientoInventarioResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptoMovimientoInventario/${id}`,
    {
      method: "DELETE",
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

// Get Movimientos Inventario
export const getMovimientosInventario = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: MovimientoInventarioTypeParams;
}): Promise<GetMovimientosInventarioResponse> => {
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
        return;
      }

      if (
        key === "origen" &&
        uniqueValues.includes("Reservado") &&
        uniqueValues.includes("No reservado")
      ) {
        return;
      }

      if (
        key === "aplicaPara" &&
        uniqueValues.includes("Cliente") &&
        uniqueValues.includes("Proveedor") &&
        uniqueValues.includes("Ninguno")
      ) {
        return;
      }

      if (
        key === "tipoMovimiento" &&
        uniqueValues.includes("Entrada") &&
        uniqueValues.includes("Salida")
      ) {
        return;
      }

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(
    `${BASE_URL}api/ConceptoMovimientoInventario?${queryParams}`,
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

// Get Movimiento Inventario by ID
export const getMovimientoInventarioById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<GetMovimientoInventarioByIdResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptoMovimientoInventario/${id}`,
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

// Toggle Movimiento Inventario Status
export const toggleMovimientoInventarioStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | null;
}): Promise<UpdateMovimientoInventarioResponse> => {
  const response = await fetch(
    `${BASE_URL}api/ConceptoMovimientoInventario/${id}/status`,
    {
      method: "PATCH",
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

// Import from Excel file
export const importMovimientosInventarioFromExcel = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateMovimientoInventarioResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(
    `${BASE_URL}api/ConceptoMovimientoInventario/import`,
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
