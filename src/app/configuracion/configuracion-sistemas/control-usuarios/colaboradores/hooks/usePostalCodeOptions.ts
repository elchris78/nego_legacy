import { useCallback, useState } from "react";
import { getPostalCodeOptions } from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresActions";
import type {
  PostalCodeOptions,
  Location,
} from "@/app/configuracion/configuracion-sistemas/control-usuarios/colaboradores/services/colaboradoresTypes";

export function usePostalCodeOptions(
  initialCP = "",
  initialOptions: PostalCodeOptions | null = null
) {
  const [codigoPostal, setCodigoPostal] = useState(initialCP);
  const [postalCodeOptions, setPostalCodeOptions] =
    useState<PostalCodeOptions | null>(initialOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostalCodeOptions = useCallback(
    async (cp: string, token: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await getPostalCodeOptions({ token, codigoPostal: cp });
        setPostalCodeOptions({
          colonias: resp.colonias.map((colonia: Location) => ({
            value: colonia.clave,
            label: colonia.nombre,
          })),
          estados: resp.estados,
          ciudades: resp.ciudades,
        });
        setCodigoPostal(cp);
        return resp;
      } catch (err) {
        setPostalCodeOptions(null);
        setError("Error al obtener las opciones de código postal");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    codigoPostal,
    setCodigoPostal,
    postalCodeOptions,
    setPostalCodeOptions,
    isLoading,
    error,
    fetchPostalCodeOptions,
  };
}
