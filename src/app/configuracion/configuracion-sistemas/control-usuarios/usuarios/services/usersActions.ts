import { IndividualClaimsByRole } from "../components/forms/RolForm";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

// Crear usuario
export const createUser = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/Users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear usuario");
  }
  return await response.json();
};

// Editar usuario
export const editUser = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any | string;
}): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/Users/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: id, ...body }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar usuario");
  }
  return await response.json();
};

// Obtener roles
export const getRoles = async ({ token }: { token: string }): Promise<any> => {
  const response = await fetch(`${BASE_URL}NegoAdmin/Roles/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener roles");
  }
  return await response.json();
};

// Obtener plantillas de perfil
export const fetchGetTemplates = async ({
  token,
}: {
  token: string | undefined;
}): Promise<any> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${BASE_URL}NegoAuth/RoleTemplates/role-templates`,
      requestOptions
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener las plantillas de perfil.");
    }

    return result;
  } catch (error) {
    console.error("Error al obtener las plantillas de perfil:", error);
    console.error("token:", token);
    console.error("BASE_URL:", BASE_URL);
    throw error;
  }
};

// Obtener usuario
export const getUser = async ({
  token,
  id,
}: {
  token: string;
  id: string | string[] | null;
}): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/Users/get/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener usuario");
  }
  
  return await response.json();
};

// Eliminar usuario
export const fetchDeleteUser = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | string[] | undefined;
}): Promise<any> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const requestOptions: RequestInit = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${BASE_URL}api/Users/delete/${id}`,
      requestOptions
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al eliminar el usuario.");
    }

    return result;
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
};

// Obtener listado de usuarios
export const fetchGetUsers = async ({
  token,
}: {
  token: string | undefined;
}): Promise<any> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${BASE_URL}api/Users/get-all`,
      requestOptions
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener los usuarios.");
    }

    return result;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Cambiar estatus del usuario
export const fetchToggleUserStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | string[] | null;
}): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/Users/toggle-status/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al cambiar el estatus del usuario"
    );
  }
  return await response.json();
};

// Obtener roles por empresa

export const fetchGetRoleTemplateId = async ({
  token,
  roleTemplateId,
}: {
  token: string | undefined;
  roleTemplateId: string;
}): Promise<IndividualClaimsByRole> => {
  const response = await fetch(
    `${BASE_URL}NegoAuth/RoleTemplates/role-template/${roleTemplateId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al obtener los plantillas por empresa"
    );
  }
  return await response.json();
};
