import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  getCompanyUsers,
  getCountries,
  getBanks,
  getPuestos,
  getDepartamentos,
  getColaboradores,
} from "../services/colaboradoresActions";
import { Option } from "@/components/ui/multiselect";

export const useDataForms = () => {
  const token = Cookies.get("auth-token");

  const [usersOptions, setUsersOptions] = useState<Option[]>([]);
  const [countriesOptions, setCountriesOptions] = useState<Option[]>([]);
  const [banksOptions, setBanksOptions] = useState<Option[]>([]);
  const [puestosOptions, setPuestosOptions] = useState<Option[]>([]);
  const [departamentosOptions, setDepartamentosOptions] = useState<Option[]>(
    []
  );
  const [colaboradoresOptions, setColaboradoresOptions] = useState<Option[]>(
    []
  );

  // Fetch company users
  useEffect(() => {
    if (!token) return;
    const fetchComapnyUsers = async () => {
      try {
        const resp = await getCompanyUsers({ token });
        const users = resp.unassignedUsers.map((user) => ({
          value: user.userId,
          label: user.fullName,
        }));
        setUsersOptions(users);
      } catch (error) {
        console.error("Error fetching company users:", error);
      }
    };

    fetchComapnyUsers();
  }, [token]);

  // Fetch countries
  useEffect(() => {
    if (!token) return;
    const fetchCountries = async () => {
      try {
        const resp = await getCountries({ token });
        const countries = resp.map((country) => ({
          value: country.c_Pais,
          label: country.descripcion,
        }));
        setCountriesOptions(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [token]);

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
        setBanksOptions(banks);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, [token]);

  // Fetch puestos
  useEffect(() => {
    if (!token) return;
    const fetchPuestos = async () => {
      try {
        const resp = await getPuestos({ token });
        const puestos = resp.puestos.map((puesto) => ({
          value: puesto.id,
          label: puesto.nombre,
        }));
        setPuestosOptions(puestos);
      } catch (error) {
        console.error("Error fetching puestos:", error);
      }
    };

    fetchPuestos();
  }, [token]);

  // Fetch departamentos
  useEffect(() => {
    if (!token) return;
    const fetchDepartamentos = async () => {
      try {
        const resp = await getDepartamentos({ token });
        const departamentos = resp.departments.map((department) => ({
          value: department.id.toString(),
          label: department.name,
        }));
        setDepartamentosOptions(departamentos);
      } catch (error) {
        console.error("Error fetching departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, [token]);

  // Fetch colaboradores
  useEffect(() => {
    if (!token) return;
    const fetchColaboradores = async () => {
      try {
        const resp = await getColaboradores({
          token,
          params: {
            tipoColaborador: ["interno"],
            estatus: ["true"],
          },
        });
        const colab = resp.colaboradores.map((colaborador) => ({
          value: colaborador.id,
          label: colaborador.nombreCompleto ?? "",
        }));
        setColaboradoresOptions(colab);
      } catch (error) {
        console.error("Error fetching colaboradores:", error);
      }
    };

    fetchColaboradores();
  }, [token]);

  return {
    usersOptions,
    setUsersOptions,
    countriesOptions,
    banksOptions,
    puestosOptions,
    departamentosOptions,
    colaboradoresOptions,
  };
};
