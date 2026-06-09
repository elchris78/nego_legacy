interface IRecuperarContrasenia {
  email: string;
}

export const recuperarContraseniaUser = async ({ email }:IRecuperarContrasenia) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ email });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow", // 'follow' es el valor correcto para esta propiedad
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/forgot-password`,
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.json(); // Intentamos obtener el mensaje del backend si existe
      return { success: false, message: errorData.message || "Error inesperado en la solicitud." };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return { success: false, message: "Error inesperado al realizar la solicitud." };
  }
};

