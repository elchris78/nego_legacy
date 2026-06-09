import { Country } from "@/app/configuracion/configuracion-modulos/almacenes/catalogos/fabricantes/services/fabricantesTypes";
import { GetCompanyUsersResponse } from "../../usuarios/services/companyUsersTypes";
import type {
  ColaboradorParams,
  CreateColaboradorResponse,
  UpdateColaboradorResponse,
  DeleteColaboradorResponse,
  GetColaboradoresResponse,
  GetColaboradorResponse,
  Bank,
  Location,
  UnassignedUsersResponse,
} from "./colaboradoresTypes";
import { GetPuestosResponse } from "@/app/configuracion/configuracion-empresa/informacion-empresa/puestos/services/puestosTypes";
import { GetDepartmentsResponse } from "@/lib/services/departments/departmentsTypes";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Create Colaborador
export const createColaborador = async ({
  token,
  formData,
}: {
  token: string | undefined;
  formData: FormData;
}): Promise<CreateColaboradorResponse> => {
  const response = await fetch(`${BASE_URL}api/Colaborador`, {
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

// Edit Colaborador
export const updateColaborador = async ({
  token,
  id,
  formData,
}: {
  token: string | undefined;
  id: string | null;
  formData: FormData;
}): Promise<UpdateColaboradorResponse> => {
  const response = await fetch(`${BASE_URL}api/Colaborador/${id}`, {
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

// Get Colaboradores
export const getColaboradores = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: ColaboradorParams;
}): Promise<GetColaboradoresResponse> => {
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

      if (
        key === "tipoColaborador" &&
        uniqueValues.includes("interno") &&
        uniqueValues.includes("externo")
      ) {
        return; // No agregamos nada a queryParams
      }

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}api/Colaborador?${queryParams}`, {
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

// Get Colaboradores detailed
export const getColaboradoresDetailed = async ({
  token,
  params,
}: {
  token: string | undefined;
  params: ColaboradorParams;
}): Promise<GetColaboradoresResponse> => {
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

      if (
        key === "tipoColaborador" &&
        uniqueValues.includes("interno") &&
        uniqueValues.includes("externo")
      ) {
        return; // No agregamos nada a queryParams
      }

      uniqueValues.forEach((val) => queryParams.append(key, val));
    } else if (value) {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(
    `${BASE_URL}api/Colaborador/detailed?${queryParams}`,
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

// Get Colaborador
export const getColaboradorById = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<GetColaboradorResponse> => {
  const response = await fetch(`${BASE_URL}api/Colaborador/${id}`, {
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

// Delete Colaborador
export const deleteColaborador = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<DeleteColaboradorResponse> => {
  const response = await fetch(`${BASE_URL}api/Colaborador/${id}`, {
    method: "DELETE",
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

// Toggle Colaborador Status
export const toggleColaboradorStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string;
}): Promise<UpdateColaboradorResponse> => {
  const response = await fetch(`${BASE_URL}api/Colaborador/${id}/status`, {
    method: "PUT",
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

// Import Colaboradores from Excel (form data)
export const importColaboradores = async ({
  token,
  file,
}: {
  token: string | undefined;
  file: File;
}): Promise<CreateColaboradorResponse> => {
  const formData = new FormData();
  formData.append("File", file);

  const response = await fetch(`${BASE_URL}api/Colaborador/import`, {
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

/*********************************************** Peticiones para listados en los formularios ********************************************/
// Get company users
export const getCompanyUsers = async ({
  token,
}: {
  token: string | undefined;
}): Promise<UnassignedUsersResponse> => {
  const response = await fetch(`${BASE_URL}api/Colaborador/unassigned-users`, {
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

// Get Countries
export const getCountries = async ({
  token,
}: {
  token: string | undefined;
}): Promise<Country[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/paises`, {
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

// Get banks
export const getBanks = async ({
  token,
}: {
  token: string | undefined;
}): Promise<Bank[]> => {
  const response = await fetch(`${BASE_URL}api/Catalogs/bancos`, {
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

// Get Puestos
export const getPuestos = async ({
  token,
}: {
  token: string | undefined;
}): Promise<GetPuestosResponse> => {
  const response = await fetch(`${BASE_URL}api/Puesto?isActive=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las áreas");
  }

  return await response.json();
};

// Get departamentos
export const getDepartamentos = async ({
  token,
}: {
  token: string | undefined;
}): Promise<GetDepartmentsResponse> => {
  const response = await fetch(
    `${BASE_URL}NegoAdmin/Departments/departments?status=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener los departamentos");
  }

  return await response.json();
};

// get postal code options
export const getPostalCodeOptions = async ({
  token,
  codigoPostal,
}: {
  token: string | undefined;
  codigoPostal: string;
}): Promise<{
  colonias: Location[];
  estados: Location[];
  ciudades: Location[];
}> => {
  const response = await fetch(
    `${BASE_URL}/api/utils/postalcode/${codigoPostal}`,
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

export const getUsersById = async ({
  token,
  userId
}: { token: string | undefined; userId: string }): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/Users/get/${userId}`, {
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
}
