"use client";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import { getClientSubclassifications } from "./services/clientsSubclassificationSlice";
import { Pagination } from "@/components/ui/Tables/Pagination";
import { TableTitle } from "@/components/ui/Tables/TableTitle";
import { useKeyConfigValidation } from "@/app/configuracion/configuracion-sistemas/configuracion-claves/hooks/useKeyConfigValidation";
import { usePagination } from "@/lib/hooks/usePagination";
import ClientsSubclassificationsTable from "./components/table/ClientSubclassificationsTable";
import ClientsSubclassificationsTableFilter from "./components/table/ClientsSubclassificationsTableFilter";

import type { ClientSubclassificationParams } from "./services/clientsSubclassificationTypes";
import { AppDispatch, RootState } from "@/lib/store/store";
import Loading from "@/components/ui/Modals/loading";

const Page = () => {
  const token = Cookies.get("auth-token");
  const { isLoading: isKeyConfigLoading } = useKeyConfigValidation("SubclasificacionesClientes");

  // State to manage search parameters for data
  const [searchParams, setSearchParams] =
    useState<ClientSubclassificationParams>({
      searchQuery: "",
      isActive: [],
    });

  // Redux hooks
  const dispatch: AppDispatch = useDispatch();
  const classifications = useSelector(
    (state: RootState) =>
      state.clientSubclassification.clientSubclassificationsData
  );
  const totalRecords = useSelector(
    (state: RootState) => state.clientSubclassification.totalRegistros
  );
  const isLoading = useSelector(
    (state: RootState) => state.clientSubclassification.loading
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
      getClientSubclassifications({
        token,
        requestParams: {
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
    dispatch,
  ]);

  if (isKeyConfigLoading) {
    return <Loading />
  }

  return (
    <div className="mt-0 md:mt-12">
      <TableTitle title={"Subclasificación de clientes"} total={totalRecords} />
      <ClientsSubclassificationsTableFilter
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <ClientsSubclassificationsTable
        paginatedData={classifications}
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
