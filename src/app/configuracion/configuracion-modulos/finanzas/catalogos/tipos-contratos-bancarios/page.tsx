"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import TiposContratosBTable from "./components/table/TiposContratosBTable";
import TiposContratosBTableFilters from "./components/table/TiposContratosBTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { TiposContratosB, TiposContratosBParams } from "./services/tiposContratosBTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { tiposContratosBActions } from "./services/tiposContratosBSlice";
import Loading from "@/components/ui/Modals/loading";
import showAlert from "@/lib/utils/alerts";



const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("TiposContratosBancarios");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<TiposContratosBParams>({
    searchQuery: "",
    estatus: [],
  });

  // return concepts redux
  const dispatch: AppDispatch = useDispatch();
  const tiposContratosB = useSelector(
    (state: RootState) => state.tiposContratosB.tiposContratosB
  );
  const totalRecords = useSelector(
    (state: RootState) => state.tiposContratosB.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.tiposContratosB.loading
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
    JSON.stringify(searchParams.estatus),
  ]);

  useEffect(() => {
    getData();
  }, [
    token,
    searchParams.searchQuery,
    JSON.stringify(searchParams.estatus),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);
  const getData = async () => {
    if (!token) return;
    try {
      await dispatch(
        tiposContratosBActions.getTiposContratosB({
          token,
          params: {
            ...searchParams,
            page: currentPage,
            size: itemsPerPage,
          },
        })
      );
    } catch (error: any) {
      console.error("Error fetching tipos contratos bancarios:", error);
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
      <TableTitle title={"Tipos de contratos bancarios"} total={totalRecords} />
      <TiposContratosBTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        //getData={getData}
      />
      <TiposContratosBTable
        tiposContratosB={tiposContratosB}
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
