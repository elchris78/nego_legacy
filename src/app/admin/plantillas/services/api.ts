import {
  CreateRoleTemplateWithCompaniesRequest,
  CreateRoleTemplateResponse,
  UpdateRoleTemplateWithCompaniesRequest,
  UpdateRoleTemplateResponse,
  DeleteRoleTemplateResponse,
  SwitchActiveResponse,
  GetRoleTemplatesResponse,
  RoleTemplateResponse,
  GetRolesByCompanyAndCompanyIdResponse,
  RolTemplatesAdminParams
} from "./plantillasTypes";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Función por si no es JSON, obtenemos el texto y lo usamos para crear un objeto con message y success:false
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const text = await response.text();
    return { message: text, success: false } as unknown as T;
  }
}

export const apiRoleTemplates = {
  // Crear template
  createTemplate: async (
    token: string,
    body: CreateRoleTemplateWithCompaniesRequest
  ): Promise<CreateRoleTemplateResponse> => {
    const response = await fetch(`${BASE_URL}api/RoleTemplates/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const jsonResponse: CreateRoleTemplateResponse = await parseResponse(response);
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Rol template no encontrado");
    }
    return jsonResponse;
  },

  // Actualizar template
  updateTemplate: async (
    token: string,
    id: string,
    body: Omit<UpdateRoleTemplateWithCompaniesRequest, "roleTemplateId">
  ): Promise<UpdateRoleTemplateResponse> => {
    const requestBody: UpdateRoleTemplateWithCompaniesRequest = {
      roleTemplateId: id,
      ...body,
    };

    const response = await fetch(`${BASE_URL}api/RoleTemplates/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const jsonResponse: UpdateRoleTemplateResponse = await parseResponse(response);
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Rol template no encontrado");
    }
    return jsonResponse;
  },

  // Eliminar template
  deleteTemplate: async (
    token: string,
    id: string
  ): Promise<DeleteRoleTemplateResponse> => {
    const response = await fetch(`${BASE_URL}api/RoleTemplates/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse: DeleteRoleTemplateResponse = await parseResponse(response);
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Rol template no encontrado");
    }
    return jsonResponse;
  },

  // Cambiar estatus del template
  toggleTemplateStatus: async (
    token: string,
    id: string
  ): Promise<SwitchActiveResponse> => {
    const response = await fetch(`${BASE_URL}api/RoleTemplates/toggle-status/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse: SwitchActiveResponse = await parseResponse(response);
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Rol template no encontrado");
    }
    return jsonResponse;
  },

  // Obtener template por su ID
  getTemplate: async (
    token: string,
    id: string
  ): Promise<RoleTemplateResponse> => {
    const response = await fetch(`${BASE_URL}api/RoleTemplates/get/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse: RoleTemplateResponse = await parseResponse(response);
    if (!response.ok) {
      throw new Error("Rol template no encontrado");
    }
    return jsonResponse;
  },

  // Obtener listado de templates con parámetros opcionales
  getTemplates: async (
    token: string,
    params: RolTemplatesAdminParams = {}
  ): Promise<GetRoleTemplatesResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Convertimos a string y eliminamos duplicados convirtiendo a array
        const uniqueValues = Array.from(new Set(value.map(String)));
    
        if (key === "active" && uniqueValues.includes("true") && uniqueValues.includes("false")) {
          return; // No agregamos nada a queryParams
        }
    
        uniqueValues.forEach((val) => queryParams.append(key, val));
      } else if (value) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${BASE_URL}api/RoleTemplates/get-all${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const jsonResponse: GetRoleTemplatesResponse = await parseResponse(response);
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Rol template no encontrado");
    }
    return jsonResponse;
  },
  
  // Obtener listado de templates por compañía
  getTemplatesByCompany: async (
    token: string,
    companyId: string
  ): Promise<GetRolesByCompanyAndCompanyIdResponse> => {
    const response = await fetch(
      `${BASE_URL}api/RoleTemplates/get-roles-by-company/${companyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const jsonResponse: GetRolesByCompanyAndCompanyIdResponse = await parseResponse(response);
    if (!response.ok || !jsonResponse.success) {
      throw new Error(jsonResponse.message || "Rol template no encontrado");
    }
    return jsonResponse;
  },
};
