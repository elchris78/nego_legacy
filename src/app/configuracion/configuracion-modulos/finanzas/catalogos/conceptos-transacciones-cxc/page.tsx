"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import TransaccionesDXCTable from "./components/table/TransaccionesDXCTable";
import TransaccionesDXCTableFilters from "./components/table/TransaccionesDXCTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { TransaccionesDXC, TransaccionesDXCParams } from "./services/transaccionesDXCTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { transaccionesDXCActions } from "./services/transaccionesDXCSlice";
import Loading from "@/components/ui/Modals/loading";



const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosTransaccionesCuentasPorCobrar");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<TransaccionesDXCParams>({
    searchQuery: "",
    isActive: [],
    origen: [],
    contraPartida: [],
    tipoTransaccion: [],
    tipoRelacionSat: [],
    formaPago: [],
  });

  // return concepts redux
  const dispatch: AppDispatch = useDispatch();
  const transaccionesDXC = useSelector(
    (state: RootState) => state.transaccionesDXC.transaccionesDXC
  );
  const totalRecords = useSelector(
    (state: RootState) => state.transaccionesDXC.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.transaccionesDXC.loading
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

  // Effect to fetch return data based on search params and pagination
  useEffect(() => {
    if (!token) return;
    dispatch(
      transaccionesDXCActions.getTransaccionesDXC({
        token,
        params: {
          ...searchParams,
          page: currentPage,
          size: itemsPerPage,
        },
      })
    );
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.origen),
    JSON.stringify(searchParams.contraPartida),
    JSON.stringify(searchParams.tipoTransaccion),
    JSON.stringify(searchParams.tipoRelacionSat),
    JSON.stringify(searchParams.formaPago),
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }
  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Conceptos de transacciones a CXC"} total={totalRecords} />
      <TransaccionesDXCTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <TransaccionesDXCTable
        transaccionesDXC={transaccionesDXC}
        startIndex={(currentPage - 1) * itemsPerPage}
        isLoading={isLoading}
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
