// src/features/claims/claimsActions.ts

type FetchClaimsProps = {
  token?: string;
};

// Obtener todos los claims
export const fetchAllClaims = async ({ token }: FetchClaimsProps): Promise<any[]> => {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}NegoAdmin/Claim/getAllClaims`, requestOptions);
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Error al obtener los claims.");
    }

    const result = await response.json();
    // console.log("Claims obtenidos exitosamente:", result);
    return result;
  } catch (error) {
    console.error("Error al obtener los claims:", error);
    throw error;
  }
};


