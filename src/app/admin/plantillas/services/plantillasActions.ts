const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Crear plantilla
export const fetchCreatePlantilla = async ({
  token,
  body,
}: {
  token: string;
  body: any;
}): Promise<any> => {
  const response = await fetch(
    `${BASE_URL}api/RoleTemplates/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear la plantilla");
  }
  return await response.json();
};

// Editar plantilla
export const fetchEditPlantilla = async ({
  token,
  id,
  body,
}: {
  token: string;
  id: string | null;
  body: any;
}): Promise<any> => {
  const response = await fetch(
    `${BASE_URL}api/RoleTemplates/update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roleTemplateId: id, ...body }),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al editar la plantilla");
  }
  return await response.json();
};

// Eliminar plantilla
export const fetchDeletePlantilla = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: any;
}): Promise<any> => {
  const requestOptions: RequestInit = {
    method: "DELETE",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}api/RoleTemplates/delete/${id}`,
      requestOptions
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al eliminar la plantilla.");
    }

    return result;
  } catch (error) {
    console.error("Error al eliminar la plantilla:", error);
    throw error;
  }
};

// Cambiar estatus de la plantilla
export const fetchTogglePlantillaStatus = async ({
  token,
  id,
}: {
  token: string | undefined;
  id: string | string[] | null;
}): Promise<any> => {
  const response = await fetch(
    `${BASE_URL}api/RoleTemplates/toggle-status/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Error al cambiar el estatus de la plantilla"
    );
  }
  return await response.json();
};

// Obtener plantilla
export const fetchGetPlantilla = async ({
  token,
  id,
}: {
  token: string;
  id: string | string[] | null;
}): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/RoleTemplates/get/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener la plantilla");
  }
  return await response.json();
};

// Obtener listado de plantillas
export const fetchGetPlantillas = async ({
  token,
}: {
  token: string | undefined;
}): Promise<any> => {
  const response = await fetch(`${BASE_URL}api/RoleTemplates/get-all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las plantillas");
  }
  return await response.json();
};
