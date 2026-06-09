import Cookies from "js-cookie";

const url = process.env.NEXT_PUBLIC_AUTH_URL;

export async function refreshAuthToken() {
  try {
    const refreshToken = Cookies.get("refresh-token");
    const token = Cookies.get("auth-token");

    if (!refreshToken || !token) {
      return;
    }

    const response = await fetch(`${url}api/Account/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    const data = await response.json();

    // Log the previous and new tokens
    // console.log("Previous auth-token:", token);
    // console.log("New auth-token:", data.token);

    // Guardamos los nuevos tokens en las cookies
    Cookies.set("auth-token", data.token, { secure: true, sameSite: "strict" });
    Cookies.set("refresh-token", data.refreshToken, { secure: true, sameSite: "strict" });

  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}
