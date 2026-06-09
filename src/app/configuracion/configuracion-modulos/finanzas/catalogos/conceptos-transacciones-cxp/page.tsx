"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import TransaccionesDXPTable from "./components/table/TransaccionesDXPTable";
import TransaccionesDXPTableFilters from "./components/table/TransaccionesDXPTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { TransaccionesDXP, TransaccionesDXPParams } from "./services/transaccionesDXPTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { transaccionesDXPActions } from "./services/transaccionesDXPSlice";
import Loading from "@/components/ui/Modals/loading";
import showAlert from "@/lib/utils/alerts";



const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosTransaccionesCuentasPorPagar");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<TransaccionesDXPParams>({
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
  const transaccionesDXP = useSelector(
    (state: RootState) => state.transaccionesDXP.transaccionesDXP
  );
  const totalRecords = useSelector(
    (state: RootState) => state.transaccionesDXP.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.transaccionesDXP.loading
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
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.origen),
    JSON.stringify(searchParams.contraPartida),
    JSON.stringify(searchParams.tipoTransaccion),
    JSON.stringify(searchParams.tipoRelacionSat),
    JSON.stringify(searchParams.formaPago),
  ]);

  useEffect(() => {
    getData();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.isActive),
    JSON.stringify(searchParams.origen),
    JSON.stringify(searchParams.contraPartida),
    JSON.stringify(searchParams.tipoTransaccion),
    JSON.stringify(searchParams.tipoRelacionSat),
    JSON.stringify(searchParams.formaPago),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getData = async () => {
    if (!token) return;
    try {
      await dispatch(
        transaccionesDXPActions.getTransaccionesDXP({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error: any) {
      console.error("Error fetching transacciones CXP", error);
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
      <TableTitle title={"Conceptos de transacciones a CXP"} total={totalRecords} />
      <TransaccionesDXPTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <TransaccionesDXPTable
        transaccionesDXP={transaccionesDXP}
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
