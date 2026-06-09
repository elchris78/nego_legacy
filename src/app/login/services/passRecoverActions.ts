interface IRecuperarContrasenia {
  email: string;
}

export const recuperarContrasenia = async ({ email }: IRecuperarContrasenia) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ email });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,  // Asignar correctamente el valor 'follow' a RequestRedirect
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/forgot-password`,
      requestOptions
    );

    if (!response.ok) {
      // Intentamos obtener el mensaje del backend si existe
      const errorData = await response.json();
      return { success: false, message: errorData.message || "Error inesperado en la solicitud." };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return { success: false, message: "Error inesperado al realizar la solicitud." };
  }
};
