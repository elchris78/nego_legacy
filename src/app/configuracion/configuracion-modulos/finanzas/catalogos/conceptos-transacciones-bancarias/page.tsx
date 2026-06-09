"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/store/store";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import ConceptosTransaccionesBancariasTable from "./components/table/ConceptosTransaccionesBancariasTable";
import ConceptosTransaccionesBancariasTableFilters from "./components/table/ConceptosTransaccionesBancariasTableFilters";
import showAlert from "@/lib/utils/alerts";

import { conceptosTransaccionesBancariasActions } from "./services/conceptosTransaccionesBancariasSlice";
import type { ConceptoTransaccionBancariaTypeParams } from "./services/conceptosTransaccionesBancariasTypes";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("ConceptosTransaccionesBancarias");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<ConceptoTransaccionBancariaTypeParams>({
      searchQuery: "",
      estatus: [],
      tipoTransaccion: [],
    });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const conceptos = useSelector(
    (state: RootState) =>
      state.conceptosTransaccionesBancarias.conceptosTransaccionesBancarias
  );
  const totalRecords = useSelector(
    (state: RootState) => state.conceptosTransaccionesBancarias.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.conceptosTransaccionesBancarias.loading
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
    getData();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.estatus),
    JSON.stringify(searchParams.tipoTransaccion),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);

  const getData = async () => {
    if (!token) return;
    try {
      await dispatch(
        conceptosTransaccionesBancariasActions.getConceptosTransaccionesBancarias(
          {
            token,
            params: {
              ...searchParams,
              page: currentPage,
              size: itemsPerPage,
            },
          }
        )
      );
    } catch (error: any) {
      console.error("Error fetching conceptos:", error);
      showAlert({
        success: false,
        message:
          error.message || "Error al obtener los conceptos, inténtalo de nuevo",
      });
    }
  };

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle
        title={"Conceptos de transacciones bancarias"}
        total={totalRecords}
      />
      <ConceptosTransaccionesBancariasTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        getData={getData}
      />
      <ConceptosTransaccionesBancariasTable
        conceptos={conceptos}
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
