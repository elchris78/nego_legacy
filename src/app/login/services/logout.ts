import Cookies from "js-cookie";

export async function logoutBackend(manual: boolean): Promise<void> {
  const token = Cookies.get("auth-token");

  if (!token) {
    console.warn("No se encontró un token para enviar al backend.");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_URL}api/Account/logout?manual=${manual}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Error al cerrar sesión en el servidor:", await response.text());
    }
  } catch (error) {
    console.error("Error al ejecutar el logout en el backend:", error);
  }
}
