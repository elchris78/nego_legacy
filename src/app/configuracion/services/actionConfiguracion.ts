import { GetCompanyConfigParams } from "./typesConfiguracion";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL;

export const getCompanyIsConfigured = async ({
  companyId,
  token,
}: GetCompanyConfigParams): Promise<boolean> => {
  if (!token) throw new Error("Token is required");

  const response = await fetch(
    `${BASE_URL}/api/Company/${companyId}/is-configured`,
    {
      method: "GET",
      headers: {
        Accept: "text/plain",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.text();
  return data.toLowerCase() === "true";
};