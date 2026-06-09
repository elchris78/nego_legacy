"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { usePagination } from "@/lib/hooks/usePagination";
import ClientTypesTable from "./components/table/ClientTypesTable";
import ClientTypesTableFilters from "./components/table/ClientTypesTableFilters";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";

import { ClientTypeParams } from "./services/clientTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import { clientTypesActions } from "./services/clientTypesSlice";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("TipoClientes");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] = useState<ClientTypeParams>({
    searchQuery: "",
    isActive: [],
  });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const clientTypes = useSelector(
    (state: RootState) => state.clientTypes.clientTypes
  );
  const totalRecords = useSelector(
    (state: RootState) => state.clientTypes.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.clientTypes.loading
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
    if (!token) return;
    dispatch(
      clientTypesActions.getClientTypes({
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
    currentPage,
    itemsPerPage,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-8 md:mt-12">
      <TableTitle title={"Tipos de clientes"} total={totalRecords} />
      <ClientTypesTableFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ClientTypesTable
        clientTypes={clientTypes}
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
