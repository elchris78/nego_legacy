"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import KeyConfigurationTable from "./components/table/KeyConfigurationTable";
import KeyConfigurationTableFilters from "./components/table/KeyConfigurationTableFilters";

import { KeyConfigurationParams } from "./services/keyConfigurationTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { keyConfigurationActions } from "./services/keyConfigurationSlice";

const Page = () => {
  const token = Cookies.get("auth-token");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<KeyConfigurationParams>({
    searchQuery: "",
    isActive: [],
    Modulo: [],
    Catalogo: [],
    TipoClave: [],
    TipoPrefijo: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const keyConfiguration = useSelector(
    (state: RootState) => state.keyConfigurationReducer.keyConfiguration
  );
  const totalRecords = useSelector(
    (state: RootState) => state.keyConfigurationReducer.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.keyConfigurationReducer.loading
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
      keyConfigurationActions.getKeyConfiguration({
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
    JSON.stringify(searchParams.Modulo),
    JSON.stringify(searchParams.Catalogo),
    JSON.stringify(searchParams.TipoClave),
    JSON.stringify(searchParams.TipoPrefijo),
    dispatch,
    currentPage,
    itemsPerPage,
  ]);


  return (
    <div className="mt-8 md:mt-12">
      <TableTitle
        title={"Definición de claves de catálogos"}
        total={totalRecords}
      />
      <KeyConfigurationTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <KeyConfigurationTable
        keyConfiguration={keyConfiguration}
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
