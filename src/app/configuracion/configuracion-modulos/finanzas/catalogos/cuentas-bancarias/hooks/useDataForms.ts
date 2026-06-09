import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  getBanks,
  getMonedas
} from "../services/cuentasBancariasActions";
import { Option } from "@/components/ui/multiselect";

export const useDataForms = () => {
  const token = Cookies.get("auth-token");

  const [bancosOptions, setBancosOptions] = useState<Option[]>([]);
  const [monedasOptions, setMonedasOptions] = useState<Option[]>([]);

  // Fetch banks
  useEffect(() => {
    if (!token) return;
    const fetchBanks = async () => {
      try {
        const resp = await getBanks({ token });
        const banks = resp.map((bank) => ({
          value: bank.clave,
          label: bank.descripcion,
        }));
        setBancosOptions(banks);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, [token]);

  // Fetch puestos
  useEffect(() => {
    if (!token) return;
    const fetchMonedas = async () => {
      try {
        const resp = await getMonedas({ token });
        const monedas = resp.map((moneda) => ({
          value: moneda.c_Moneda,
          label: moneda.descripcion,
        }));
        setMonedasOptions(monedas);
      } catch (error) {
        console.error("Error fetching monedas:", error);
      }
    };

    fetchMonedas();
  }, [token]);

  return {
    bancosOptions,
    monedasOptions,
  };
};
