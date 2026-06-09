"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import CuentasBancariasTable from "./components/table/CuentasBancariasTable";
import CuentasBancariasTableFilters from "./components/table/CuentasBancariasTableFilters";
import showAlert from "@/lib/utils/alerts";

import { cuentasBancariasActions } from "./services/cuentasBancariasSlice";
import type {
  CuentaBancariaTypeParams,
} from "./services/cuentasBancariasTypes";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("CuentasBancarias");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<CuentaBancariaTypeParams>({
    searchTerm: "",
    estatus: [],
    bancoIds: [],
    monedaIds: [],
    cuentaContable: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const cuentasBancarias = useSelector(
    (state: RootState) => state.cuentasBancarias.cuentasBancarias
  );
  const totalRecords = useSelector(
    (state: RootState) => state.cuentasBancarias.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.cuentasBancarias.loading
  );

  // Pagination hook logic
  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
  } = usePagination(totalRecords);
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchParams.searchTerm,
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.bancoIds),
    JSON.stringify(searchParams.monedaIds),
    JSON.stringify(searchParams.cuentaContable),
    JSON.stringify(searchParams.tipoInstrumentoBancario),
  ]);
  // Effect to fetch return data based on search params and pagination
  useEffect(() => {
    getData();
  }, [
    token,
    searchParams.searchTerm,
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.bancoIds),
    JSON.stringify(searchParams.monedaIds),
    JSON.stringify(searchParams.cuentaContable),
    JSON.stringify(searchParams.tipoInstrumentoBancario),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getData = async () => {
    if (!token) return;
    try {
      await dispatch(
        cuentasBancariasActions.getCuentasBancarias({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error: any) {
      console.error("Error fetching colaboradores:", error);
      showAlert({
        success: false,
        message:
          error.message ||
          "Error al obtener los colaboradores, inténtalo de nuevo",
      });
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Cuentas bancarias"} total={totalRecords} />
      <CuentasBancariasTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getData={getData}
      />
      <CuentasBancariasTable
        cuentasBancarias={cuentasBancarias}
        startIndex={(currentPage - 1) * itemsPerPage}
        isLoading={isLoading}
        getData={getData}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
      />
    </div>
  );
};

export default Page;
